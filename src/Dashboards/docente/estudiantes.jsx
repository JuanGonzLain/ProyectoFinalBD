// Dashboards/Docente/Estudiantes.jsx
import { useState } from 'react'

// REEMPLZAR POR CONSULTA A LA BASE DE DATOS REAL: El dataset de estudiantes debe ser obtenido a través de una consulta SQL que relacione las tablas de estudiantes
// con las asignaturas y grupos que el docente tiene asignados en el semestre actual, filtrando por el ID del docente autenticado.
const ESTUDIANTES = [ 
  { id: 1,  nombre: 'Ana García',       codigo: '20231001', grupo: 'BD-101 G01', promedio: 4.2, c1: 4.5, c2: 3.9, estado: 'ok'   },
  { id: 2,  nombre: 'Luis Martínez',    codigo: '20231002', grupo: 'BD-101 G01', promedio: 2.7, c1: 2.5, c2: 2.9, estado: 'err'  },
  { id: 3,  nombre: 'Sara López',       codigo: '20231003', grupo: 'BD-101 G01', promedio: 3.8, c1: 3.9, c2: 3.7, estado: 'ok'   },
  { id: 4,  nombre: 'Pedro Ruiz',       codigo: '20231004', grupo: 'BD-101 G01', promedio: 3.1, c1: 3.0, c2: 3.2, estado: 'warn' },
  { id: 5,  nombre: 'Valentina Torres', codigo: '20231005', grupo: 'BD-201 G02', promedio: 4.5, c1: 4.5, c2: 4.5, estado: 'ok'   },
  { id: 6,  nombre: 'Diego Herrera',    codigo: '20231006', grupo: 'BD-201 G02', promedio: 3.9, c1: 4.1, c2: 3.7, estado: 'ok'   },
  { id: 7,  nombre: 'Camila Vargas',    codigo: '20231007', grupo: 'BD-201 G02', promedio: 2.8, c1: 3.0, c2: 2.6, estado: 'err'  },
  { id: 8,  nombre: 'Andrés Castro',    codigo: '20231008', grupo: 'IS-301 G01', promedio: 4.0, c1: 4.2, c2: 3.8, estado: 'ok'   },
  { id: 9,  nombre: 'Natalia Mora',     codigo: '20231009', grupo: 'IS-301 G01', promedio: 3.3, c1: 3.1, c2: 3.5, estado: 'warn' },
  { id: 10, nombre: 'Felipe Jiménez',   codigo: '20231010', grupo: 'IS-301 G01', promedio: 2.4, c1: 2.2, c2: 2.6, estado: 'err'  },
  { id: 11, nombre: 'Isabella Ramos',   codigo: '20231011', grupo: 'BD-101 G01', promedio: 4.3, c1: 4.4, c2: 4.2, estado: 'ok'   },
  { id: 12, nombre: 'Santiago Gómez',   codigo: '20231012', grupo: 'IS-301 G01', promedio: 3.6, c1: 3.8, c2: 3.4, estado: 'ok'   },
]

// CONTROL DE FILTROS: Lista de asignaturas activas asignadas al docente.
// REEMPLAZAR POR: Listado dinámico de códigos de grupos vinculados al ID del docente.
const GRUPOS = ['Todos', 'BD-101 G01', 'BD-201 G02', 'IS-301 G01']

// MAPEO DE BADGES: Colores y etiquetas de interfaz según la parametrización de estados.
const BADGE = {
  ok:   { background: '#EAF3DE', color: '#3B6D11', label: 'Aprobado'  },
  warn: { background: '#FAEEDA', color: '#854F0B', label: 'En riesgo' },
  err:  { background: '#FCEBEB', color: '#A32D2D', label: 'Reprobado' },
}

export default function Estudiantes() {
  // ESTADOS REACTIVOS: Almacenan temporalmente los criterios de ordenamiento y búsqueda del usuario.
  const [grupo,  setGrupo]  = useState('Todos')
  const [buscar, setBuscar] = useState('')
  const [estado, setEstado] = useState('Todos')

  // FUNCIÓN DE FILTRADO (FRONTEND): Combina de forma lógica tres criterios sobre el dataset de estudiantes
  // matchGrupo: Evalúa igualdad estricta con el tag de grupo seleccionado o ignora si es 'Todos'.
  // matchEstado: Discrimina la situación académica ('ok', 'warn', 'err') elegida en los botones.
  // matchBuscar: Normaliza el texto a minúsculas para buscar coincidencias parciales por nombre o código.
  const filtrados = ESTUDIANTES.filter(e => {
    const matchGrupo  = grupo  === 'Todos' || e.grupo  === grupo
    const matchEstado = estado === 'Todos' || e.estado === estado
    const matchBuscar = e.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
                        e.codigo.includes(buscar)
    return matchGrupo && matchEstado && matchBuscar
  })

  // MÉTRICAS CALCULADAS DINÁMICAMENTE: Computan los totales basados en el dataset previamente filtrado. funcion puede quedar en frontend.
  const total      = filtrados.length
  const aprobados = filtrados.filter(e => e.estado === 'ok').length
  const riesgo    = filtrados.filter(e => e.estado === 'warn').length
  const reprobados= filtrados.filter(e => e.estado === 'err').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* COMPONENTE DE MÉTRICAS: Despliega los contadores de rendimiento calculados en tiempo real */}
      <div style={s.statsRow}>
        <StatCard label="Total filtrados"  valor={total} />
        <StatCard label="Aprobados"        valor={aprobados} badgeEstado="ok" />
        <StatCard label="En riesgo"        valor={riesgo}    badgeEstado="warn" />
        <StatCard label="Reprobados"       valor={reprobados} badgeEstado="err" />
      </div>

      {/* BARRA DE ACCIONES: Inputs de control y selectores de filtrado multi-criterio */}
      <div style={s.filtrosWrap}>
        <input
          style={s.buscador}
          placeholder="🔍  Buscar por nombre o código..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
        <div style={s.filtrosRow}>
          {/* CONTROL: Renderizado dinámico de botones de grupo basados en el array maestro */}
          <div style={s.filtroGrupo}>
            <span style={s.filtroLabel}>Grupo:</span>
            {GRUPOS.map(g => ( //funciona como un generador dinámico de botones de filtro para cada grupo asignado al docente, permitiendo una experiencia de filtrado personalizada y adaptable a la carga real de asignaturas del semestre.
              <button
                key={g}
                style={{ ...s.filtroBtn, ...(grupo === g ? s.filtroActivo : {}) }}
                onClick={() => setGrupo(g)}
              >{g}</button>
            ))}
          </div>
          
          {/* CONTROL: Filtros de estado académico que disparan la mutación del renderizado */}
          <div style={s.filtroGrupo}>
            <span style={s.filtroLabel}>Estado:</span>
            {['Todos', 'ok', 'warn', 'err'].map(e => (
              <button
                key={e}
                style={{ ...s.filtroBtn, ...(estado === e ? s.filtroActivo : {}) }}
                onClick={() => setEstado(e)}
              >
                {e === 'Todos' ? 'Todos' : e === 'ok' ? 'Aprobado' : e === 'warn' ? 'En riesgo' : 'Reprobado'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: Tabla de datos operacionales del listado de alumnos */}
      <div style={s.panel}>
        <div style={s.panelHead}>
          <span style={s.panelTitle}>Listado de estudiantes</span>
          <span style={{ fontSize: 11, color: '#999' }}>{filtrados.length} resultados</span>
        </div>
        <div style={s.panelBody}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Estudiante</th>
                <th style={s.th}>Código</th>
                <th style={s.th}>Grupo</th>
                <th style={s.th}>Corte 1</th>
                <th style={s.th}>Corte 2</th>
                <th style={s.th}>Promedio</th>
                <th style={s.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {/* MAPEO RECOLECTOR: Itera y dibuja el conjunto estructurado final de la lista filtrada */}
              {filtrados.map(e => (
                <tr key={e.id}>
                  <td style={s.td}>
                    <div style={s.estudianteCell}>
                      {/* AVATAR GENERADO AUTOMÁTICAMENTE: Extrae las iniciales del nombre del alumno */}
                      <div style={s.miniAvatar}>
                        {e.nombre.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      {e.nombre}
                    </div>
                  </td>
                  {/* INYECCIÓN DE CAMPOS BÁSICOS Y NOTAS DE CORTE OPERATIVO */}
                  <td style={{ ...s.td, color: '#999', fontSize: 11 }}>{e.codigo}</td>
                  <td style={s.td}><span style={s.grupoTag}>{e.grupo}</span></td>
                  <td style={s.td}>{e.c1}</td>
                  <td style={s.td}>{e.c2}</td>
                  <td style={s.td}><strong>{e.promedio}</strong></td>
                  <td style={s.td}>
                    {/* ASIGNACIÓN DE ESTADO VISUAL: Vincula el flag del backend con el diccionario de estilos BADGE */}
                    <span style={{ ...s.pill, ...BADGE[e.estado] }}>{BADGE[e.estado].label}</span>
                  </td>
                </tr>
              ))}
              
              {/* CONTROL DE EXCEPCIÓN: Renderizado condicional en caso de búsquedas sin coincidencias */}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#999', padding: 24 }}>
                    No se encontraron estudiantes con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

// COMPONENTE AUXILIAR UI: Renderiza las tarjetas informativas superiores de analítica
// Recibe como propiedades el texto identificador, el número acumulado y el flag opcional de color (badgeEstado).
function StatCard({ label, valor, badgeEstado }) {
  return (
    <div style={{ ...s.statCard, ...(badgeEstado ? { borderTop: `3px solid ${badgeEstado === 'ok' ? '#1D9E75' : badgeEstado === 'warn' ? '#BA7517' : '#E24B4A'}` } : {}) }}>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statVal}>{valor}</div>
    </div>
  )
}

// OBJETO DE ESTILOS: Atributos estructurales y estéticos del módulo bajo paleta verde institucional
const s = {
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:     { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:    { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:      { fontSize: 22, fontWeight: 500, color: '#111' },
  filtrosWrap:  { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  buscador:     { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  filtrosRow:   { display: 'flex', gap: 20, flexWrap: 'wrap' },
  filtroGrupo:  { display: 'flex', alignItems: 'center', gap: 6 },
  filtroLabel:  { fontSize: 11, color: '#999', whiteSpace: 'nowrap' },
  filtroBtn:    { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo: { background: '#12947C', color: '#fff', borderColor: '#12947C' },
  panel:        { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:    { padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle:   { fontSize: 13, fontWeight: 500, color: '#111' },
  panelBody:    { padding: '0 16px 12px' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:           { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:           { padding: '9px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  estudianteCell:{ display: 'flex', alignItems: 'center', gap: 8 },
  miniAvatar:   { width: 26, height: 26, borderRadius: '50%', background: '#E8F5F2', color: '#12947C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 },
  grupoTag:     { fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#f4f4f4', color: '#555' },
  pill:         { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
}