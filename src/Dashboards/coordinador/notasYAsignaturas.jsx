// Dashboards/Coordinador/NotasYAsignaturas.jsx
import { useState } from 'react'

// Base de datos simulada con las materias, sus grupos y el rendimiento por docente
const ASIGNATURAS = [
  {
    id: 1, nombre: 'Bases de datos I',       codigo: 'BD-101', creditos: 3, semestre: 4,
    grupos: [
      { grupo: 'G01', docente: 'María Pérez',    estudiantes: 28, promedio: 3.8, aprobados: 24, reprobados: 4  },
      { grupo: 'G02', docente: 'Carlos Rueda',   estudiantes: 25, promedio: 4.0, aprobados: 22, reprobados: 3  },
    ]
  },
  {
    id: 2, nombre: 'Cálculo diferencial',     codigo: 'MAT-201', creditos: 4, semestre: 2,
    grupos: [
      { grupo: 'G01', docente: 'Jorge Salinas',  estudiantes: 32, promedio: 3.1, aprobados: 21, reprobados: 11 },
      { grupo: 'G02', docente: 'Jorge Salinas',  estudiantes: 30, promedio: 3.3, aprobados: 22, reprobados: 8  },
    ]
  },
  {
    id: 3, nombre: 'Ingeniería de software',  codigo: 'IS-301', creditos: 3, semestre: 6,
    grupos: [
      { grupo: 'G01', docente: 'María Pérez',    estudiantes: 30, promedio: 4.1, aprobados: 28, reprobados: 2  },
    ]
  },
  {
    id: 4, nombre: 'Redes de computadores',   codigo: 'RED-401', creditos: 3, semestre: 5,
    grupos: [
      { grupo: 'G01', docente: 'Ana Bermúdez',   estudiantes: 26, promedio: 3.5, aprobados: 20, reprobados: 6  },
    ]
  },
  {
    id: 5, nombre: 'Álgebra lineal',          codigo: 'MAT-101', creditos: 3, semestre: 1,
    grupos: [
      { grupo: 'G01', docente: 'Roberto Cano',   estudiantes: 35, promedio: 3.0, aprobados: 22, reprobados: 13 },
      { grupo: 'G02', docente: 'Roberto Cano',   estudiantes: 33, promedio: 2.9, aprobados: 20, reprobados: 13 },
    ]
  },
]

// Estilos rápidos para los badges de estado (Verde = Ok, Amarillo = Ojo, Rojo = Alerta)
const BADGE = {
  ok:   { background: '#EAF3DE', color: '#3B6D11' },
  warn: { background: '#FAEEDA', color: '#854F0B' },
  err:  { background: '#FCEBEB', color: '#A32D2D' },
}

// Clasifica el promedio para saber qué colores y textos usar en la UI
function estadoProm(p) {
  if (p >= 4.0) return 'ok'
  if (p >= 3.5) return 'warn'
  return 'err' // Menor a 3.5 ya requiere atención
}

export default function NotasYAsignaturas() {
  // Maneja qué tarjeta de materia está abierta (acordeón). Guarda el ID o null si están cerradas.
  const [expandido, setExpandido] = useState(null)
  const [buscar,    setBuscar]    = useState('')
  const [orden,      setOrden]     = useState('nombre') // Criterios: 'nombre', 'semestre', 'promedio'

  // Filtramos y ordenamos la lista en cada render según los inputs del usuario
  const filtradas = ASIGNATURAS
    .filter(a => 
      a.nombre.toLowerCase().includes(buscar.toLowerCase()) || 
      a.codigo.toLowerCase().includes(buscar.toLowerCase())
    )
    .sort((a, b) => {
      if (orden === 'nombre')   return a.nombre.localeCompare(b.nombre)
      if (orden === 'semestre') return a.semestre - b.semestre
      if (orden === 'promedio') {
        // Para ordenar por promedio, calculamos el promedio ponderado simple entre sus grupos
        const pA = a.grupos.reduce((acc, g) => acc + g.promedio, 0) / a.grupos.length
        const pB = b.grupos.reduce((acc, g) => acc + g.promedio, 0) / b.grupos.length
        return pB - pA // De mayor a menor rendimiento
      }
      return 0
    })

  // --- Cálculos de las métricas de los bloques superiores ---
  // Aplanamos los grupos con flatMap para operar directo sobre los números globales
  const totalEstudiantes = ASIGNATURAS.flatMap(a => a.grupos).reduce((acc, g) => acc + g.estudiantes, 0)
  const totalReprobados  = ASIGNATURAS.flatMap(a => a.grupos).reduce((acc, g) => acc + g.reprobados, 0)
  
  // Promedio ponderado real: sumamos (nota * estudiantes del grupo) y dividimos entre el total de alumnos
  const promedioGeneral  = (
    ASIGNATURAS.flatMap(a => a.grupos).reduce((acc, g) => acc + g.promedio * g.estudiantes, 0) / totalEstudiantes
  ).toFixed(2)

  // Cuenta cuántas asignaturas tienen al menos un grupo con promedio crítico (menor a 3.5)
  const asigBaja = ASIGNATURAS.filter(a => a.grupos.some(g => g.promedio < 3.5)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Bloques de KPIs principales */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Asignaturas activas</div>
          <div style={s.statVal}>{ASIGNATURAS.length}</div>
          <div style={s.statSub}>Este período</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Promedio general</div>
          <div style={s.statVal}>{promedioGeneral}</div>
          <span style={{ ...s.pill, ...BADGE[estadoProm(parseFloat(promedioGeneral))], marginTop: 4, display: 'inline-block' }}>
            {parseFloat(promedioGeneral) >= 4.0 ? 'Bueno' : parseFloat(promedioGeneral) >= 3.5 ? 'Aceptable' : 'Bajo'}
          </span>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total reprobados</div>
          <div style={s.statVal}>{totalReprobados}</div>
          <span style={{ ...s.pill, ...BADGE.err, marginTop: 4, display: 'inline-block' }}>Atención</span>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Asig. bajo rendimiento</div>
          <div style={s.statVal}>{asigBaja}</div>
          <span style={{ ...s.pill, ...BADGE.warn, marginTop: 4, display: 'inline-block' }}>Revisar</span>
        </div>
      </div>

      {/* Barra de herramientas: Buscador de texto y botones de ordenamiento */}
      <div style={s.filtrosWrap}>
        <input
          style={s.buscador}
          placeholder="🔍  Buscar asignatura o código..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
        <div style={s.filtroGrupo}>
          <span style={s.filtroLabel}>Ordenar:</span>
          {[
            { key: 'nombre',   label: 'Nombre'   },
            { key: 'semestre', label: 'Semestre' },
            { key: 'promedio', label: 'Promedio' },
          ].map(o => (
            <button
              key={o.key}
              // Aplica estilo activo si el botón coincide con el estado de orden actual
              style={{ ...s.filtroBtn, ...(orden === o.key ? s.filtroActivo : {}) }}
              onClick={() => setOrden(o.key)}
            >{o.label}</button>
          ))}
        </div>
      </div>

      {/* Acordeón de asignaturas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtradas.map(a => {
          const abierto     = expandido === a.id
          
          // Métricas específicas de esta asignatura unificando todos sus grupos
          const totalEstAsig = a.grupos.reduce((acc, g) => acc + g.estudiantes, 0)
          const totalRepAsig = a.grupos.reduce((acc, g) => acc + g.reprobados, 0)
          const promAsig     = (a.grupos.reduce((acc, g) => acc + g.promedio * g.estudiantes, 0) / totalEstAsig).toFixed(2)

          return (
            <div key={a.id} style={s.card}>

              {/* Fila visible de la materia */}
              <div style={s.cardHead} onClick={() => setExpandido(abierto ? null : a.id)}>
                <div style={s.cardLeft}>
                  <div style={s.iconBox}>
                    <i className="ti ti-books" style={{ fontSize: 18, color: '#1A6B3A' }} />
                  </div>
                  <div>
                    <div style={s.cardNombre}>{a.nombre}</div>
                    <div style={s.cardMeta}>
                      {a.codigo} · {a.creditos} créditos · Semestre {a.semestre}° · {a.grupos.length} grupo{a.grupos.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                {/* Métricas consolidadas del lado derecho */}
                <div style={s.cardRight}>
                  <div style={s.metricaItem}>
                    <span style={s.metricaLabel}>Estudiantes</span>
                    <span style={s.metricaVal}>{totalEstAsig}</span>
                  </div>
                  <div style={s.metricaItem}>
                    <span style={s.metricaLabel}>Reprobados</span>
                    {/* Si hay más de 5 reprobados, pinta el número de rojo para alertar visualmente */}
                    <span style={{ ...s.metricaVal, color: totalRepAsig > 5 ? '#A32D2D' : '#111' }}>{totalRepAsig}</span>
                  </div>
                  <div style={s.metricaItem}>
                    <span style={s.metricaLabel}>Promedio</span>
                    {/* Alertas de color dinámicas según la nota final de la materia */}
                    <span style={{ ...s.metricaVal, color: parseFloat(promAsig) < 3.0 ? '#A32D2D' : parseFloat(promAsig) < 3.5 ? '#854F0B' : '#3B6D11' }}>
                      {promAsig}
                    </span>
                  </div>
                  <span style={{ ...s.pill, ...BADGE[estadoProm(parseFloat(promAsig))] }}>
                    {estadoProm(parseFloat(promAsig)) === 'ok' ? 'Bueno' : estadoProm(parseFloat(promAsig)) === 'warn' ? 'Aceptable' : 'Bajo'}
                  </span>
                  <span style={s.chevron}>{abierto ? '▾' : '▸'}</span>
                </div>
              </div>

              {/* Sección interna desplegable: Detalles por grupo en formato tabla */}
              {abierto && (
                <div style={s.cardDetalle}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Grupo</th>
                        <th style={s.th}>Docente</th>
                        <th style={s.th}>Estudiantes</th>
                        <th style={s.th}>Aprobados</th>
                        <th style={s.th}>Reprobados</th>
                        <th style={s.th}>Promedio</th>
                        <th style={s.th}>Distribución</th>
                        <th style={s.th}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.grupos.map((g, i) => (
                        <tr key={i}>
                          <td style={s.td}><span style={s.grupoTag}>{g.grupo}</span></td>
                          <td style={s.td}>{g.docente}</td>
                          <td style={{ ...s.td, textAlign: 'center' }}>{g.estudiantes}</td>
                          <td style={{ ...s.td, textAlign: 'center', color: '#3B6D11' }}>{g.aprobados}</td>
                          <td style={{ ...s.td, textAlign: 'center', color: '#A32D2D' }}>{g.reprobados}</td>
                          <td style={{ ...s.td, textAlign: 'center' }}>
                            <strong style={{ color: g.promedio < 3.0 ? '#A32D2D' : g.promedio < 3.5 ? '#854F0B' : '#3B6D11' }}>
                              {g.promedio}
                            </strong>
                          </td>
                          {/* Pequeña barra de progreso bicolor que muestra la proporción Aprobados vs Reprobados */}
                          <td style={{ ...s.td, minWidth: 120 }}>
                            <div style={{ display: 'flex', gap: 2, height: 12, borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${(g.aprobados / g.estudiantes) * 100}%`, background: '#1D9E75' }} />
                              <div style={{ width: `${(g.reprobados / g.estudiantes) * 100}%`, background: '#E24B4A' }} />
                            </div>
                          </td>
                          <td style={s.td}>
                            <span style={{ ...s.pill, ...BADGE[estadoProm(g.promedio)] }}>
                              {estadoProm(g.promedio) === 'ok' ? 'Bueno' : estadoProm(g.promedio) === 'warn' ? 'Aceptable' : 'Bajo'}
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
        
        {/* State vacío si la búsqueda destruye toda la lista */}
        {filtradas.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: 32, background: '#fff', borderRadius: 12, border: '0.5px solid #eee' }}>
            No se encontraron asignaturas con ese criterio.
          </div>
        )}
      </div>

    </div>
  )
}

// Estructura de estilos CSS-in-JS limpia y legible
const s = {
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:     { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:    { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:      { fontSize: 22, fontWeight: 500, color: '#111' },
  statSub:      { fontSize: 11, color: '#999', marginTop: 3 },
  pill:         { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  filtrosWrap:  { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  buscador:     { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  filtroGrupo:  { display: 'flex', alignItems: 'center', gap: 6 },
  filtroLabel:  { fontSize: 12, color: '#666' },
  filtroBtn:    { fontSize: 11, padding: '5px 12px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo: { background: '#1A6B3A', color: '#fff', borderColor: '#1A6B3A' },
  card:         { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, overflow: 'hidden' },
  cardHead:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' },
  cardLeft:     { display: 'flex', alignItems: 'center', gap: 12 },
  cardRight:    { display: 'flex', alignItems: 'center', gap: 16 },
  iconBox:      { width: 36, height: 36, borderRadius: 8, background: '#E8F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardNombre:   { fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 3 },
  cardMeta:     { fontSize: 11, color: '#999' },
  metricaItem:  { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  metricaLabel: { fontSize: 10, color: '#999' },
  metricaVal:   { fontSize: 14, fontWeight: 500, color: '#111' },
  chevron:      { fontSize: 13, color: '#999' },
  cardDetalle:  { borderTop: '0.5px solid #f0f0f0', padding: '14px 16px', background: '#fafafa' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:           { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:           { padding: '9px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  grupoTag:     { fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#E8F3EC', color: '#1A6B3A', fontWeight: 500 },
}