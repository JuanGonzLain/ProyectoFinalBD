// Dashboards/Coordinador/GruposYCupos.jsx
import { useState } from 'react'

// Base de datos de los grupos ofertados con sus cupos, horarios, salones y docentes asignados
const GRUPOS = [
  { id: 1,  asignatura: 'Bases de datos I',       codigo: 'BD-101',  grupo: 'G01', docente: 'María Pérez',   salon: 'Aula 305', horario: 'Lun - Mié 08:00-10:00', creditos: 3, semestre: 4, cupo: 30, matriculados: 28 },
  { id: 2,  asignatura: 'Bases de datos I',       codigo: 'BD-101',  grupo: 'G02', docente: 'Carlos Rueda',  salon: 'Aula 210', horario: 'Mar - Jue 10:00-12:00', creditos: 3, semestre: 4, cupo: 25, matriculados: 25 },
  { id: 3,  asignatura: 'Cálculo diferencial',    codigo: 'MAT-201', grupo: 'G01', docente: 'Jorge Salinas', salon: 'Aula 101', horario: 'Lun - Mié 10:00-12:00', creditos: 4, semestre: 2, cupo: 35, matriculados: 32 },
  { id: 4,  asignatura: 'Cálculo diferencial',    codigo: 'MAT-201', grupo: 'G02', docente: 'Jorge Salinas', salon: 'Aula 102', horario: 'Mar - Jue 08:00-10:00', creditos: 4, semestre: 2, cupo: 35, matriculados: 30 },
  { id: 5,  asignatura: 'Ingeniería de software', codigo: 'IS-301',  grupo: 'G01', docente: 'María Pérez',   salon: 'Lab 102',  horario: 'Vie 14:00-18:00',       creditos: 3, semestre: 6, cupo: 30, matriculados: 30 },
  { id: 6,  asignatura: 'Redes de computadores',  codigo: 'RED-401', grupo: 'G01', docente: 'Ana Bermúdez',  salon: 'Lab 201',  horario: 'Mié - Vie 14:00-16:00', creditos: 3, semestre: 5, cupo: 28, matriculados: 26 },
  { id: 7,  asignatura: 'Álgebra lineal',          codigo: 'MAT-101', grupo: 'G01', docente: 'Roberto Cano',  salon: 'Aula 401', horario: 'Lun - Mié 06:00-08:00', creditos: 3, semestre: 1, cupo: 40, matriculados: 35 },
  { id: 8,  asignatura: 'Álgebra lineal',          codigo: 'MAT-101', grupo: 'G02', docente: 'Roberto Cano',  salon: 'Aula 402', horario: 'Mar - Jue 06:00-08:00', creditos: 3, semestre: 1, cupo: 40, matriculados: 33 },
  { id: 9,  asignatura: 'Programación I',          codigo: 'PRG-101', grupo: 'G01', docente: 'Luis Fonseca',  salon: 'Lab 301',  horario: 'Lun - Jue 14:00-16:00', creditos: 3, semestre: 1, cupo: 30, matriculados: 18 },
]

// Define la alerta del cupo según el porcentaje de estudiantes inscritos
function estadoCupo(matriculados, cupo) {
  const pct = matriculados / cupo
  if (pct >= 1)    return 'lleno'        // 100% de ocupación
  if (pct >= 0.85) return 'casi'         // Quedan muy pocos cupos libres (85% o más)
  return 'disponible'                    // Aún tiene buen espacio
}

// Mapeo rápido para renderizar los badges visuales de ocupación
const CUPO_BADGE = {
  lleno:      { background: '#FCEBEB', color: '#A32D2D', label: 'Lleno'      },
  casi:       { background: '#FAEEDA', color: '#854F0B', label: 'Casi lleno'},
  disponible: { background: '#EAF3DE', color: '#3B6D11', label: 'Disponible'},
}

// Opciones fijas para el filtro de semestres en la barra de herramientas
const SEMESTRES = ['Todos', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

export default function GruposYCupos() {
  // --- Estados de control de la interfaz ---
  const [buscar,   setBuscar]   = useState('')
  const [semestre, setSemestre] = useState('Todos')
  const [cupoFiltro, setCupoFiltro] = useState('todos') // Opciones: 'todos', 'disponible', 'casi', 'lleno'
  const [vista,    setVista]    = useState('tabla')    // Controla si se renderiza en 'tabla' o en rejilla de 'tarjetas'

  // Procesamiento en tiempo real de los filtros cruzados (Buscador + Semestre + Disponibilidad)
  const filtrados = GRUPOS.filter(g => {
    const matchBuscar   = g.asignatura.toLowerCase().includes(buscar.toLowerCase()) ||
                          g.codigo.toLowerCase().includes(buscar.toLowerCase()) ||
                          g.docente.toLowerCase().includes(buscar.toLowerCase())
    const matchSemestre = semestre === 'Todos' || g.semestre === parseInt(semestre)
    const matchCupo     = cupoFiltro === 'todos' || estadoCupo(g.matriculados, g.cupo) === cupoFiltro
    
    return matchBuscar && matchSemestre && matchCupo
  })

  // --- Cálculos métricos globales para el resumen superior ---
  const totalCupos        = GRUPOS.reduce((a, g) => a + g.cupo, 0)
  const totalMatric       = GRUPOS.reduce((a, g) => a + g.matriculados, 0)
  const gruposLlenos      = GRUPOS.filter(g => estadoCupo(g.matriculados, g.cupo) === 'lleno').length
  const gruposDisponibles = GRUPOS.filter(g => estadoCupo(g.matriculados, g.cupo) === 'disponible').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Bloque superior con tarjetas de datos consolidados */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total grupos</div>
          <div style={s.statVal}>{GRUPOS.length}</div>
          <div style={s.statSub}>Este período</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Ocupación general</div>
          <div style={s.statVal}>{Math.round((totalMatric / totalCupos) * 100)}%</div>
          <div style={s.statSub}>{totalMatric} de {totalCupos} cupos</div>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #E24B4A' }}>
          <div style={s.statLabel}>Grupos llenos</div>
          <div style={s.statVal}>{gruposLlenos}</div>
          <span style={{ ...s.pill, ...CUPO_BADGE.lleno, marginTop: 4, display: 'inline-block' }}>Sin cupo</span>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #1D9E75' }}>
          <div style={s.statLabel}>Con cupo disponible</div>
          <div style={s.statVal}>{gruposDisponibles}</div>
          <span style={{ ...s.pill, ...CUPO_BADGE.disponible, marginTop: 4, display: 'inline-block' }}>Disponible</span>
        </div>
      </div>

      {/* Barra de progreso unificada para ver el porcentaje total de matrículas del programa */}
      <div style={s.panel}>
        <div style={s.panelBody}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 6 }}>
            <span>Ocupación total del programa</span>
            <span><strong>{totalMatric}</strong> / {totalCupos} estudiantes</span>
          </div>
          <div style={s.barWrap}>
            <div style={{ ...s.barFill, width: `${(totalMatric / totalCupos) * 100}%`, background: '#1A6B3A' }} />
          </div>
        </div>
      </div>

      {/* Contenedor de herramientas (Filtros de selección y botones para cambiar de vista) */}
      <div style={s.filtrosWrap}>
        <input
          style={s.buscador}
          placeholder="🔍  Buscar por asignatura, código o docente..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Fila de filtros por semestre */}
            <div style={s.filtroGrupo}>
              <span style={s.filtroLabel}>Semestre:</span>
              {SEMESTRES.map(sem => (
                <button
                  key={sem}
                  style={{ ...s.filtroBtn, ...(semestre === sem ? s.filtroActivo : {}) }}
                  onClick={() => setSemestre(sem)}
                >{sem}</button>
              ))}
            </div>
            {/* Fila de filtros por estado de cupos */}
            <div style={s.filtroGrupo}>
              <span style={s.filtroLabel}>Cupo:</span>
              {[
                { key: 'todos',       label: 'Todos'      },
                { key: 'disponible',  label: 'Disponible' },
                { key: 'casi',         label: 'Casi lleno' },
                { key: 'lleno',       label: 'Lleno'      },
              ].map(f => (
                <button
                  key={f.key}
                  style={{ ...s.filtroBtn, ...(cupoFiltro === f.key ? s.filtroActivo : {}) }}
                  onClick={() => setCupoFiltro(f.key)}
                >{f.label}</button>
              ))}
            </div>
          </div>
          
          {/* Botones de alternancia de vista (Tabla / Tarjetas) */}
          <div style={s.filtroGrupo}>
            <span style={s.filtroLabel}>Vista:</span>
            <button style={{ ...s.filtroBtn, ...(vista === 'tabla'    ? s.filtroActivo : {}) }} onClick={() => setVista('tabla')}>
              ☰ Tabla
            </button>
            <button style={{ ...s.filtroBtn, ...(vista === 'tarjetas' ? s.filtroActivo : {}) }} onClick={() => setVista('tarjetas')}>
              ⊞ Tarjetas
            </button>
          </div>
        </div>
      </div>

      {/* --- RENDERIZADO CONDICIONAL DE LA VISTA --- */}
      {vista === 'tabla' ? (

        // OPCIÓN 1: Renderizado clásico en formato Tabla de datos
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>Grupos registrados</span>
            <span style={{ fontSize: 11, color: '#999' }}>{filtrados.length} grupos</span>
          </div>
          <div style={s.panelBody}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Asignatura</th>
                  <th style={s.th}>Grupo</th>
                  <th style={s.th}>Docente</th>
                  <th style={s.th}>Salón</th>
                  <th style={s.th}>Horario</th>
                  <th style={s.th}>Sem.</th>
                  <th style={s.th}>Cupo</th>
                  <th style={s.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(g => {
                  const estado = estadoCupo(g.matriculados, g.cupo)
                  const pct    = Math.round((g.matriculados / g.cupo) * 100)
                  return (
                    <tr key={g.id}>
                      <td style={s.td}>
                        <div style={{ fontSize: 13, color: '#111' }}>{g.asignatura}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{g.codigo}</div>
                      </td>
                      <td style={s.td}><span style={s.grupoTag}>{g.grupo}</span></td>
                      <td style={s.td}>{g.docente}</td>
                      <td style={{ ...s.td, fontSize: 12, color: '#666' }}>{g.salon}</td>
                      <td style={{ ...s.td, fontSize: 12, color: '#666' }}>{g.horario}</td>
                      <td style={{ ...s.td, textAlign: 'center' }}>{g.semestre}°</td>
                      {/* Celda de cupos con barra de nivel interna */}
                      <td style={{ ...s.td, minWidth: 120 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', marginBottom: 4 }}>
                          <span>{g.matriculados}/{g.cupo}</span>
                          <span>{pct}%</span>
                        </div>
                        <div style={s.barWrap}>
                          <div style={{
                            ...s.barFill,
                            width: `${pct}%`,
                            // El color cambia dinámicamente según lo lleno que esté el grupo
                            background: estado === 'lleno' ? '#E24B4A' : estado === 'casi' ? '#BA7517' : '#1D9E75'
                          }} />
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.pill, ...CUPO_BADGE[estado] }}>{CUPO_BADGE[estado].label}</span>
                      </td>
                    </tr>
                  )
                })}
                {/* Fallback en caso de que no haya coincidencias en la tabla */}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ ...s.td, textAlign: 'center', color: '#999', padding: 24 }}>
                      No se encontraron grupos con ese filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        // OPCIÓN 2: Renderizado responsivo/grid en bloques individuales (Tarjetas)
        <div style={s.tarjetasGrid}>
          {filtrados.map(g => {
            const estado = estadoCupo(g.matriculados, g.cupo)
            const pct    = Math.round((g.matriculados / g.cupo) * 100)
            return (
              <div key={g.id} style={s.tarjeta}>
                <div style={s.tarjetaHead}>
                  <div>
                    <div style={s.tarjetaNombre}>{g.asignatura}</div>
                    <div style={s.tarjetaMeta}>{g.codigo} · Grupo {g.grupo}</div>
                  </div>
                  <span style={{ ...s.pill, ...CUPO_BADGE[estado] }}>{CUPO_BADGE[estado].label}</span>
                </div>
                {/* Lista limpia de información del grupo con iconos */}
                <div style={s.tarjetaInfo}>
                  <div style={s.infoItem}><i className="ti ti-user" style={s.infoIcon} />{g.docente}</div>
                  <div style={s.infoItem}><i className="ti ti-door" style={s.infoIcon} />{g.salon}</div>
                  <div style={s.infoItem}><i className="ti ti-clock" style={s.infoIcon} />{g.horario}</div>
                </div>
                {/* Barra de progreso de cupos inferior en la tarjeta */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', marginBottom: 4 }}>
                    <span>Cupos ocupados</span>
                    <span><strong>{g.matriculados}</strong> / {g.cupo} ({pct}%)</span>
                  </div>
                  <div style={s.barWrap}>
                    <div style={{
                      ...s.barFill,
                      width: `${pct}%`,
                      background: estado === 'lleno' ? '#E24B4A' : estado === 'casi' ? '#BA7517' : '#1D9E75'
                    }} />
                  </div>
                </div>
              </div>
            )
          })}
          {/* Fallback en caso de que no haya coincidencias en las tarjetas */}
          {filtrados.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: 32, background: '#fff', borderRadius: 12, border: '0.5px solid #eee' }}>
              No se encontraron grupos con ese filtro.
            </div>
          )}
        </div>

      )}

    </div>
  )
}

// Estilos base CSS-in-JS estructurados para mantener la UI limpia
const s = {
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:     { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:    { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:      { fontSize: 22, fontWeight: 500, color: '#111' },
  statSub:      { fontSize: 11, color: '#999', marginTop: 3 },
  pill:         { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  panel:        { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:    { padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle:   { fontSize: 13, fontWeight: 500, color: '#111' },
  panelBody:    { padding: '0 16px 12px' },
  barWrap:      { background: '#f4f4f4', borderRadius: 4, height: 6, overflow: 'hidden' },
  barFill:      { height: 6, borderRadius: 4 },
  filtrosWrap:  { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  buscador:     { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  filtroGrupo:  { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  filtroLabel:  { fontSize: 11, color: '#999', whiteSpace: 'nowrap', minWidth: 60 },
  filtroBtn:    { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo: { background: '#1A6B3A', color: '#fff', borderColor: '#1A6B3A' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:           { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:           { padding: '9px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  grupoTag:     { fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#E8F3EC', color: '#1A6B3A', fontWeight: 500 },
  tarjetasGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 },
  tarjeta:      { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  tarjetaHead:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  tarjetaNombre:{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 3 },
  tarjetaMeta:  { fontSize: 11, color: '#999' },
  tarjetaInfo:  { display: 'flex', flexDirection: 'column', gap: 6 },
  infoItem:     { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#444' },
  infoIcon:     { fontSize: 14, color: '#999', flexShrink: 0 },
}