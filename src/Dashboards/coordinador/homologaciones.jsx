// Dashboards/Coordinador/Homologaciones.jsx
import { useState } from 'react'

const HOMOLOGACIONES = [
  {
    id: 1, estudiante: 'Ana García', codigo: '20231001',
    asignaturaOrigen:  'Fundamentos de BD',      institucionOrigen: 'Universidad Nacional',
    asignaturaDestino: 'Bases de datos I',        creditosOrigen: 3, creditosDestino: 3,
    notaOrigen: 4.2, fechaSolicitud: '12 Mar 2025', estado: 'pendiente',
    documentos: ['Certificado de notas', 'Contenido programático'],
    observaciones: '',
  },
  {
    id: 2, estudiante: 'Luis Martínez', codigo: '20231002',
    asignaturaOrigen:  'Cálculo I',               institucionOrigen: 'UNAD',
    asignaturaDestino: 'Cálculo diferencial',      creditosOrigen: 4, creditosDestino: 4,
    notaOrigen: 3.5, fechaSolicitud: '10 Mar 2025', estado: 'pendiente',
    documentos: ['Certificado de notas', 'Contenido programático', 'Carta de la institución'],
    observaciones: '',
  },
  {
    id: 3, estudiante: 'Sara López', codigo: '20231003',
    asignaturaOrigen:  'Programación Orientada a Objetos', institucionOrigen: 'Universidad Javeriana',
    asignaturaDestino: 'Programación II',                  creditosOrigen: 3, creditosDestino: 3,
    notaOrigen: 4.5, fechaSolicitud: '05 Mar 2025', estado: 'aprobada',
    documentos: ['Certificado de notas', 'Contenido programático'],
    observaciones: 'Contenidos equivalentes al 90%. Aprobada.',
  },
  {
    id: 4, estudiante: 'Pedro Ruiz', codigo: '20231004',
    asignaturaOrigen:  'Redes I',                 institucionOrigen: 'Politécnico Grancolombiano',
    asignaturaDestino: 'Redes de computadores',    creditosOrigen: 2, creditosDestino: 3,
    notaOrigen: 3.8, fechaSolicitud: '01 Mar 2025', estado: 'rechazada',
    documentos: ['Certificado de notas'],
    observaciones: 'Los créditos no son equivalentes. Faltan contenidos de la asignatura destino.',
  },
  {
    id: 5, estudiante: 'Valentina Torres', codigo: '20231005',
    asignaturaOrigen:  'Álgebra I',               institucionOrigen: 'Universidad de los Andes',
    asignaturaDestino: 'Álgebra lineal',           creditosOrigen: 3, creditosDestino: 3,
    notaOrigen: 4.8, fechaSolicitud: '28 Feb 2025', estado: 'pendiente',
    documentos: ['Certificado de notas', 'Contenido programático'],
    observaciones: '',
  },
  {
    id: 6, estudiante: 'Diego Herrera', codigo: '20231006',
    asignaturaOrigen:  'Ingeniería de SW I',       institucionOrigen: 'EAN',
    asignaturaDestino: 'Ingeniería de software',   creditosOrigen: 3, creditosDestino: 3,
    notaOrigen: 3.9, fechaSolicitud: '25 Feb 2025', estado: 'en_revision',
    documentos: ['Certificado de notas', 'Contenido programático', 'Syllabus'],
    observaciones: 'Revisando equivalencia de contenidos con el docente.',
  },
]

const ESTADO = {
  pendiente:   { background: '#E6F1FB', color: '#185FA5', label: 'Pendiente',    border: '#185FA5' },
  en_revision: { background: '#FAEEDA', color: '#854F0B', label: 'En revisión',  border: '#BA7517' },
  aprobada:    { background: '#EAF3DE', color: '#3B6D11', label: 'Aprobada',     border: '#1D9E75' },
  rechazada:   { background: '#FCEBEB', color: '#A32D2D', label: 'Rechazada',    border: '#E24B4A' },
}

export default function Homologaciones() {
  const [filtro,    setFiltro]    = useState('todos')
  const [expandido, setExpandido] = useState(null)
  const [obs,       setObs]       = useState({})

  const pendientes  = HOMOLOGACIONES.filter(h => h.estado === 'pendiente').length
  const enRevision  = HOMOLOGACIONES.filter(h => h.estado === 'en_revision').length
  const aprobadas   = HOMOLOGACIONES.filter(h => h.estado === 'aprobada').length
  const rechazadas  = HOMOLOGACIONES.filter(h => h.estado === 'rechazada').length

  const filtradas = filtro === 'todos'
    ? HOMOLOGACIONES
    : HOMOLOGACIONES.filter(h => h.estado === filtro)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Resumen */}
      <div style={s.statsRow}>
        <div style={{ ...s.statCard, borderTop: '3px solid #185FA5' }}>
          <div style={s.statLabel}>Pendientes</div>
          <div style={s.statVal}>{pendientes}</div>
          <span style={{ ...s.pill, ...ESTADO.pendiente, marginTop: 4, display: 'inline-block' }}>Por revisar</span>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #BA7517' }}>
          <div style={s.statLabel}>En revisión</div>
          <div style={s.statVal}>{enRevision}</div>
          <span style={{ ...s.pill, ...ESTADO.en_revision, marginTop: 4, display: 'inline-block' }}>En proceso</span>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #1D9E75' }}>
          <div style={s.statLabel}>Aprobadas</div>
          <div style={s.statVal}>{aprobadas}</div>
          <span style={{ ...s.pill, ...ESTADO.aprobada, marginTop: 4, display: 'inline-block' }}>Este período</span>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #E24B4A' }}>
          <div style={s.statLabel}>Rechazadas</div>
          <div style={s.statVal}>{rechazadas}</div>
          <span style={{ ...s.pill, ...ESTADO.rechazada, marginTop: 4, display: 'inline-block' }}>Este período</span>
        </div>
      </div>

      {/* Filtros */}
      <div style={s.filtrosWrap}>
        <span style={s.filtroLabel}>Estado:</span>
        {[
          { key: 'todos',      label: 'Todos'       },
          { key: 'pendiente',  label: 'Pendiente'   },
          { key: 'en_revision',label: 'En revisión' },
          { key: 'aprobada',   label: 'Aprobada'    },
          { key: 'rechazada',  label: 'Rechazada'   },
        ].map(f => (
          <button
            key={f.key}
            style={{ ...s.filtroBtn, ...(filtro === f.key ? s.filtroActivo : {}) }}
            onClick={() => setFiltro(f.key)}
          >{f.label}</button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtradas.map(h => {
          const estado  = ESTADO[h.estado]
          const abierto = expandido === h.id
          const creditosOk = h.creditosOrigen >= h.creditosDestino

          return (
            <div key={h.id} style={{ ...s.card, borderLeft: `3px solid ${estado.border}` }}>

              {/* Cabecera */}
              <div style={s.cardHead} onClick={() => setExpandido(abierto ? null : h.id)}>
                <div style={s.cardLeft}>
                  <div style={s.miniAvatar}>
                    {h.estudiante.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={s.cardNombre}>{h.estudiante}</div>
                    <div style={s.cardMeta}>Código {h.codigo} · Solicitud: {h.fechaSolicitud}</div>
                  </div>
                </div>
                <div style={s.cardRight}>
                  <div style={s.asigWrap}>
                    <span style={s.asigTag}>{h.asignaturaOrigen}</span>
                    <span style={s.flecha}>→</span>
                    <span style={s.asigTag}>{h.asignaturaDestino}</span>
                  </div>
                  <span style={{ ...s.pill, background: estado.background, color: estado.color }}>
                    {estado.label}
                  </span>
                  <span style={s.chevron}>{abierto ? '▾' : '▸'}</span>
                </div>
              </div>

              {/* Detalle expandido */}
              {abierto && (
                <div style={s.detalle}>

                  {/* Info de la homologación */}
                  <div style={s.detalleGrid}>
                    <div style={s.detalleBloque}>
                      <div style={s.bloqueTitle}>Asignatura origen</div>
                      <div style={s.bloqueVal}>{h.asignaturaOrigen}</div>
                      <div style={s.bloqueSub}>{h.institucionOrigen}</div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <div><div style={s.metaLabel}>Créditos</div><div style={s.metaVal}>{h.creditosOrigen}</div></div>
                        <div><div style={s.metaLabel}>Nota</div><div style={s.metaVal}>{h.notaOrigen}</div></div>
                      </div>
                    </div>

                    <div style={s.flechaGrande}>→</div>

                    <div style={s.detalleBloque}>
                      <div style={s.bloqueTitle}>Asignatura destino</div>
                      <div style={s.bloqueVal}>{h.asignaturaDestino}</div>
                      <div style={s.bloqueSub}>Universidad Distrital</div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <div>
                          <div style={s.metaLabel}>Créditos</div>
                          <div style={{ ...s.metaVal, color: creditosOk ? '#3B6D11' : '#A32D2D' }}>
                            {h.creditosDestino} {!creditosOk && '⚠'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={s.detalleBloque}>
                      <div style={s.bloqueTitle}>Documentos adjuntos</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
                        {h.documentos.map((d, i) => (
                          <div key={i} style={s.docItem}>
                            <i className="ti ti-file" style={{ fontSize: 13, color: '#1A6B3A' }} />
                            <span style={{ fontSize: 12, color: '#444' }}>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div style={s.obsWrap}>
                    <div style={s.bloqueTitle}>Observaciones del coordinador</div>
                    {h.estado === 'pendiente' || h.estado === 'en_revision' ? (
                      <textarea
                        style={s.textarea}
                        placeholder="Escribe tus observaciones antes de aprobar o rechazar..."
                        value={obs[h.id] ?? h.observaciones}
                        onChange={e => setObs(prev => ({ ...prev, [h.id]: e.target.value }))}
                      />
                    ) : (
                      <div style={s.obsTexto}>{h.observaciones || 'Sin observaciones.'}</div>
                    )}
                  </div>

                  {/* Acciones */}
                  {(h.estado === 'pendiente' || h.estado === 'en_revision') && (
                    <div style={s.acciones}>
                      <button style={s.btnAprobar}>✓ Aprobar homologación</button>
                      <button style={s.btnRechazar}>✗ Rechazar</button>
                      <button style={s.btnRevision}>⟳ Marcar en revisión</button>
                    </div>
                  )}

                </div>
              )}

            </div>
          )
        })}

        {filtradas.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: 32, background: '#fff', borderRadius: 12, border: '0.5px solid #eee' }}>
            No hay homologaciones con ese estado.
          </div>
        )}
      </div>

    </div>
  )
}

const s = {
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:     { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:    { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:      { fontSize: 22, fontWeight: 500, color: '#111' },
  pill:         { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  filtrosWrap:  { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  filtroLabel:  { fontSize: 12, color: '#666' },
  filtroBtn:    { fontSize: 11, padding: '5px 12px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo: { background: '#1A6B3A', color: '#fff', borderColor: '#1A6B3A' },
  card:         { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, overflow: 'hidden' },
  cardHead:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' },
  cardLeft:     { display: 'flex', alignItems: 'center', gap: 10 },
  cardRight:    { display: 'flex', alignItems: 'center', gap: 12 },
  miniAvatar:   { width: 30, height: 30, borderRadius: '50%', background: '#E8F3EC', color: '#1A6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 },
  cardNombre:   { fontSize: 13, fontWeight: 500, color: '#111' },
  cardMeta:     { fontSize: 11, color: '#999', marginTop: 2 },
  asigWrap:     { display: 'flex', alignItems: 'center', gap: 6 },
  asigTag:      { fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#f4f4f4', color: '#555', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  flecha:       { fontSize: 14, color: '#999' },
  chevron:      { fontSize: 13, color: '#999' },
  detalle:      { borderTop: '0.5px solid #f0f0f0', padding: '16px 20px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 16 },
  detalleGrid:  { display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: 16, alignItems: 'start' },
  detalleBloque:{ background: '#fff', border: '0.5px solid #eee', borderRadius: 8, padding: '12px 14px' },
  bloqueTitle:  { fontSize: 10, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  bloqueVal:    { fontSize: 13, fontWeight: 500, color: '#111' },
  bloqueSub:    { fontSize: 11, color: '#999', marginTop: 2 },
  metaLabel:    { fontSize: 10, color: '#999' },
  metaVal:      { fontSize: 14, fontWeight: 500, color: '#111' },
  flechaGrande: { fontSize: 24, color: '#ccc', display: 'flex', alignItems: 'center', paddingTop: 20 },
  docItem:      { display: 'flex', alignItems: 'center', gap: 6 },
  obsWrap:      { display: 'flex', flexDirection: 'column', gap: 6 },
  textarea:     { width: '100%', minHeight: 70, padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontSize: 12, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  obsTexto:     { fontSize: 12, color: '#444', background: '#fff', border: '0.5px solid #eee', borderRadius: 8, padding: '8px 12px' },
  acciones:     { display: 'flex', gap: 8 },
  btnAprobar:   { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#1A6B3A', color: '#fff', cursor: 'pointer', fontWeight: 500 },
  btnRechazar:  { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #E24B4A', background: '#fff', color: '#A32D2D', cursor: 'pointer' },
  btnRevision:  { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', color: '#555', cursor: 'pointer' },
}