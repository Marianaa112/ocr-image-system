function ConfigView() {
  const { useState } = React;
  const [section, setSection] = useState("identidad");

  const sections = [
    { id: "identidad", label: "Identidad fiscal" },
    { id: "csd", label: "Certificado CSD" },
    { id: "defaults", label: "Defaults del CFDI" },
    { id: "pagos", label: "Formas y métodos de pago" },
    { id: "series", label: "Series y folios" },
    { id: "pac", label: "PAC y timbrado" },
  ];

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Configuración fiscal</h1>
          <div className="sub">Datos del emisor aplicados automáticamente a cada CFDI</div>
        </div>
        <div className="head-actions">
          <button className="btn primary"><IconCheck size={13} /> Guardar cambios</button>
        </div>
      </div>

      <div className="config-grid">
        <div className="config-nav">
          {sections.map(s => (
            <div key={s.id} className={`config-nav-item ${section === s.id ? "active" : ""}`} onClick={() => setSection(s.id)}>
              {s.label}
            </div>
          ))}
        </div>

        <div>
          {section === "identidad" && (
            <div className="panel">
              <div className="panel-head"><IconBuilding size={14} /><h2>Identidad fiscal del emisor</h2></div>
              <div className="panel-body">
                <div className="form-grid">
                  <div className="form-row">
                    <div className="field">
                      <label>RFC emisor <span className="req">*</span></label>
                      <input className="mono" defaultValue={EMISOR.rfc} maxLength={13} />
                    </div>
                    <div className="field">
                      <label>Razón social <span className="req">*</span></label>
                      <input defaultValue={EMISOR.razon} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="field">
                      <label>Régimen fiscal <span className="req">*</span></label>
                      <select defaultValue={EMISOR.regimen}>
                        {SAT_REGIMEN.map(r => <option key={r.c} value={r.c}>{r.c} — {r.d}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>CP de expedición <span className="req">*</span></label>
                      <input className="mono" defaultValue={EMISOR.cp} maxLength={5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "csd" && (
            <div className="panel">
              <div className="panel-head">
                <IconShield size={14} /><h2>Certificado de Sello Digital (CSD)</h2>
                <span className="pill" style={{ marginLeft: "auto" }}><span className="dot" /> Vigente</span>
              </div>
              <div className="panel-body">
                <div className="csd-card">
                  <div className="csd-icon">.cer</div>
                  <div className="csd-info">
                    <div className="file">CSD_{EMISOR.rfc}_2025.cer</div>
                    <div className="meta">Subido el 18 abr 2025 · 2.3 KB</div>
                  </div>
                  <div className="csd-status"><span className="status timbrada"><span className="dot" />Válido</span></div>
                </div>
                <div className="csd-card">
                  <div className="csd-icon">.key</div>
                  <div className="csd-info">
                    <div className="file">CSD_{EMISOR.rfc}_2025.key</div>
                    <div className="meta">Subido el 18 abr 2025 · 1.8 KB · cifrado</div>
                  </div>
                  <div className="csd-status"><span className="status timbrada"><span className="dot" />Válido</span></div>
                </div>
                <div className="form-row" style={{ marginTop: 14 }}>
                  <div className="field">
                    <label>No. de certificado</label>
                    <input className="mono" defaultValue={EMISOR.csdNum} readOnly />
                  </div>
                  <div className="field">
                    <label>Vencimiento</label>
                    <input className="mono" defaultValue={EMISOR.csdVence} readOnly />
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "defaults" && (
            <div className="panel">
              <div className="panel-head"><IconSparkle size={14} /><h2>Defaults por concepto</h2></div>
              <div className="panel-body">
                <div className="form-grid">
                  <div className="form-row">
                    <div className="field">
                      <label>Clave producto/servicio SAT</label>
                      <input className="mono" defaultValue={EMISOR.claveProd} />
                    </div>
                    <div className="field">
                      <label>Clave de unidad SAT</label>
                      <input className="mono" defaultValue={EMISOR.claveUnidad} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="field">
                      <label>Objeto de impuesto</label>
                      <select defaultValue={EMISOR.objImp}>
                        {SAT_OBJ_IMP.map(o => <option key={o.c} value={o.c}>{o.c} — {o.d}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>IVA por defecto</label>
                      <select defaultValue={EMISOR.ivaDefault}>
                        <option value={16}>16% — Tasa general</option>
                        <option value={8}>8% — Frontera</option>
                        <option value={0}>0% — Exento</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "pagos" && (
            <div className="panel">
              <div className="panel-head"><IconReceipt size={14} /><h2>Formas y métodos de pago</h2></div>
              <div className="panel-body">
                <div style={{ display: "grid", gap: 8 }}>
                  {SAT_FORMA_PAGO.map(f => (
                    <label key={f.c} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: "1px solid var(--rule)", borderRadius: 4, background: "var(--bg)", cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked={EMISOR.formasPago.includes(f.c)} />
                      <span className="mono" style={{ fontSize: 12, fontWeight: 500 }}>{f.c}</span>
                      <span>{f.d}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === "series" && (
            <div className="panel">
              <div className="panel-head"><IconFile size={14} /><h2>Series y consecutivo de folios</h2></div>
              <div className="panel-body">
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Serie</th><th>Tipo CFDI</th><th className="num">Próximo folio</th><th className="num">Emitidos</th></tr></thead>
                    <tbody>
                      <tr><td className="folio">A</td><td>Ingreso</td><td className="num">001285</td><td className="num dim">1,284</td></tr>
                      <tr><td className="folio">B</td><td>Nota de crédito</td><td className="num">000042</td><td className="num dim">41</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {section === "pac" && (
            <div className="panel">
              <div className="panel-head"><IconShield size={14} /><h2>PAC y timbrado</h2></div>
              <div className="panel-body">
                <div className="form-row">
                  <div className="field">
                    <label>PAC actual</label>
                    <select defaultValue="sw">
                      <option value="sw">SW Smarter Web — SPR190613I52</option>
                      <option value="ed">EDICOM — EDI160517KX1</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Ambiente</label>
                    <select defaultValue="prod">
                      <option value="prod">Producción</option>
                      <option value="test">Pruebas (sandbox)</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--green-soft)", border: "1px solid #c8d6c5", borderRadius: 4, fontSize: 12, color: "var(--green)", display: "flex", alignItems: "center", gap: 10 }}>
                  <IconCheck size={14} /> Conexión validada · Saldo: 8,420 timbres
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
