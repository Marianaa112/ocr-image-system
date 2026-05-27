function CFDIPreviewModal({ cliente, productos, fecha, formaPago, metodoPago, subtotal, iva, ivaPct, total, onClose, onConfirm }) {
  const folio = "A-001285";
  const uuid = "B7F4D9E2-3A1C-4F8D-9E5B-A8C7D6F2E1B4";
  const regimen = SAT_REGIMEN.find(r => r.c === cliente.regimen)?.d || "";
  const uso = SAT_USO_CFDI.find(u => u.c === cliente.uso)?.d || "";
  const formaPagoDesc = SAT_FORMA_PAGO.find(f => f.c === formaPago)?.d || "";
  const metodoPagoDesc = SAT_METODO_PAGO.find(m => m.c === metodoPago)?.d || "";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <IconShield size={16} />
          <div>
            <h2>Vista previa del CFDI 4.0</h2>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Confirma antes de enviar al PAC para timbrado</div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ marginLeft: "auto" }}><IconX size={14} /></button>
        </div>

        <div className="modal-body">
          <div className="cfdi">
            <div className="cfdi-head">
              <div>
                <div className="doc-title">Comprobante Fiscal Digital · CFDI 4.0</div>
                <div className="doc-folio">{folio}</div>
              </div>
              <div className="doc-meta">
                Fecha {fecha}<br/>
                Serie A · Folio {folio.split("-")[1]}<br/>
                Lugar exp. CP {EMISOR.cp}<br/>
                Tipo Ingreso (I)
              </div>
            </div>

            <div className="cfdi-parties">
              <div className="cfdi-party">
                <h4>Emisor</h4>
                <div className="name">{EMISOR.razon}</div>
                <div className="line">RFC: {EMISOR.rfc}<br/>Régimen: {EMISOR.regimen}<br/>CP expedición: {EMISOR.cp}</div>
              </div>
              <div className="cfdi-party">
                <h4>Receptor</h4>
                <div className="name">{cliente.razon}</div>
                <div className="line">
                  RFC: {cliente.rfc}<br/>
                  Régimen: {cliente.regimen} — {regimen.slice(0, 30)}<br/>
                  CP fiscal: {cliente.cp}<br/>
                  Uso CFDI: {cliente.uso} — {uso}
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style={{ width: 50 }}>Cant.</th>
                  <th>Descripción</th>
                  <th style={{ width: 80 }} className="num">P. Unit.</th>
                  <th style={{ width: 80 }} className="num">Importe</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td className="num">{p.cantidad}</td>
                    <td>
                      <div>{p.descripcion}</div>
                      <div style={{ fontSize: 9, color: "#888", fontFamily: "IBM Plex Mono, monospace", marginTop: 2 }}>
                        Clave: {p.claveProd} · Unidad: {p.claveUnidad}
                      </div>
                    </td>
                    <td className="num">${fmtRaw(p.precioUnit)}</td>
                    <td className="num">${fmtRaw(p.cantidad * p.precioUnit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 11, color: "#555", fontFamily: "IBM Plex Mono, monospace" }}>
              <div>
                Forma de pago: {formaPago} — {formaPagoDesc}<br/>
                Método de pago: {metodoPago} — {metodoPagoDesc}<br/>
                Moneda: MXN
              </div>
              <div className="cfdi-totals">
                <div className="trow"><span>Subtotal</span><span className="val">${fmtRaw(subtotal)}</span></div>
                <div className="trow"><span>IVA {ivaPct}%</span><span className="val">${fmtRaw(iva)}</span></div>
                <div className="trow grand"><span>Total</span><span className="val">${fmtRaw(total)} MXN</span></div>
              </div>
            </div>

            <div className="cfdi-foot">
              <div className="stamp-info">
                UUID: {uuid}<br/>
                Sello CFDI: nWqK8/Lj3pX7+vR2tA9bC4dE5fG6hH7iJ8kL9mN0oP1...<br/>
                Cert. SAT: {EMISOR.csdNum}<br/>
                Fecha timbrado: {fecha}T14:35:22 · RFC PAC: SPR190613I52
              </div>
              <div className="cfdi-qr"><FakeQR size={120} /></div>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
            Al confirmar, el documento se sellará con tu CSD y se enviará al PAC.
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className="btn" onClick={onClose}>Volver a editar</button>
            <button className="btn success" onClick={onConfirm}>
              <IconShield size={13} /> Timbrar CFDI · {fmt(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
