import { useState } from 'react'

import './styles/main.css'

import { EMISOR } from './data'

import {
  IconFile,
  IconPlus,
  IconSettings,
  IconUser,
  IconCheck,
} from './icons'

import FacturasView from './views/FacturasView'
import NuevaFacturaView from './views/NuevaFacturaView'
import ConfigView from './views/ConfigView'

export default function App() {
  const [view, setView] = useState('facturas')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }

  const handleTimbrar = () => {
    setView('facturas')
    showToast('CFDI timbrado correctamente · enviado por correo')
  }

  const topbarLabel = {
    facturas: 'Facturas emitidas',
    nueva: 'Nueva factura desde ticket',
    config: 'Configuración fiscal',
  }[view]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">Q</div>

          <div>
            <div className="brand-name">Quotis</div>
          </div>

          <div className="brand-meta">v 2.4</div>
        </div>

        <div className="nav-label">Facturación</div>

        <button
          className={`nav-item ${view === 'facturas' ? 'active' : ''}`}
          onClick={() => setView('facturas')}
        >
          <IconFile size={14} />
          Facturas
          <span className="kbd">⌘1</span>
        </button>

        <button
          className={`nav-item ${view === 'nueva' ? 'active' : ''}`}
          onClick={() => setView('nueva')}
        >
          <IconPlus size={14} />
          Nueva desde ticket
          <span className="kbd">⌘N</span>
        </button>

        <div className="nav-label">Ajustes</div>
        <div className="nav-label">Ajustes</div>

        <button
          className={`nav-item ${view === 'config' ? 'active' : ''}`}
          onClick={() => setView('config')}
        >
          <IconSettings size={14} />
          Configuración
          <span className="kbd">⌘,</span>
        </button>

        <div className="sidebar-foot">
          <div>
            <strong>{EMISOR.razon}</strong>
          </div>

          <div className="mono" style={{ marginTop: 2 }}>
            RFC {EMISOR.rfc}
          </div>
          <div style={{ marginTop: 6 }}>
            <span
              className="status timbrada"
              style={{ padding: '1px 6px', fontSize: 10 }}
            >
              <span className="dot" />
              CSD vigente
            </span>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            Quotis · <strong>{topbarLabel}</strong>
          </div>

          <div className="topbar-right">
            <span className="pill">
              <span className="dot" />
              PAC conectado
            </span>
            <button
              className="icon-btn"
              style={{ width: 30, height: 30 }}
            >
              <IconUser size={14} />
            </button>
          </div>
        </div>

        {view === 'facturas' && (
          <FacturasView
            onNueva={() => setView('nueva')}
            onOpenFactura={(inv) =>
              showToast(
                `Ticket #${inv.id} · ${inv.text_length} caracteres extraídos`
              )
            }
          />
        )}
         {view === 'nueva' && (
          <NuevaFacturaView
            onCancel={() => setView('facturas')}
            onTimbrar={handleTimbrar}
            onGoConfig={() => setView('config')}
          />
        )}

        {view === 'config' && <ConfigView />}
      </main>

      {toast && (
        <div className="toast">
          <IconCheck size={14} stroke="#9bd6a8" />
          {toast}
        </div>
      )}
    </div>
  )
}
