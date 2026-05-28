import { useState, useRef, useEffect } from 'react'
import { api } from '../api'

import {
  IconShield,
  IconLock,
  IconReceipt,
  IconUpload,
} from '../icons'

import {
  EMISOR,
  mapFormaPago,
  SAT_REGIMEN,
  SAT_USO_CFDI,
  SAT_FORMA_PAGO,
  SAT_METODO_PAGO,
  fmtRaw,
} from '../data'

import CFDIPreviewModal from './CFDIPreviewModal'

export default function NuevaFacturaView({
  onCancel,
  onTimbrar,
  onGoConfig,
}) {
  const [phase, setPhase] = useState('idle')
  const [ticket, setTicket] = useState(null)
  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // CLIENTE EDITABLE
  const [cliente, setCliente] = useState({
    rfc: '',
    razon: '',
    regimen: '612',
    cp: '',
    uso: 'G03',
    correo: '',
  })

  const [productos, setProductos] = useState([])
  const [fecha, setFecha] = useState('')
  const [formaPago, setFormaPago] = useState('99')

  const fileRef = useRef()

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFile = async (file) => {
    if (!file) return

    setFileName(file.name)
    setErrorMsg('')

    if (previewUrl) {
        URL.revokeObjectURL(
        previewUrl
        )
    }

    setPreviewUrl(
        URL.createObjectURL(file)
    )

    setPhase('uploading')

    try {
        const invoice =
        await api.createInvoice(file)

        setPhase('processing')

        const processed =
        await api.pollInvoice(
            invoice.id
        )

        console.log(processed)
        console.log(processed.productos)

        setTicket(processed)
        setPhase('ready')

        // OCR → FECHA
        if (processed.fecha) {
        setFecha(processed.fecha)
        } else {
        const text =
            processed.extracted_text ||
            processed.ocr_text ||
            ''

        const match = text.match(
            /(\d{1,2})\s+(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC)\s+(\d{4})/i
        )

        if (match) {
            const meses = {
            ENE: '01',
            FEB: '02',
            MAR: '03',
            ABR: '04',
            MAY: '05',
            JUN: '06',
            JUL: '07',
            AGO: '08',
            SEP: '09',
            OCT: '10',
            NOV: '11',
            DIC: '12',
            }

            const dia = match[1]
            .padStart(2, '0')

            const mes =
            meses[
                match[2].toUpperCase()
            ]

            const anio = match[3]

            setFecha(
            `${anio}-${mes}-${dia}`
            )
        }
        }

        // OCR → FORMA DE PAGO
        if (processed.forma_pago_detectada) {
        const raw = processed.forma_pago_detectada.toUpperCase()

        if (raw.includes('TARJETA')) {
            const text = (processed.extracted_text || processed.ocr_text || '').toUpperCase()

            const isDebito = text.includes('DEBITO') || text.includes('DESITO')
            const isCredito = text.includes('CREDITO')

            if (isDebito) setFormaPago('28')
            else if (isCredito) setFormaPago('04')
            else setFormaPago('04') // default tarjeta
        } else {
            setFormaPago(mapFormaPago(raw) || '99')
        }
        }

        // OCR → CLIENTE
        setCliente((prev) => ({
        ...prev,
        rfc:
            processed.rfc_receptor ||
            processed.rfc ||
            '',
        razon:
            processed.razon_social ||
            processed.nombre ||
            '',
        cp:
            processed.cp ||
            processed.codigo_postal ||
            '',
        correo:
            processed.correo ||
            '',
        regimen:
            processed.regimen_fiscal ||
            '612',
        uso:
            processed.uso_cfdi ||
            'G03',
        }))

        // OCR → PRODUCTOS / TOTAL
            if (
            processed.productos &&
            processed.productos.length
            ) {
            setProductos(
                processed.productos.map(
                (p, index) => ({
                    id:
                    p.id ||
                    Date.now() + index,
                    descripcion:
                    p.descripcion ||
                    '',
                    cantidad:
                    Number(
                        p.cantidad
                    ) || 1,
                    precioUnit:
                    Number(
                        p.precioUnit ??
                        p.precio ??
                        p.importe ??
                        p.total ??
                        0
                    ) || 0,
                    claveProd:
                    p.claveProd ||
                    EMISOR.claveProd,
                    claveUnidad:
                    p.claveUnidad ||
                    EMISOR.claveUnidad,
                })
                )
            )
            } else {
                const text =
        processed.extracted_text ||
        ''

    // intenta varias formas comunes
    const patterns = [
        /IMPORTE\s*\$?\s*([\d,.]+)/i,
        /TOTAL\s*\$?\s*([\d,.]+)/i,
        /TOTAL\s*MXN\s*\$?\s*([\d,.]+)/i,
        /IMPORTE\s*TOTAL\s*\$?\s*([\d,.]+)/i,
        /MONTO\s*\$?\s*([\d,.]+)/i,
    ]

    let importe = 0

    for (const pattern of patterns) {
        const match =
        text.match(pattern)

        if (match) {
        importe =
            Number(
            match[1].replace(
                /,/g,
                ''
            )
            ) || 0

        if (importe > 0) break
        }
    }

    // tomar el número monetario más grande
    if (!importe) {
        const nums =
        text.match(
            /\d+[.,]\d{2}/g
        ) || []

        if (nums.length) {
        importe = Math.max(
            ...nums.map((n) =>
            Number(
                n.replace(/,/g, '')
            )
            )
        )
        }
    }

    if (importe > 0) {
        setProductos([
        {
            id: Date.now(),
            descripcion:
            'Compra ticket',
            cantidad: 1,
            precioUnit: importe,
            claveProd:
            EMISOR.claveProd,
            claveUnidad:
            EMISOR.claveUnidad,
        },
        ])
    }
    }
    } catch (e) {
        setPhase('error')

        setErrorMsg(
        e.message ||
            'Error al procesar ticket'
        )
    }
    }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    const file =
      e.dataTransfer.files[0]

    if (file) handleFile(file)
  }

  const reset = () => {
    setPhase('idle')
    setTicket(null)
    setFileName('')
    setErrorMsg('')
    setProductos([])
    setFecha('')
    setFormaPago('99')

    setCliente({
      rfc: '',
      razon: '',
      regimen: '612',
      cp: '',
      uso: 'G03',
      correo: '',
    })

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl('')
  }

  const clienteValid =
  cliente.rfc.trim().length >= 12 &&
  cliente.razon.trim().length > 3 &&
  cliente.cp.trim().length === 5 &&
  /^\S+@\S+\.\S+$/.test(
    cliente.correo.trim()
  )

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Nueva factura</h1>

          <div className="sub">
            Sube la foto del ticket —
            OCR extrae los datos
            automáticamente
          </div>
        </div>

        <div className="head-actions">
          <button
            className="btn ghost"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="btn success"
            disabled={
              !ticket ||
              !clienteValid
            }
            onClick={() =>
              setShowPreview(true)
            }
          >
            <IconShield size={13} />
            Revisar y timbrar
          </button>
        </div>
      </div>

      <div className="emisor-lock">
        <IconLock size={16} />

        <div className="lock-text">
          Emisor:
          <strong>
            {' '}
            {EMISOR.razon}
          </strong>
          {' '}· RFC{' '}
          <span className="mono">
            {EMISOR.rfc}
          </span>{' '}
          · CSD vigente
        </div>

        <span
          className="lock-link"
          onClick={onGoConfig}
        >
          Ver configuración →
        </span>
      </div>

      <div className="nueva-grid">
        {/* IZQUIERDA */}
        <div className="panel">
            <div className="panel-head">
            <IconReceipt size={15} />
            <h2>Ticket origen</h2>
            </div>

            <div className="panel-body">

            {phase === 'idle' ? (
                <div
                className={`dropzone ${
                    dragOver ? 'over' : ''
                }`}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                }}
                onDragLeave={() =>
                    setDragOver(false)
                }
                onDrop={handleDrop}
                onClick={() =>
                    fileRef.current.click()
                }
                >
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    style={{
                    display: 'none',
                    }}
                    onChange={(e) =>
                    handleFile(
                        e.target.files?.[0]
                    )
                    }
                />

                <IconUpload size={28} />

                <div className="big">
                    Arrastra ticket aquí
                </div>

                <div>
                    o haz clic para subir
                </div>
                </div>
            ) : (
                <>
                <strong>{fileName}</strong>

                <div
                    style={{
                    marginTop: 16,
                    }}
                >
                    {previewUrl &&
                    fileName
                    .toLowerCase()
                    .endsWith('.pdf') ? (
                    <iframe
                        src={previewUrl}
                        title="PDF"
                        style={{
                        width: '100%',
                        height: '420px',
                        border:
                            '1px solid #ddd',
                        borderRadius: 12,
                        }}
                    />
                    ) : (
                    previewUrl && (
                        <img
                        src={previewUrl}
                        alt="preview"
                        style={{
                            width: '100%',
                            maxHeight: 420,
                            objectFit:
                            'contain',
                            border:
                            '1px solid #ddd',
                            borderRadius: 12,
                        }}
                        />
                    )
                    )}
                </div>

                <div
                    className="section-divider"
                    style={{
                    marginTop: 20,
                    }}
                >
                    OCR extraído
                </div>

                <div className="ticket-frame">
                    <pre>
                    {ticket?.extracted_text ||
                        ticket?.ocr_text ||
                        'No OCR'}
                    </pre>
                </div>

                <button
                    className="btn ghost"
                    style={{
                    marginTop: 20,
                    }}
                    onClick={reset}
                >
                    Cambiar archivo
                </button>
                </>
            )}
            </div>
        </div>

        {/* DERECHA */}
        <div className="panel">
            <div className="panel-head">
            <h2>Datos del CFDI</h2>
            </div>

            <div className="panel-body">

            <div className="form-grid">

                {/* FECHA + FORMA PAGO */}
                <div className="form-row">
                <div className="field">
                    <label>
                        Fecha emisión
                    </label>

                    <input
                        type="text"
                        value={fecha || 'No detectada'}
                        readOnly
                    />
                    </div>

                <div className="field">
                    <label>
                    Forma de pago
                    </label>

                    <select
                    value={formaPago}
                    onChange={(e) =>
                        setFormaPago(
                        e.target.value
                        )
                    }
                    >
                    {SAT_FORMA_PAGO.map(
                        (fp) => (
                        <option
                            key={fp.c}
                            value={fp.c}
                        >
                            {fp.c} — {fp.d}
                        </option>
                        )
                    )}
                    </select>
                </div>
                </div>

                {/* CLIENTE */}
                <div className="section-divider">
                Datos fiscales del cliente
                </div>

                <div className="form-row">
                <div className="field">
                    <label>RFC</label>

                    <input
                    value={cliente.rfc}
                    onChange={(e) =>
                        setCliente({
                        ...cliente,
                        rfc:
                            e.target.value.toUpperCase(),
                        })
                    }
                    />
                </div>

                <div className="field">
                    <label>
                    Razón social
                    </label>

                    <input
                    value={
                        cliente.razon
                    }
                    onChange={(e) =>
                        setCliente({
                        ...cliente,
                        razon:
                            e.target.value,
                        })
                    }
                    />
                </div>
                </div>

                <div className="form-row three">
                <div className="field">
                    <label>
                    Régimen fiscal
                    </label>

                    <select
                    value={
                        cliente.regimen
                    }
                    onChange={(e) =>
                        setCliente({
                        ...cliente,
                        regimen:
                            e.target.value,
                        })
                    }
                    >
                    {SAT_REGIMEN.map(
                        (r) => (
                        <option
                            key={r.c}
                            value={r.c}
                        >
                            {r.c} — {r.d}
                        </option>
                        )
                    )}
                    </select>
                </div>

                <div className="field">
                    <label>
                    Uso CFDI
                    </label>

                    <select
                    value={cliente.uso}
                    onChange={(e) =>
                        setCliente({
                        ...cliente,
                        uso:
                            e.target.value,
                        })
                    }
                    >
                    {SAT_USO_CFDI.map(
                        (u) => (
                        <option
                            key={u.c}
                            value={u.c}
                        >
                            {u.c} — {u.d}
                        </option>
                        )
                    )}
                    </select>
                </div>

                <div className="field">
                    <label>
                    Código postal
                    </label>

                    <input
                    value={cliente.cp}
                    onChange={(e) =>
                        setCliente({
                        ...cliente,
                        cp:
                            e.target.value,
                        })
                    }
                    />
                </div>
                </div>

                <div className="field">
                <label>
                    Correo electrónico
                </label>

                <input
                    type="email"
                    value={
                    cliente.correo
                    }
                    onChange={(e) =>
                    setCliente({
                        ...cliente,
                        correo:
                        e.target.value,
                    })
                    }
                />
                </div>

                {/* PRODUCTOS */}
                <div className="section-divider">
                Productos
                </div>

                <div className="productos">
                <table>
                    <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Cant.</th>
                        <th>Precio</th>
                        <th>Importe</th>
                    </tr>
                    </thead>

                    <tbody>
                    {productos.map(
                        (p, i) => (
                        <tr key={i}>
                            <td>
                            {
                                p.descripcion
                            }
                            </td>

                            <td>
                            {p.cantidad}
                            </td>

                            <td>
                            {fmtRaw(
                                p.precioUnit
                            )}
                            </td>

                            <td>
                            {fmtRaw(
                                p.cantidad *
                                p.precioUnit
                            )}
                            </td>
                        </tr>
                        )
                    )}
                    </tbody>
                </table>

                <div className="totals">
                    <div className="label">
                    Subtotal
                    </div>

                    <div className="val">
                    {fmtRaw(
                        productos.reduce(
                        (acc, p) =>
                            acc +
                            p.cantidad *
                            p.precioUnit,
                        0
                        )
                    )}
                    </div>

                    <div className="label">
                    IVA
                    </div>

                    <div className="val">
                    {fmtRaw(
                        productos.reduce(
                        (acc, p) =>
                            acc +
                            p.cantidad *
                            p.precioUnit,
                        0
                        ) * 0.16
                    )}
                    </div>

                    <div className="label grand">
                    Total
                    </div>

                    <div className="val grand">
                    {fmtRaw(
                        productos.reduce(
                        (acc, p) =>
                            acc +
                            p.cantidad *
                            p.precioUnit,
                        0
                        ) * 1.16
                    )}
                    </div>
                </div>
                </div>

                {/* BOTONES */}
                <div className="form-actions">
                <button
                    className="btn"
                >
                    Guardar borrador
                </button>

                <div className="right">
                    <button
                    className="btn success"
                    disabled={
                        !ticket ||
                        !clienteValid
                    }
                    onClick={() =>
                        setShowPreview(
                        true
                        )
                    }
                    >
                    <IconShield
                        size={13}
                    />
                    Revisar y timbrar
                    </button>
                </div>
                </div>

            </div>
            </div>
        </div>
        </div>

      {showPreview &&
        ticket && (
          <CFDIPreviewModal
            ticket={{
              ...ticket,
              cliente,
              productos,
              fecha,
              formaPago,
            }}
            onClose={() =>
              setShowPreview(
                false
              )
            }
            onTimbrar={
              onTimbrar
            }
          />
        )}
    </div>
  )
}