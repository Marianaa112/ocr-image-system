function FacturasView({ onNueva, onOpenFactura }) {
  const { useState, useEffect, useMemo } = React;
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("todas");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listInvoices()
      .then(data => setInvoices(Array.isArray(data) ? data : data.results || []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      if (query) {
        const q = query.toLowerCase();
        if (!String(inv.id).includes(q) && !(inv.extracted_text || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [invoices, query]);

  const totals = useMemo(() => {
    const withTotal = invoices.filter(i => i.total);
    const sum = withTotal.reduce((s, i) => s + parseFloat(i.total || 0), 0);
    return { sum, count: invoices.length, processed: invoices.filter(i => i.text_length > 0).length };
  }, [invoices]);

  if (loading) {
    return <div className="content" style={{ color: "var(--ink-3)", paddingTop: 60, textAlign: "center" }}>Cargando facturas…</div>;
  }

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Facturas emitidas</h1>
          <div className="sub">Tickets procesados con OCR</div>
        </div>
        <div className="head-actions">
          <button className="btn primary" onClick={onNueva}><IconPlus size={13} /> Nueva factura</button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="label">Total facturado</div>
          <div className="val">{fmt(totals.sum)}</div>
        </div>
        <div className="kpi">
          <div className="label">Tickets subidos</div>
          <div className="val">{totals.count}</div>
        </div>
        <div className="kpi">
          <div className="label">Procesados OCR</div>
          <div className="val">{totals.processed}</div>
        </div>
        <div className="kpi">
          <div className="label">Pendientes</div>
          <div className="val">{totals.count - totals.processed}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <IconSearch size={14} />
          <input placeholder="Buscar por ID o texto…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-3)" }}>
          <strong style={{ color: "var(--ink)" }}>{filtered.length}</strong> resultados
        </div>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--ink-3)" }}>
            No hay tickets aún. <button className="btn sm" style={{ marginLeft: 8 }} onClick={onNueva}>Subir el primero</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th style={{ width: 120 }}>Fecha</th>
                <th>Texto extraído</th>
                <th style={{ width: 120 }} className="num">Total</th>
                <th style={{ width: 90 }}>IVA</th>
                <th style={{ width: 110 }}>Forma pago</th>
                <th style={{ width: 100 }}>Estado OCR</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} onClick={() => onOpenFactura && onOpenFactura(inv)}>
                  <td className="folio">{inv.id}</td>
                  <td className="dim mono" style={{ fontSize: 12 }}>{inv.fecha || inv.created_at?.slice(0, 10) || "—"}</td>
                  <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--ink-2)", fontSize: 12 }}>
                    {inv.extracted_text ? inv.extracted_text.slice(0, 80) + "…" : <span style={{ color: "var(--ink-3)" }}>Pendiente…</span>}
                  </td>
                  <td className="num">{inv.total ? fmtRaw(inv.total) : "—"}</td>
                  <td className="num" style={{ fontSize: 12 }}>{inv.iva ? fmtRaw(inv.iva) : "—"}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{inv.forma_pago_detectada || "—"}</td>
                  <td>
                    {inv.text_length > 0
                      ? <span className="status timbrada"><span className="dot" />Listo</span>
                      : <span className="status pendiente"><span className="dot" />Procesando</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="pagination">
          <span>{filtered.length} resultados</span>
        </div>
      </div>
    </div>
  );
}
