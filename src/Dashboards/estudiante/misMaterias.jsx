import { useState } from 'react'

// Estructura de datos alineada con el Dashboard Principal REEMPLAZAR POR CONSULTA REAL A LA BASE DE DATOS PARA OBTENER LAS ASIGNATURAS INSCRITAS DEL ESTUDIANTE AUTENTICADO Y SUS NOTAS POR CORTE, ASÍ COMO EL ESTADO ACADÉMICO ACTUAL DE CADA ASIGNATURA.
const MATERIAS_DETALLE = [
  { nombre: 'Bases de datos',        creditos: 4, c1: 4.2, c2: 3.9, def: 4.1, estado: 'ok'   },
  { nombre: 'Redes de computadores', creditos: 3, c1: 3.5, c2: 3.8, def: 3.7, estado: 'ok'   },
  { nombre: 'Cálculo diferencial',   creditos: 4, c1: 2.8, c2: 3.1, def: 3.0, estado: 'warn' },
  { nombre: 'Ingeniería de software',creditos: 3, c1: 4.5, c2: 4.3, def: 4.4, estado: 'ok'   },
  { nombre: 'Álgebra lineal',        creditos: 4, c1: 2.5, c2: '—', def: null, estado: 'err' },
]

export default function MisMaterias() { //función principal de la subvista : Renderiza el detalle de asignaturas inscritas, notas por corte y estado académico del estudiante.
  const [filtro, setFiltro] = useState('todos')

  // Lógica de filtrado por estado
  const materiasFiltradas = MATERIAS_DETALLE.filter(m => { //funciona como un filtro dinámico para mostrar solo las asignaturas que cumplen con el criterio seleccionado por el usuario, ya sea todas, solo las aprobadas o aquellas en riesgo académico.
    if (filtro === 'ok') return m.estado === 'ok'
    if (filtro === 'riesgo') return m.estado === 'warn' || m.estado === 'err'
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Sección superior de filtros rápidos */}
      <div style={styles.filterBar}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => setFiltro('todos')} 
            style={{ ...styles.btnFiltro, ...(filtro === 'todos' ? styles.btnFiltroActive : {}) }}
          >
            Todas
          </button>
          <button 
            onClick={() => setFiltro('ok')} 
            style={{ ...styles.btnFiltro, ...(filtro === 'ok' ? styles.btnFiltroActive : {}) }}
          >
            Aprobadas
          </button>
          <button 
            onClick={() => setFiltro('riesgo')} 
            style={{ ...styles.btnFiltro, ...(filtro === 'riesgo' ? styles.btnFiltroActive : {}) }}
          >
            En riesgo
          </button>
        </div>
        <span style={{ fontSize: 12, color: '#666' }}>
          Mostrando {materiasFiltradas.length} asignaturas
        </span>
      </div>

      {/* Contenedor de la Tabla Principal */}
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <span style={styles.panelTitle}>Asignaturas Inscritas - Período Académico</span>
        </div>
        <div style={styles.panelBody}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Asignatura</th>
                <th style={styles.th}>Créditos</th>
                <th style={styles.th}>Corte 1 (35%)</th>
                <th style={styles.th}>Corte 2 (35%)</th>
                <th style={styles.th}>Definitiva (30%)</th>
              </tr>
            </thead>
            <tbody>
              {materiasFiltradas.map((m, i) => (
                <tr key={i}>
                  <td style={{ ...styles.td, fontWeight: 500 }}>{m.nombre}</td>
                  <td style={styles.td}>{m.creditos} HT</td>
                  <td style={styles.td}>{m.c1}</td>
                  <td style={styles.td}>{m.c2}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.pill, ...(styles.badge[m.estado] || {}) }}>
                      {m.def !== null ? m.def.toFixed(1) : 'En riesgo'}
                    </span>
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

// Objeto de estilos local idéntico al ecosistema visual de tu Hub principal
const styles = {
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    padding: '10px 16px',
    borderRadius: 12,
    border: '0.5px solid #eee'
  },
  btnFiltro: {
    background: '#f4f4f4',
    border: '0.5px solid #ddd',
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#555'
  },
  btnFiltroActive: {
    background: '#0C447C',
    color: '#fff',
    borderColor: '#0C447C'
  },
  panel: {
    background: '#fff',
    border: '0.5px solid #eee',
    borderRadius: 12
  },
  panelHead: {
    padding: '14px 16px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#111'
  },
  panelBody: {
    padding: '12px 16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12
  },
  th: {
    textAlign: 'left',
    color: '#666',
    fontWeight: 500,
    padding: '6px 8px',
    borderBottom: '0.5px solid #eee',
    fontSize: 11
  },
  td: {
    padding: '10px 8px',
    borderBottom: '0.5px solid #eee',
    color: '#111',
    verticalAlign: 'middle'
  },
  pill: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500
  },
  badge: {
    ok:   { background: '#EAF3DE', color: '#3B6D11' },
    warn: { background: '#FAEEDA', color: '#854F0B' },
    err:  { background: '#FCEBEB', color: '#A32D2D' }
  }
}