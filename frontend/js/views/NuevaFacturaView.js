function NuevaFacturaView({ onCancel, onTimbrar, onGoConfig }) {
  const { useState, useRef } = React;
  const [phase, setPhase] = useState("idle"); // idle | uploading | processing | ready | error
  const [ticket, setTicket] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const [cliente, setCliente] = useState({ rfc: "", razon: "", regimen: "612", cp: "", uso: "G03", correo: "" });
  const [productos, setProductos] = useState([]);
  const [fecha, setFecha] = useState("");
  const [formaPago, setFormaPago] = useState("99");
  const [metodoPago, setMetodoPago] = useState("PUE");
  const [ivaPct, setIvaPct] = useState(16);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setPhase("uploading");
    setErrorMsg("");

    try {
      const invoice = await api.createInvoice(file);
      setPhase("processing");

      const processed = await api.pollInvoice(invoice.id);
      setPhase("ready");

      setTicket(processed);
      if (processed.fecha) setFecha(processed.fecha);
      if (processed.forma_pago_detectada) setFormaPago(mapFormaPago(processed.forma_pago_detectada));
    } catch (e) {
      setPhase("error");
      setErrorMsg(e.message || "Error al procesar el ticket");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setPhase("idle");
    setTicket(null);
    setFileName("");
    setErrorMsg("");
    setProductos([]);
    setFecha("");
    setFormaPago("99");
  };

  const subtotal = productos.reduce((s, p) => s + p.cantidad * p.precioUnit, 0);
  const iva = subtotal * (ivaPct / 100);
  const total = subtotal + iva;

  const updateProducto = (id, field, val) => setProductos(p => p.map(x => x.id === id ? { ...x, [field]: val } : x));
  const removeProducto = (id) => setProductos(p => p.filter(x => x.id !== id));
  const addProducto = () => setProductos(p => [...p, { id: Date.now(), descripcion: "", cantidad: 1, precioUnit: 0, claveProd: "01010101", claveUnidad: "ACT" }]);

  const clienteValid = cliente.rfc.length >= 12 && cliente.razon.length > 3 && cliente.cp.length === 5 && cliente.correo.includes("@");

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Nueva factura</h1>
          <div className="sub">Sube la foto del ticket — OCR extrae los datos automáticamente</div>
        </div>
        <div className="head-actions">
          <button className="btn ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn success" disabled={!ticket || !clienteValid} onClick={() => setShowPreview(true)}>
            <IconShield size={13} /> Revisar y timbrar
          </button>
        </div>
      </div>

      <div className="emisor-lock">
        <IconLock size={16} />
        <div className="lock-text">
          Emisor: <strong>{EMISOR.razon}</strong> · RFC <span className="mono">{EMISOR.rfc}</span> · CSD vigente
        </div>
        <span className="lock-link" onClick={onGoConfig}>Ver configuración →</span>
      </div>

      <div className="nueva-grid">
        {/* LEFT: ticket */}
        <div>
          <div className="panel">
            <div className="panel-head">
              <IconReceipt size={15} />
              <h2>Ticket origen</h2>
              {phase === "ready" && <span className="pill" style={{ marginLeft: "auto" }}><span className="dot" /> OCR completo</span>}
              {phase === "processing" && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-3)", fontFamily: "monospace" }}>Analizando…</span>}
              {phase === "uploading" && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-3)", fontFamily: "monospace" }}>Subiendo…</span>}
            </div>
            <div className="panel-body">

              {phase === "idle" && (
                <div
                  className={`dropzone ${dragOver ? "over" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => handleFile(e.target.files[0])} />
                  <IconUpload size={28} strokeWidth={1.2} />
                  <div className="big">Arrastra la foto del ticket aquí</div>
                  <div>o haz clic para seleccionar</div>
                  <div className="formats">JPG · PNG · HEIC · hasta 8 MB</div>
                </div>
              )}

              {(phase === "uploading" || phase === "processing") && (
                <div>
                  <div className="ocr-status">
                    <IconSparkle size={14} />
                    <div style={{ flex: 1 }}>
                      <div>{phase === "uploading" ? "Subiendo imagen al servidor…" : "Reconociendo texto con Tesseract…"}</div>
                      <div className="ocr-bar"><div style={{ width: phase === "processing" ? "80%" : "40%" }} /></div>
                    </div>
                  </div>
                  <div style={{ height: 120, borderRadius: 4, background: "var(--bg-sunken)", display: "grid", placeItems: "center", color: "var(--ink-3)", fontSize: 11, fontFamily: "monospace" }}>
                    {fileName}
                  </div>
                </div>
              )}

              {phase === "error" && (
                <div className="ocr-status warn">
                  <IconX size={14} />
                  <div style={{ flex: 1 }}>{errorMsg}</div>
                  <button className="btn sm ghost" onClick={reset}><IconRefresh size={11} /> Reintentar</button>
                </div>
              )}

              {phase === "ready" && ticket && (
                <div>
                  <div className="ocr-status ready">
                    <IconCheck size={14} />
                    <div style={{ flex: 1 }}>
                      <strong>Texto extraído</strong> · {ticket.text_length} caracteres · {ticket.processing_time?.toFixed(2)}s
                    </div>
                    <button className="btn sm ghost" onClick={reset}><IconRefresh size={11} /> Reintentar</button>
                  </div>
                  <div className="ticket-frame">
                    <pre>{ticket.extracted_text}</pre>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "var(--ink-3)" }}>{fileName}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="panel">
          <div className="panel-head">
            <IconFile size={14} />
            <h2>Datos del CFDI</h2>
          </div>
          <div className="panel-body">
            {!ticket ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-3)" }}>
                <IconArrowRight size={18} style={{ opacity: 0.5 }} />
                <div style={{ marginTop: 10, fontSize: 13 }}>Sube un ticket para comenzar</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>Los campos se rellenarán automáticamente</div>
              </div>
            ) : (
              <div className="form-grid">
                <div className="form-row three">
                  <div className="field">
                    <label>Fecha emisión <span className="req">*</span><span className="ocr-tag">OCR</span></label>
                    <input type="text" className="mono" value={fecha} onChange={e => setFecha(e.target.value)}
                      onMouseEnter={() => setHighlight("fecha")} onMouseLeave={() => setHighlight(null)} />
                  </div>
                  <div className="field">
                    <label>Forma de pago<span className="ocr-tag">OCR</span></label>
                    <select value={formaPago} onChange={e => setFormaPago(e.target.value)}>
                      {SAT_FORMA_PAGO.map(f => <option key={f.c} value={f.c}>{f.c} — {f.d}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Método de pago</label>
                    <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                      {SAT_METODO_PAGO.map(m => <option key={m.c} value={m.c}>{m.c} — {m.d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="section-divider">Receptor (cliente)</div>

                <div className="cliente-block">
                  <div className="cliente-head">
                    <IconUser size={13} />
                    <strong style={{ fontSize: 13 }}>Datos fiscales del cliente</strong>
                  </div>
                  <div className="form-grid">
                    <div className="form-row">
                      <div className="field">
                        <label>RFC <span className="req">*</span></label>
                        <input className="mono" placeholder="XAXX010101000" maxLength={13}
                          value={cliente.rfc} onChange={e => setCliente({ ...cliente, rfc: e.target.value.toUpperCase() })} />
                      </div>
                      <div className="field">
                        <label>Nombre / Razón social <span className="req">*</span></label>
                        <input placeholder="Como aparece en la constancia SAT"
                          value={cliente.razon} onChange={e => setCliente({ ...cliente, razon: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-row three">
                      <div className="field">
                        <label>Régimen fiscal <span className="req">*</span></label>
                        <select value={cliente.regimen} onChange={e => setCliente({ ...cliente, regimen: e.target.value })}>
                          {SAT_REGIMEN.map(r => <option key={r.c} value={r.c}>{r.c} — {r.d}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>CP fiscal <span className="req">*</span></label>
                        <input className="mono" placeholder="00000" maxLength={5}
                          value={cliente.cp} onChange={e => setCliente({ ...cliente, cp: e.target.value })} />
                      </div>
                      <div className="field">
                        <label>Uso CFDI <span className="req">*</span></label>
                        <select value={cliente.uso} onChange={e => setCliente({ ...cliente, uso: e.target.value })}>
                          {SAT_USO_CFDI.map(u => <option key={u.c} value={u.c}>{u.c} — {u.d}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Correo electrónico <span className="req">*</span></label>
                      <input type="email" placeholder="contacto@empresa.com"
                        value={cliente.correo} onChange={e => setCliente({ ...cliente, correo: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="section-divider">Conceptos</div>

                <div className="productos">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>Cant.</th>
                        <th>Descripción</th>
                        <th style={{ width: 100 }}>Clave SAT</th>
                        <th style={{ width: 80 }}>Unidad</th>
                        <th style={{ width: 110 }}>P. unitario</th>
                        <th style={{ width: 110 }}>Importe</th>
                        <th style={{ width: 32 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((p, i) => (
                        <tr key={p.id}>
                          <td className="num"><input type="number" value={p.cantidad} onChange={e => updateProducto(p.id, "cantidad", +e.target.value)} /></td>
                          <td><input value={p.descripcion} onChange={e => updateProducto(p.id, "descripcion", e.target.value)} /></td>
                          <td><input className="mono" value={p.claveProd} onChange={e => updateProducto(p.id, "claveProd", e.target.value)} style={{ fontSize: 11 }} /></td>
                          <td><input className="mono" value={p.claveUnidad} onChange={e => updateProducto(p.id, "claveUnidad", e.target.value)} style={{ fontSize: 11 }} /></td>
                          <td className="num"><input type="number" step="0.01" value={p.precioUnit} onChange={e => updateProducto(p.id, "precioUnit", +e.target.value)} /></td>
                          <td className="num" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, paddingRight: 14, textAlign: "right" }}>{fmtRaw(p.cantidad * p.precioUnit)}</td>
                          <td><button className="icon-btn del-btn" onClick={() => removeProducto(p.id)}><IconTrash size={12} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="add-row">
                    <button className="btn sm ghost" onClick={addProducto}><IconPlus size={11} /> Agregar concepto</button>
                  </div>
                  <div className="totals">
                    <div className="label">Subtotal</div>
                    <div className="val">${fmtRaw(subtotal)}</div>
                    <div className="label">
                      IVA
                      <select value={ivaPct} onChange={e => setIvaPct(+e.target.value)} style={{ marginLeft: 8, border: "1px solid var(--rule)", padding: "1px 4px", borderRadius: 3, fontSize: 11 }}>
                        <option value={16}>16%</option>
                        <option value={8}>8%</option>
                        <option value={0}>0%</option>
                      </select>
                    </div>
                    <div className="val">${fmtRaw(iva)}</div>
                    <div className="grand label">Total MXN</div>
                    <div className="grand val">${fmtRaw(total)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {ticket && (
            <div className="form-actions">
              <div className="left" style={{ fontSize: 11, color: clienteValid ? "var(--green)" : "var(--ink-3)" }}>
                {clienteValid ? <><IconCheck size={12} /> Listo para timbrar</> : "Completa los datos del receptor"}
              </div>
              <div className="right">
                <button className="btn success" disabled={!clienteValid} onClick={() => setShowPreview(true)}>
                  Revisar y timbrar →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <CFDIPreviewModal
          cliente={cliente} productos={productos} fecha={fecha}
          formaPago={formaPago} metodoPago={metodoPago}
          subtotal={subtotal} iva={iva} ivaPct={ivaPct} total={total}
          onClose={() => setShowPreview(false)}
          onConfirm={() => { setShowPreview(false); onTimbrar && onTimbrar(); }}
        />
      )}
    </div>
  );
}
