import {
  EMISOR,
  SAT_REGIMEN,
  SAT_USO_CFDI,
  SAT_FORMA_PAGO,
  SAT_METODO_PAGO,
  fmtRaw,
} from '../data'

import {
  IconShield,
  IconX,
} from '../icons'

function CFDIPreviewModal({
  ticket,
  onClose,
  onTimbrar,
}) {
  const cliente =
    ticket?.cliente || {}

  const productos =
    ticket?.productos || []

  const fecha =
    ticket?.fecha || ''

  const formaPago =
    ticket?.formaPago || '99'

  const metodoPago =
    ticket?.metodoPago || 'PUE'

  const folio = 'A-001285'

  const uuid =
    'B7F4D9E2-3A1C-4F8D-9E5B-A8C7D6F2E1B4'

  const regimen =
    SAT_REGIMEN.find(
      (r) =>
        r.c ===
        (cliente?.regimen || '')
    )?.d || ''

  const uso =
    SAT_USO_CFDI.find(
      (u) =>
        u.c ===
        (cliente?.uso || '')
    )?.d || ''

  const formaPagoDesc =
    SAT_FORMA_PAGO.find(
      (f) =>
        f.c === formaPago
    )?.d || ''

  const metodoPagoDesc =
    SAT_METODO_PAGO.find(
      (m) =>
        m.c === metodoPago
    )?.d || ''

  // TOTAL AUTOMÁTICO
  const total = productos.reduce(
    (acc, p) =>
      acc +
      Number(
        p.cantidad || 1
      ) *
        Number(
          p.precioUnit || 0
        ),
    0
  )

  const clienteValid =
    cliente?.rfc?.trim()
      ?.length >= 12 &&
    cliente?.razon?.trim()
      ?.length > 3 &&
    cliente?.correo?.includes(
      '@'
    )

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-head">
          <IconShield size={16} />

          <div>
            <h2>
              Vista previa del CFDI
            </h2>

            <div
              style={{
                fontSize: 11,
                color:
                  'var(--ink-3)',
              }}
            >
              Confirma antes de
              timbrar
            </div>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
            style={{
              marginLeft:
                'auto',
            }}
          >
            <IconX size={14} />
          </button>
        </div>

        <div className="modal-body">
          <div className="cfdi">
            <div className="cfdi-head">
              <div>
                <div className="doc-title">
                  CFDI 4.0
                </div>

                <div className="doc-folio">
                  {folio}
                </div>
              </div>

              <div className="doc-meta">
                Fecha{' '}
                {fecha || '—'}
                <br />
                Serie A · Folio{' '}
                {
                  folio.split(
                    '-'
                  )[1]
                }
                <br />
                Lugar exp. CP{' '}
                {
                  EMISOR.cp
                }
                <br />
                Tipo ingreso
                (I)
              </div>
            </div>

            <div className="cfdi-parties">
              <div className="cfdi-party">
                <h4>
                  Emisor
                </h4>

                <div className="name">
                  {
                    EMISOR.razon
                  }
                </div>

                <div className="line">
                  RFC:{' '}
                  {
                    EMISOR.rfc
                  }
                  <br />
                  Régimen:{' '}
                  {
                    EMISOR.regimen
                  }
                  <br />
                  CP expedición:{' '}
                  {
                    EMISOR.cp
                  }
                </div>
              </div>

              <div className="cfdi-party">
                <h4>
                  Receptor
                </h4>

                <div className="name">
                  {cliente.razon}
                </div>

                <div className="line">
                  RFC:{' '}
                  {
                    cliente.rfc
                  }
                  <br />
                  Régimen:{' '}
                  {
                    cliente.regimen
                  }{' '}
                  —{' '}
                  {regimen}
                  <br />
                  Uso CFDI:{' '}
                  {
                    cliente.uso
                  }{' '}
                  — {uso}
                  <br />
                  Correo:{' '}
                  {
                    cliente.correo
                  }
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th
                    style={{
                      width: 80,
                    }}
                  >
                    Cant.
                  </th>

                  <th>
                    Descripción
                  </th>

                  <th
                    className="num"
                    style={{
                      width: 120,
                    }}
                  >
                    Precio
                  </th>

                  <th
                    className="num"
                    style={{
                      width: 120,
                    }}
                  >
                    Importe
                  </th>
                </tr>
              </thead>

              <tbody>
                {productos.map(
                  (p, i) => (
                    <tr
                      key={
                        p.id ||
                        i
                      }
                    >
                      <td className="num">
                        {
                          p.cantidad
                        }
                      </td>

                      <td>
                        {
                          p.descripcion
                        }
                      </td>

                      <td className="num">
                        $
                        {fmtRaw(
                          p.precioUnit
                        )}
                      </td>

                      <td className="num">
                        $
                        {fmtRaw(
                          Number(
                            p.cantidad
                          ) *
                            Number(
                              p.precioUnit
                            )
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'space-between',
                marginTop: 18,
                fontSize: 11,
                color:
                  '#555',
                fontFamily:
                  'IBM Plex Mono, monospace',
              }}
            >
              <div>
                Forma de pago:{' '}
                {
                  formaPago
                }{' '}
                —{' '}
                {
                  formaPagoDesc
                }
                <br />
                Método de pago:{' '}
                {
                  metodoPago
                }{' '}
                —{' '}
                {
                  metodoPagoDesc
                }
                <br />
                Moneda: MXN
              </div>

              <div className="cfdi-totals">
                <div className="trow grand">
                  <span>
                    Total
                  </span>

                  <span className="val">
                    $
                    {fmtRaw(
                      total
                    )}{' '}
                    MXN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button
            className="btn"
            onClick={onClose}
          >
            Volver a editar
          </button>

          <button
            className="btn success"
            disabled={
              !clienteValid
            }
            onClick={() =>
              onTimbrar(
                ticket
              )
            }
            style={{
              marginLeft:
                'auto',
            }}
          >
            <IconShield size={13} />
            Revisar y timbrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CFDIPreviewModal