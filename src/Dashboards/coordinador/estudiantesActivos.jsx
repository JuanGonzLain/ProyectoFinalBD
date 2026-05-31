// Dashboards/Coordinador/EstudiantesActivos.jsx
import { useState } from 'react'
 // Submódulo dedicado a la gestión y visualización de los estudiantes activos bajo la coordinación académica, con filtros avanzados y acceso 
 // al historial académico detallado. REEMPLAZAR MOCKS POR CONSULTAS REALES A LA BASE DE DATOS Y AJUSTAR ESTILOS SEGÚN DISEÑO DEFINITIVO.
const ESTUDIANTES = [ //debería venir de la BD, este es solo un mock para desarrollo
  { id: 1,  nombre: 'Ana García',       codigo: '20231001', semestre: 6, promedio: 4.2, creditos: 112, estado: 'ok',   programa: 'Ing. Sistemas' },
  { id: 2,  nombre: 'Luis Martínez',    codigo: '20231002', semestre: 4, promedio: 2.7, creditos: 64,  estado: 'err',  programa: 'Ing. Sistemas' },
  { id: 3,  nombre: 'Sara López',       codigo: '20231003', semestre: 8, promedio: 3.8, creditos: 148, estado: 'ok',   programa: 'Ing. Sistemas' },
  { id: 4,  nombre: 'Pedro Ruiz',       codigo: '20231004', semestre: 3, promedio: 3.1, creditos: 48,  estado: 'warn', programa: 'Ing. Sistemas' },
  { id: 5,  nombre: 'Valentina Torres', codigo: '20231005', semestre: 7, promedio: 4.5, creditos: 130, estado: 'ok',   programa: 'Ing. Sistemas' },
  { id: 6,  nombre: 'Diego Herrera',    codigo: '20231006', semestre: 5, promedio: 3.9, creditos: 90,  estado: 'ok',   programa: 'Ing. Sistemas' },
  { id: 7,  nombre: 'Camila Vargas',    codigo: '20231007', semestre: 2, promedio: 2.8, creditos: 28,  estado: 'err',  programa: 'Ing. Sistemas' },
  { id: 8,  nombre: 'Andrés Castro',    codigo: '20231008', semestre: 6, promedio: 4.0, creditos: 108, estado: 'ok',   programa: 'Ing. Sistemas' },
  { id: 9,  nombre: 'Natalia Mora',     codigo: '20231009', semestre: 4, promedio: 3.3, creditos: 62,  estado: 'warn', programa: 'Ing. Sistemas' },
  { id: 10, nombre: 'Felipe Jiménez',   codigo: '20231010', semestre: 3, promedio: 2.4, creditos: 44,  estado: 'err',  programa: 'Ing. Sistemas' },
  { id: 11, nombre: 'Isabella Ramos',   codigo: '20231011', semestre: 9, promedio: 4.3, creditos: 160, estado: 'ok',   programa: 'Ing. Sistemas' },
  { id: 12, nombre: 'Santiago Gómez',   codigo: '20231012', semestre: 5, promedio: 3.6, creditos: 88,  estado: 'ok',   programa: 'Ing. Sistemas' },
]

const HISTORIAL_MOCK = {
  '20231001': [
    { semestre: '2022-1', materias: [{ nombre: 'Cálculo I',        creditos: 4, nota: 4.2, estado: 'ok' }, { nombre: 'Programación I', creditos: 3, nota: 4.5, estado: 'ok' }] },
    { semestre: '2022-2', materias: [{ nombre: 'Cálculo II',       creditos: 4, nota: 3.9, estado: 'ok' }, { nombre: 'Programación II',creditos: 3, nota: 4.3, estado: 'ok' }] },
    { semestre: '2023-1', materias: [{ nombre: 'Bases de datos I', creditos: 3, nota: 4.1, estado: 'ok' }, { nombre: 'Redes I',        creditos: 3, nota: 3.8, estado: 'ok' }] },
  ],
  '20231002': [
    { semestre: '2023-1', materias: [{ nombre: 'Cálculo I',        creditos: 4, nota: 2.5, estado: 'err'  }, { nombre: 'Programación I', creditos: 3, nota: 2.8, estado: 'err'  }] },
    { semestre: '2023-2', materias: [{ nombre: 'Cálculo I',        creditos: 4, nota: 3.1, estado: 'ok'   }, { nombre: 'Álgebra lineal', creditos: 3, nota: 2.7, estado: 'err'  }] },
  ],
}

const HISTORIAL_DEFAULT = [
  { semestre: '2023-1', materias: [{ nombre: 'Cálculo I',        creditos: 4, nota: 3.5, estado: 'ok'   }, { nombre: 'Programación I', creditos: 3, nota: 3.8, estado: 'ok' }] },
  { semestre: '2023-2', materias: [{ nombre: 'Cálculo II',       creditos: 4, nota: 3.2, estado: 'ok'   }, { nombre: 'Estructuras',    creditos: 3, nota: 3.6, estado: 'ok' }] },
]

const BADGE = {
  ok:   { background: '#EAF3DE', color: '#3B6D11', label: 'Al día'     },
  warn: { background: '#FAEEDA', color: '#854F0B', label: 'En riesgo' },
  err:  { background: '#FCEBEB', color: '#A32D2D', label: 'Crítico'   },
}

const SEMESTRES = ['Todos', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

// ─── Subvista: Historial del estudiante ──────────────────────────────────────
function HistorialEstudiante({ estudiante, onVolver }) {
  const [semestreAbierto, setSemestreAbierto] = useState(null)
  const historial = HISTORIAL_MOCK[estudiante.codigo] ?? HISTORIAL_DEFAULT

  const totalCreditos = historial.flatMap(s => s.materias).reduce((a, m) => a + m.creditos, 0)
  const promedio = (
    historial.flatMap(s => s.materias).reduce((a, m) => a + m.nota * m.creditos, 0) / totalCreditos
  ).toFixed(2)
  const reprobadas = historial.flatMap(s => s.materias).filter(m => m.nota < 3.0).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Breadcrumb de Navegación */}
      <div style={s.breadcrumb}>
        <span style={s.breadcrumbLink} onClick={onVolver}>← Estudiantes activos</span>
        <span style={s.breadcrumbSep}>/</span>
        <span style={s.breadcrumbActual}>Historial de {estudiante.nombre}</span>
      </div>

      {/* Tarjeta informativa superior */}
      <div style={s.panel}>
        <div style={s.panelBody}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={s.avatarGrande}>
                {estudiante.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#111', marginBottom: 3 }}>{estudiante.nombre}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Código {estudiante.codigo} · {estudiante.programa} · Semestre {estudiante.semestre}°</div>
                <span style={{ ...s.pill, ...BADGE[estudiante.estado], marginTop: 6, display: 'inline-block' }}>
                  {BADGE[estudiante.estado].label}
                </span>
              </div>
            </div>
            
            {/* CORRECCIÓN: Uso de miniStatsRow para evitar conflictos con la grilla global */}
            <div style={s.miniStatsRow}>
              <div style={s.statCard}>
                <div style={s.statLabel}>Promedio hist.</div>
                <div style={s.statVal}>{promedio}</div>
              </div>
              <div style={s.statCard}>
                <div style={s.statLabel}>Créditos cursados</div>
                <div style={s.statVal}>{totalCreditos}</div>
              </div>
              <div style={s.statCard}>
                <div style={s.statLabel}>Reprobadas</div>
                <div style={{ ...s.statVal, color: reprobadas > 0 ? '#A32D2D' : '#111' }}>{reprobadas}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acordeón del Historial Académico */}
      <div style={s.panel}>
        <div style={s.panelHead}>
          <span style={s.panelTitle}>Historial académico por semestre</span>
          <span style={{ fontSize: 11, color: '#999' }}>{historial.length} semestres registrados</span>
        </div>
        <div style={{ padding: '8px 0' }}>
          {historial.slice().reverse().map(sem => {
            const abierto  = semestreAbierto === sem.semestre
            const credSem  = sem.materias.reduce((a, m) => a + m.creditos, 0)
            const promSem  = (sem.materias.reduce((a, m) => a + m.nota * m.creditos, 0) / credSem).toFixed(2)

            return (
              <div key={sem.semestre} style={s.acordeonItem}>
                <div
                  style={{ ...s.acordeonHead, ...(abierto ? s.acordeonHeadActive : {}) }}
                  onClick={() => setSemestreAbierto(abierto ? null : sem.semestre)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={s.acordeonArrow}>{abierto ? '▾' : '▸'}</span>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>Periodo Académico {sem.semestre}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#666' }}>
                    <span>{sem.materias.length} asignaturas</span>
                    <span>Promedio del periodo: <strong>{promSem}</strong></span>
                  </div>
                </div>
                {abierto && (
                  <div style={{ padding: '0 16px 12px' }}>
                    <table style={s.table}>
                      <thead>
                        <tr>
                          <th style={s.th}>Asignatura</th>
                          <th style={s.th}>Créditos</th>
                          <th style={s.th}>Nota Definitiva</th>
                          <th style={s.th}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.materias.map((m, i) => (
                          <tr key={i}>
                            <td style={s.td}>{m.nombre}</td>
                            <td style={s.td}>{m.creditos}</td>
                            <td style={s.td}><strong>{m.nota}</strong></td>
                            <td style={s.td}>
                              <span style={{ ...s.pill, ...BADGE[m.estado] }}>
                                {m.estado === 'ok' ? 'Aprobada' : m.estado === 'warn' ? 'Habilitó' : 'Reprobada'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// ─── Vista principal: Listado de estudiantes ─────────────────────────────────
export default function EstudiantesActivos() {
  const [buscar,                   setBuscar]                  = useState('')
  const [semestre,                 setSemestre]                = useState('Todos')
  const [estado,                   setEstado]                  = useState('Todos')
  const [orden,                    setOrden]                   = useState('nombre')
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)

  // Renderizado condicional prioritario si el estado de selección contiene un objeto válido
  if (estudianteSeleccionado) {
    return (
      <HistorialEstudiante
        estudiante={estudianteSeleccionado}
        onVolver={() => setEstudianteSeleccionado(null)}
      />
    )
  }

  const filtrados = ESTUDIANTES
    .filter(e => {
      const matchBuscar   = e.nombre.toLowerCase().includes(buscar.toLowerCase()) || e.codigo.includes(buscar)
      const matchSemestre = semestre === 'Todos' || e.semestre === parseInt(semestre)
      const matchEstado   = estado   === 'Todos' || e.estado   === estado
      return matchBuscar && matchSemestre && matchEstado
    })
    .sort((a, b) => {
      if (orden === 'nombre')   return a.nombre.localeCompare(b.nombre)
      if (orden === 'promedio') return b.promedio - a.promedio
      if (orden === 'semestre') return a.semestre - b.semestre
      if (orden === 'creditos') return b.creditos - a.creditos
      return 0
    })

  const total    = filtrados.length
  const alDia    = filtrados.filter(e => e.estado === 'ok').length
  const enRiesgo = filtrados.filter(e => e.estado === 'warn').length
  const criticos = filtrados.filter(e => e.estado === 'err').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tarjetas de Métricas Generales */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total estudiantes</div>
          <div style={s.statVal}>{total}</div>
          <div style={s.statSub}>Ing. Sistemas</div>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #1D9E75' }}>
          <div style={s.statLabel}>Al día</div>
          <div style={s.statVal}>{alDia}</div>
          <span style={{ ...s.pill, ...BADGE.ok, marginTop: 4, display: 'inline-block' }}>Sin alertas</span>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #BA7517' }}>
          <div style={s.statLabel}>En riesgo</div>
          <div style={s.statVal}>{enRiesgo}</div>
          <span style={{ ...s.pill, ...BADGE.warn, marginTop: 4, display: 'inline-block' }}>Seguimiento</span>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #E24B4A' }}>
          <div style={s.statLabel}>Críticos</div>
          <div style={s.statVal}>{criticos}</div>
          <span style={{ ...s.pill, ...BADGE.err, marginTop: 4, display: 'inline-block' }}>Atención</span>
        </div>
      </div>

      {/* Controles de Filtrado */}
      <div style={s.filtrosPanel}>
        <input
          style={s.buscador}
          placeholder="🔍   Buscar por nombre o código..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
        <div style={s.filtrosRow}>
          <div style={s.filtroGrupo}>
            <span style={s.filtroLabel}>Semestre:</span>
            <div style={s.filtroScroll}>
              {SEMESTRES.map(sem => (
                <button
                  key={sem}
                  style={{ ...s.filtroBtn, ...(semestre === sem ? s.filtroActivo : {}) }}
                  onClick={() => setSemestre(sem)}
                >{sem}</button>
              ))}
            </div>
          </div>
          <div style={s.filtroGrupo}>
            <span style={s.filtroLabel}>Estado:</span>
            {['Todos', 'ok', 'warn', 'err'].map(e => (
              <button
                key={e}
                style={{ ...s.filtroBtn, ...(estado === e ? s.filtroActivo : {}) }}
                onClick={() => setEstado(e)}
              >
                {e === 'Todos' ? 'Todos' : BADGE[e].label}
              </button>
            ))}
          </div>
          <div style={s.filtroGrupo}>
            <span style={s.filtroLabel}>Ordenar:</span>
            {[
              { key: 'nombre',   label: 'Nombre'   },
              { key: 'promedio', label: 'Promedio' },
              { key: 'semestre', label: 'Semestre' },
              { key: 'creditos', label: 'Créditos' },
            ].map(o => (
              <button
                key={o.key}
                style={{ ...s.filtroBtn, ...(orden === o.key ? s.filtroActivo : {}) }}
                onClick={() => setOrden(o.key)}
              >{o.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla Maestra */}
      <div style={s.panel}>
        <div style={s.panelHead}>
          <span style={s.panelTitle}>Listado de estudiantes activos</span>
          <span style={{ fontSize: 11, color: '#999' }}>{filtrados.length} resultados</span>
        </div>
        <div style={s.panelBody}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Estudiante</th>
                <th style={s.th}>Código</th>
                <th style={s.th}>Semestre</th>
                <th style={s.th}>Créditos</th>
                <th style={s.th}>Promedio</th>
                <th style={s.th}>Estado</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(e => (
                <tr key={e.id}>
                  <td style={s.td}>
                    <div style={s.estudianteCell}>
                      <div style={s.miniAvatar}>
                        {e.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#111' }}>{e.nombre}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{e.programa}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...s.td, fontSize: 11, color: '#999' }}>{e.codigo}</td>
                  <td style={{ ...s.td, textAlign: 'center' }}>{e.semestre}°</td>
                  <td style={{ ...s.td, textAlign: 'center' }}>{e.creditos}</td>
                  <td style={{ ...s.td, textAlign: 'center' }}>
                    <strong style={{ color: e.promedio < 3.0 ? '#A32D2D' : e.promedio < 3.5 ? '#854F0B' : '#3B6D11' }}>
                      {e.promedio}
                    </strong>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.pill, ...BADGE[e.estado] }}>{BADGE[e.estado].label}</span>
                  </td>
                  <td style={s.td}>
                    {/* El trigger correcto para setear el estado local con el objeto estudiante completo */}
                    <button style={s.btnVer} onClick={() => setEstudianteSeleccionado(e)}>
                      Ver historial
                    </button>
                  </td>
                </tr>
              ))}
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

const s = {
  breadcrumb:       { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '4px 0' },
  breadcrumbLink:   { color: '#1A6B3A', cursor: 'pointer', fontWeight: 500 },
  breadcrumbSep:    { color: '#ccc' },
  breadcrumbActual: { color: '#666' },
  avatarGrande:     { width: 52, height: 52, borderRadius: '50%', background: '#1A6B3A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, flexShrink: 0 },
  acordeonItem:     { borderBottom: '0.5px solid #eee' },
  acordeonHead:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', userSelect: 'none' },
  acordeonHeadActive:{ background: '#F4FAF6' },
  acordeonArrow:    { fontSize: 12, color: '#666', minWidth: 16 },
  statsRow:         { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  // CORRECCIÓN: Contenedor flex específico para la vista resumida de la subficha estudiantil
  miniStatsRow:     { display: 'flex', gap: 12, alignItems: 'center' },
  statCard:         { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px', minWidth: 110 },
  statLabel:        { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:          { fontSize: 22, fontWeight: 500, color: '#111' },
  statSub:          { fontSize: 11, color: '#999', marginTop: 3 },
  pill:             { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  filtrosPanel:     { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  buscador:         { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  filtrosRow:       { display: 'flex', flexDirection: 'column', gap: 8 },
  filtroGrupo:      { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  filtroScroll:     { display: 'flex', gap: 6, flexWrap: 'wrap' },
  filtroLabel:      { fontSize: 11, color: '#999', whiteSpace: 'nowrap', minWidth: 60 },
  filtroBtn:        { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo:     { background: '#1A6B3A', color: '#fff', borderColor: '#1A6B3A' },
  panel:            { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:        { padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle:       { fontSize: 13, fontWeight: 500, color: '#111' },
  panelBody:        { padding: '0 16px 12px' },
  table:            { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:               { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:               { padding: '9px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  estudianteCell:   { display: 'flex', alignItems: 'center', gap: 8 },
  miniAvatar:       { width: 28, height: 28, borderRadius: '50%', background: '#E8F3EC', color: '#1A6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 },
  btnVer:           { fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '0.5px solid #1A6B3A', background: '#fff', color: '#1A6B3A', cursor: 'pointer', outline: 'none' },
}