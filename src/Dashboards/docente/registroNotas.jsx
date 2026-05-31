// Dashboards/Docente/RegistroNotas.jsx
import { useState } from 'react'

// REEMPLAZAR POR CONSULTA A LA BASE DE DATOS REAL: El dataset de estudiantes debe ser obtenido a través de una consulta SQL que relacione las tablas de estudiantes
// con las asignaturas y grupos que el docente tiene asignados en el semestre actual, filtrando por el ID del docente autenticado.
const GRUPOS_DISPONIBLES = ['BD-101 G01', 'BD-201 G02', 'IS-301 G01']

const ESTUDIANTES_POR_GRUPO = {
  'BD-101 G01': [
    { id: 1,  nombre: 'Ana García',       codigo: '20231001', c1: 4.5, c2: 3.9, c3: null },
    { id: 2,  nombre: 'Luis Martínez',    codigo: '20231002', c1: 2.5, c2: 2.9, c3: null },
    { id: 3,  nombre: 'Sara López',       codigo: '20231003', c1: 3.9, c2: 3.7, c3: null },
    { id: 4,  nombre: 'Pedro Ruiz',       codigo: '20231004', c1: 3.0, c2: 3.2, c3: null },
    { id: 11, nombre: 'Isabella Ramos',   codigo: '20231011', c1: 4.4, c2: 4.2, c3: null },
  ],
  'BD-201 G02': [
    { id: 5,  nombre: 'Valentina Torres', codigo: '20231005', c1: 4.5, c2: null, c3: null },
    { id: 6,  nombre: 'Diego Herrera',    codigo: '20231006', c1: 4.1, c2: null, c3: null },
    { id: 7,  nombre: 'Camila Vargas',    codigo: '20231007', c1: 3.0, c2: null, c3: null },
  ],
  'IS-301 G01': [
    { id: 8,  nombre: 'Andrés Castro',    codigo: '20231008', c1: 4.2, c2: null, c3: null },
    { id: 9,  nombre: 'Natalia Mora',     codigo: '20231009', c1: 3.1, c2: null, c3: null },
    { id: 10, nombre: 'Felipe Jiménez',   codigo: '20231010', c1: 2.2, c2: null, c3: null },
    { id: 12, nombre: 'Santiago Gómez',   codigo: '20231012', c1: 3.8, c2: null, c3: null },
  ],
}

// FUNCIÓN DE LOGICA: Calcula la nota definitiva basándose en los tres cortes.
// Filtra valores nulos para evitar NaN y promedia las notas reales ingresadas.
// NOTA: El header de la tabla indica pesos (30%, 30%, 40%), si se requiere ponderación estricta
// se debe modificar esta fórmula matemática aquí y replicarla de igual forma en el Backend.
function calcularDef(c1, c2, c3) {
  const notas = [c1, c2, c3].filter(n => n !== null && n !== '')
  if (notas.length === 0) return null
  return (notas.reduce((a, b) => a + parseFloat(b), 0) / 3).toFixed(1)
}

// FORMATO DE BADGES: Retorna la paleta de colores UI (Verde/Rojo) según el umbral de aprobación (3.0).
function estadoNota(def) {
  if (def === null) return null
  if (def >= 3.0) return { background: '#EAF3DE', color: '#3B6D11' }
  return { background: '#FCEBEB', color: '#A32D2D' }
}

export default function RegistroNotas() {
  // ESTADOS REACTIVOS: Controlan el grupo en pantalla, la mutación local de las notas y el feedback del guardado.
  const [grupoActivo, setGrupoActivo] = useState('BD-101 G01')
  const [notas, setNotas] = useState(ESTUDIANTES_POR_GRUPO)
  const [guardado, setGuardado] = useState(false)

  // DATASET FILTRADO: Puntero directo al listado del grupo seleccionado en la UI.
  const estudiantes = notas[grupoActivo]

  // MANEJADOR DE EVENTOS (INPUT): Valida e inyecta la nota digitada en el estado local del cliente.
  // Limita estrictamente el rango decimal entre 0.0 y 5.0 para blindar la integridad del dato.
  function handleNota(id, corte, valor) {
    const parsed = valor === '' ? null : Math.min(5, Math.max(0, parseFloat(valor) || 0))
    setNotas(prev => ({
      ...prev,
      [grupoActivo]: prev[grupoActivo].map(e =>
        e.id === id ? { ...e, [corte]: parsed } : e
      )
    }))
    setGuardado(false) // Desactiva el banner de éxito si el docente vuelve a modificar el input
  }

  // ACCIÓN DE PERSISTENCIA: Punto de inyección clave para Axios / Fetch.
  // Enviar el sub-array 'notas[grupoActivo]' hacia la base de datos para actualizar la tabla Historial_Academico.
  function guardar() {
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  // MÉTRICAS CALCULADAS: Totales e indicadores grupales que cambian de forma reactiva al alterar notas.
  const aprobados  = estudiantes.filter(e => {
    const def = calcularDef(e.c1, e.c2, e.c3)
    return def !== null && parseFloat(def) >= 3.0
  }).length
  
  const pendientes = estudiantes.filter(e => e.c1 === null || e.c2 === null || e.c3 === null).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* SELECTOR DE GRUPO: Pestañas de alternancia de asignaturas asignadas al docente */}
      <div style={s.panel}>
        <div style={s.panelBody}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={s.filtroLabel}>Grupo:</span>
            {GRUPOS_DISPONIBLES.map(g => (
              <button
                key={g}
                style={{ ...s.filtroBtn, ...(grupoActivo === g ? s.filtroActivo : {}) }}
                onClick={() => { setGrupoActivo(g); setGuardado(false) }}
              >{g}</button>
            ))}
          </div>
        </div>
      </div>

      {/* TARJETAS ANALÍTICAS: Consolidado analítico inmediato del rendimiento general del grupo */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Estudiantes</div>
          <div style={s.statVal}>{estudiantes.length}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Aprobados</div>
          <div style={s.statVal}>{aprobados}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Notas pendientes</div>
          <div style={s.statVal}>{pendientes}</div>
          {pendientes > 0 && <span style={{ ...s.pill, background: '#FAEEDA', color: '#854F0B', marginTop: 4, display: 'inline-block' }}>Incompleto</span>}
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Promedio grupo</div>
          <div style={s.statVal}>
            {(() => {
              const defs = estudiantes.map(e => calcularDef(e.c1, e.c2, e.c3)).filter(d => d !== null)
              return defs.length > 0 ? (defs.reduce((a, b) => a + parseFloat(b), 0) / defs.length).toFixed(1) : '—'
            })()}
          </div>
        </div>
      </div>

      {/* MATRIZ DE CALIFICACIONES: Interfaz de grilla editable para el ingreso masivo de notas */}
      <div style={s.panel}>
        <div style={s.panelHead}>
          <span style={s.panelTitle}>Notas — {grupoActivo}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {guardado && (
              <span style={{ fontSize: 12, color: '#3B6D11', background: '#EAF3DE', padding: '4px 10px', borderRadius: 6 }}>
                ✓ Guardado correctamente
              </span>
            )}
            <button style={s.btnGuardar} onClick={guardar}>Guardar cambios</button>
          </div>
        </div>
        <div style={s.panelBody}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Estudiante</th>
                <th style={s.th}>Código</th>
                <th style={{ ...s.th, textAlign: 'center' }}>Corte 1 <span style={s.pesoTag}>30%</span></th>
                <th style={{ ...s.th, textAlign: 'center' }}>Corte 2 <span style={s.pesoTag}>30%</span></th>
                <th style={{ ...s.th, textAlign: 'center' }}>Corte 3 <span style={s.pesoTag}>40%</span></th>
                <th style={{ ...s.th, textAlign: 'center' }}>Definitiva</th>
              </tr>
            </thead>
            <tbody>
              {/* ITERACIÓN RECOLECTORA: Renderiza dinámicamente las filas de los estudiantes del grupo activo */}
              {estudiantes.map(e => {
                const def = calcularDef(e.c1, e.c2, e.c3)
                return (
                  <tr key={e.id}>
                    <td style={s.td}>
                      <div style={s.estudianteCell}>
                        <div style={s.miniAvatar}>
                          {e.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        {e.nombre}
                      </div>
                    </td>
                    <td style={{ ...s.td, color: '#999', fontSize: 11 }}>{e.codigo}</td>
                    
                    {/* BUCLE DE INPUTS: Dibuja las cajas numéricas controladas vinculando 'c1', 'c2' y 'c3' */}
                    {['c1', 'c2', 'c3'].map(c => (
                      <td key={c} style={{ ...s.td, textAlign: 'center' }}>
                        <input
                          style={s.inputNota}
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          placeholder="—"
                          value={e[c] ?? ''}
                          onChange={ev => handleNota(e.id, c, ev.target.value)}
                        />
                      </td>
                    ))}
                    
                    {/* COLUMNA DEFINITIVA: Visualiza el promedio calculado en tiempo real con condicionales de color */}
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      {def !== null
                        ? <span style={{ ...s.pill, ...estadoNota(def) }}>{def}</span>
                        : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER OPERATIVO: Recordatorio contextual de guardado */}
      <div style={s.nota}>
        ℹ Las notas se calculan automáticamente según los pesos de cada corte. Recuerda guardar los cambios antes de salir.
      </div>

    </div>
  )
}

// OBJETO DE ESTILOS DE INTERFAZ: Configuración de la identidad visual Emerald Green (#12947C)
const s = {
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:     { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:    { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:      { fontSize: 22, fontWeight: 500, color: '#111' },
  pill:         { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  panel:        { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:    { padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle:   { fontSize: 13, fontWeight: 500, color: '#111' },
  panelBody:    { padding: '0 16px 12px' },
  filtroLabel:  { fontSize: 12, color: '#666' },
  filtroBtn:    { fontSize: 11, padding: '5px 12px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo: { background: '#12947C', color: '#fff', borderColor: '#12947C' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:           { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:           { padding: '8px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  inputNota:    { width: 56, padding: '5px 6px', borderRadius: 6, border: '0.5px solid #ddd', fontSize: 12, textAlign: 'center', outline: 'none', background: '#fafafa' },
  pesoTag:      { fontSize: 9, color: '#aaa', marginLeft: 3 },
  estudianteCell:{ display: 'flex', alignItems: 'center', gap: 8 },
  miniAvatar:   { width: 26, height: 26, borderRadius: '50%', background: '#E8F5F2', color: '#12947C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 },
  btnGuardar:   { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#12947C', color: '#fff', cursor: 'pointer', fontWeight: 500 },
  nota:         { fontSize: 12, color: '#666', background: '#F0F7FF', border: '0.5px solid #B5D4F4', borderRadius: 8, padding: '10px 14px' },
}