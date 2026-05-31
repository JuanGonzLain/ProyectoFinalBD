// EstadoPagos.jsx
import { useState } from 'react'

// ENTRADA DE DATOS: Estructura de datos estática para la simulación del estado de cuenta financiero.
// REEMPLAZAR POR CONSULTA DE BASE DE DATOS REAL (Ej: Consultas relacionales a la tabla de facturación del estudiante).
const PAGOS = [
  { id: 1, concepto: 'Matrícula 2025-1', fecha: '15 Feb 2025', monto: 4320000, estado: 'pendiente' },
  { id: 2, concepto: 'Matrícula 2024-2', fecha: '10 Oct 2024', monto: 4150000, estado: 'pagado' },
  { id: 3, concepto: 'Matrícula 2024-1', fecha: '08 Feb 2024', monto: 3980000, estado: 'pagado' },
  { id: 4, concepto: 'Matrícula 2023-2', fecha: '12 Aug 2023', monto: 3750000, estado: 'pagado' },
  { id: 5, concepto: 'Matrícula 2023-1', fecha: '10 Feb 2023', monto: 3600000, estado: 'pagado' },
  { id: 6, concepto: 'Derechos de grado', fecha: '—',          monto: 850000,  estado: 'pendiente' },
]

// Diccionario global de estados para homologación y control de badges financieros,REEMPLAZAR POR DEFINICIÓN DE ESTADOS EN LA BASE DE DATOS 
const BADGE = {
  pagado:    { background: '#EAF3DE', color: '#3B6D11', label: 'Pagado'    },
  pendiente: { background: '#FAEEDA', color: '#854F0B', label: 'Pendiente' },
  vencido:   { background: '#FCEBEB', color: '#A32D2D', label: 'Vencido'   },
}

// Función auxiliar de formateo monetario internacionalizado según el estándar es-CO (Pesos Colombianos)
function formatPesos(n) {
  return '$ ' + n.toLocaleString('es-CO')
}

// Función principal del submódulo: Renderiza el estado financiero y la pasarela de control de cobros del estudiante.
export default function EstadoPagos() {
  // Estado local para manejar el criterio de filtrado activo en la grilla de registros
  const [filtro, setFiltro] = useState('todos')

  // LÓGICA DE PROCESAMIENTO: Operaciones analíticas sobre los vectores de datos financieros, recuperar estado de BD
  const pagados   = PAGOS.filter(p => p.estado === 'pagado')
  const pendientes = PAGOS.filter(p => p.estado === 'pendiente')
  
  // Cálculo acumulativo del saldo en cartera pendiente utilizando reducción de vectores, seccion usada mas para 
  // backend pero se deja aqui para simular el modelo completo de procesamiento de datos en el frontend
  const totalPendiente = pendientes.reduce((acc, p) => acc + p.monto, 0)

  // Evaluación condicional para la renderización de la lista según el filtro reactivo seleccionado
  const pagosFiltrados = filtro === 'todos' ? PAGOS : PAGOS.filter(p => p.estado === filtro)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* BLOQUE DE ESTADÍSTICAS GENERALES: Tarjetas de resumen del estado de cuenta de la matrícula */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total pagos realizados</div>
          <div style={s.statVal}>{pagados.length}</div>
          <span style={{ ...s.pill, ...BADGE.pagado, marginTop: 4, display: 'inline-block' }}>Al día</span>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Pagos pendientes</div>
          <div style={s.statVal}>{pendientes.length}</div>
          {pendientes.length > 0 && <span style={{ ...s.pill, ...BADGE.pendiente, marginTop: 4, display: 'inline-block' }}>Atención</span>}
        </div>
        <div style={{ ...s.statCard, gridColumn: 'span 2', borderLeft: '3px solid #BA7517' }}>
          <div style={s.statLabel}>Saldo pendiente total</div>
          <div style={{ ...s.statVal, color: '#854F0B' }}>{formatPesos(totalPendiente)}</div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>Incluye matrícula y derechos de grado</div>
        </div>
      </div>

      {/* COMPONENTE DE ALERTA CONDICIONAL: Notificación restrictiva en caso de registrar deudas en cartera FUNCION PROPIA DE BACKEND, REEMPLAZAR POR CONSULTA A LA BD  + BACKEND*/}
      {pendientes.length > 0 && (
        <div style={s.alerta}>
          ⚠ Tienes {pendientes.length} pago(s) pendiente(s). Recuerda que el no pago puede afectar tu matrícula.
        </div>
      )}

      {/* PANEL CONTENEDOR PRINCIPAL: Historial detallado de transacciones financieras  REEMPLAZAR POR CONSULTA A LA BD */}
      <div style={s.panel}>
        <div style={s.panelHead}>
          <span style={s.panelTitle}>Historial de pagos</span>
          
          {/* Bloque de controles de filtrado reactivo */}
          <div style={s.filtros}>
            {['todos', 'pagado', 'pendiente'].map(f => (
              <button
                key={f}
                style={{ ...s.filtroBtn, ...(filtro === f ? s.filtroActivo : {}) }}
                onClick={() => setFiltro(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grilla/Tabla estructurada de registros de cobro */}
        <div style={s.panelBody}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Concepto</th>
                <th style={s.th}>Fecha límite</th>
                <th style={s.th}>Monto</th>
                <th style={s.th}>Estado</th>
                <th style={s.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td style={s.td}>{p.concepto}</td>
                  <td style={s.td}>{p.fecha}</td>
                  <td style={s.td}><strong>{formatPesos(p.monto)}</strong></td>
                  <td style={s.td}>
                    <span style={{ ...s.pill, ...BADGE[p.estado] }}>{BADGE[p.estado].label}</span>
                  </td>
                  
                  {/* Flujo condicional de botones según la persistencia del estado en el registro */}
                  <td style={s.td}>
                    {p.estado === 'pendiente'
                      ? <button style={s.btnPagar}>Pagar ahora</button> // REEMPLAZAR: Enlace o webhook hacia la pasarela de pagos (PSE / PayU).
                      : <button style={s.btnRecibo}>Ver recibo</button>  // REEMPLAZAR: Endpoint que sirve el documento PDF del recibo desde el almacenamiento.
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

// OBJETO DE ESTILOS LOCALES: Mapeo de reglas de diseño para el módulo de control financiero
const s = {
  statsRow:   { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:   { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:  { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:    { fontSize: 22, fontWeight: 500, color: '#111' },
  pill:       { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  alerta:     { background: '#FAEEDA', border: '0.5px solid #E8C07A', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#854F0B' },
  panel:      { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:  { padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { fontSize: 13, fontWeight: 500, color: '#111' },
  panelBody:  { padding: '0 16px 12px' },
  filtros:    { display: 'flex', gap: 6 },
  filtroBtn:  { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo:{ background: '#0C447C', color: '#fff', borderColor: '#0C447C' },
  table:      { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:         { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:         { padding: '9px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  btnPagar:   { fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', background: '#0C447C', color: '#fff', cursor: 'pointer', fontWeight: 500 },
  btnRecibo:  { fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '0.5px solid #ccc', background: '#fff', color: '#555', cursor: 'pointer' },
}