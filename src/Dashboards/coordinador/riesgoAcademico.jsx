// Dashboards/Coordinador/RiesgoAcademico.jsx
import { useState } from 'react'

/**
 * Datos simulados de estudiantes en situación de vulnerabilidad académica.
 * Cada registro evalúa promedio, asignaturas perdidas y tipología de alertas. REEMPLAZAR con consulta real A LA BASE DE DATOS
 */
const ESTUDIANTES_RIESGO = [
  { id: 1,  nombre: 'Luis Martínez',  codigo: '20231002', semestre: 4, promedio: 2.7, materiasReprobadas: 3, alertas: ['Promedio < 3.0', 'Más de 2 materias reprobadas'],       nivel: 'critico'  },
  { id: 2,  nombre: 'Camila Vargas',  codigo: '20231007', semestre: 2, promedio: 2.8, materiasReprobadas: 2, alertas: ['Promedio < 3.0', 'Primer año en riesgo'],             nivel: 'critico'  },
  { id: 3,  nombre: 'Felipe Jiménez', codigo: '20231010', semestre: 3, promedio: 2.4, materiasReprobadas: 4, alertas: ['Promedio < 3.0', 'Más de 2 materias reprobadas', 'Prueba académica'], nivel: 'critico'  },
  { id: 4,  nombre: 'Pedro Ruiz',     codigo: '20231004', semestre: 3, promedio: 3.1, materiasReprobadas: 1, alertas: ['Promedio entre 3.0 y 3.5', '1 materia reprobada'],       nivel: 'moderado' },
  { id: 5,  nombre: 'Natalia Mora',   codigo: '20231009', semestre: 4, promedio: 3.3, materiasReprobadas: 1, alertas: ['Promedio entre 3.0 y 3.5'],                             nivel: 'moderado' },
  { id: 6,  nombre: 'Diego Herrera',  codigo: '20231006', semestre: 5, promedio: 3.4, materiasReprobadas: 0, alertas: ['Tendencia descendente últimos 2 períodos'],              nivel: 'moderado' },
  { id: 7,  nombre: 'Santiago Gómez', codigo: '20231012', semestre: 5, promedio: 3.6, materiasReprobadas: 0, alertas: ['Bajo rendimiento en asignaturas clave'],                 nivel: 'leve'     },
]

/**
 * Diccionario de configuración estética por nivel de riesgo.
 * Centraliza los colores de alertas, badges y bordes para evitar lógica cableada (hardcoded) en el render.
 */
const NIVEL = {
  critico:  { background: '#FCEBEB', color: '#A32D2D', border: '#E24B4A', label: 'Crítico',  dot: '#E24B4A' },
  moderado: { background: '#FAEEDA', color: '#854F0B', border: '#BA7517', label: 'Moderado', dot: '#BA7517' },
  leve:     { background: '#FEF9E7', color: '#7D6608', border: '#D4AC0D', label: 'Leve',     dot: '#D4AC0D' },
}

export default function RiesgoAcademico() {
  // ─── ESTADOS LOCALES ───────────────────────────────────────────────────────
  // Determina el filtro actual por severidad ('todos', 'critico', 'moderado', 'leve')
  const [nivelFiltro, setNivelFiltro] = useState('todos')
  // Almacena el ID del estudiante cuya tarjeta está expandida (acordeón); null si ninguna lo está
  const [expandido,   setExpandido]   = useState(null)

  // ─── CÓMPUTO DE MÉTRICAS (KPIs) ────────────────────────────────────────────
  // Se calculan sobre el set de datos original para mantener fijos los contadores superiores
  const criticos  = ESTUDIANTES_RIESGO.filter(e => e.nivel === 'critico').length
  const moderados = ESTUDIANTES_RIESGO.filter(e => e.nivel === 'moderado').length
  const leves      = ESTUDIANTES_RIESGO.filter(e => e.nivel === 'leve').length

  // ─── FILTRADO DE DATOS ─────────────────────────────────────────────────────
  const filtrados = nivelFiltro === 'todos'
    ? ESTUDIANTES_RIESGO
    : ESTUDIANTES_RIESGO.filter(e => e.nivel === nivelFiltro)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ─── SECCIÓN: TARJETAS DE RESUMEN NUMÉRICO ─── */}
      <div style={s.statsRow}>
        <div style={{ ...s.statCard, borderTop: '3px solid #E24B4A' }}>
          <div style={s.statLabel}>Críticos</div>
          <div style={s.statVal}>{criticos}</div>
          <div style={s.statSub}>Promedio {'<'} 3.0 o prueba académica</div>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #BA7517' }}>
          <div style={s.statLabel}>Moderados</div>
          <div style={s.statVal}>{moderados}</div>
          <div style={s.statSub}>Promedio entre 3.0 y 3.5</div>
        </div>
        <div style={{ ...s.statCard, borderTop: '3px solid #D4AC0D' }}>
          <div style={s.statLabel}>Leves</div>
          <div style={s.statVal}>{leves}</div>
          <div style={s.statSub}>Tendencia descendente</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total en riesgo</div>
          <div style={s.statVal}>{ESTUDIANTES_RIESGO.length}</div>
          <div style={s.statSub}>de 312 estudiantes</div>
        </div>
      </div>

      {/* ─── SECCIÓN: ALERTA INSTITUCIONAL GLOBAL ─── */}
      <div style={s.alertaInstitucional}>
        ⚠ <strong>3 estudiantes</strong> están en prueba académica y podrían perder su calidad de estudiante si no mejoran su promedio este período.
      </div>

      {/* ─── SECCIÓN: BARRA DE FILTRADO DINÁMICO ─── */}
      <div style={s.filtrosWrap}>
        <span style={s.filtroLabel}>Nivel de riesgo:</span>
        {[
          { key: 'todos',    label: 'Todos'    },
          { key: 'critico',  label: 'Crítico'  },
          { key: 'moderado', label: 'Moderado' },
          { key: 'leve',     label: 'Leve'     },
        ].map(f => (
          <button
            key={f.key}
            // Mezcla de estilos base con estilos activos si el filtro actual coincide con el botón
            style={{ ...s.filtroBtn, ...(nivelFiltro === f.key ? s.filtroActivo : {}) }}
            onClick={() => setNivelFiltro(f.key)}
          >{f.label}</button>
        ))}
      </div>

      {/* ─── SECCIÓN: LISTADO DE TARJETAS EXPANDIBLES ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtrados.map(e => {
          // Extrae el mapa de estilos visuales según el nivel de riesgo del estudiante
          const nivel    = NIVEL[e.nivel]
          const abierto  = expandido === e.id

          return (
            <div key={e.id} style={{ ...s.card, borderLeft: `3px solid ${nivel.border}` }}>

              {/* Cabecera de la Tarjeta (Fila Principal de Información) */}
              <div style={s.cardHead} onClick={() => setExpandido(abierto ? null : e.id)}>
                
                {/* Bloque Izquierdo: Identificación básica */}
                <div style={s.cardLeft}>
                  {/* Punto indicador de color según severidad */}
                  <div style={{ ...s.dot, background: nivel.dot }} />
                  {/* Avatar con iniciales del nombre */}
                  <div style={s.miniAvatar}>
                    {e.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={s.cardNombre}>{e.nombre}</div>
                    <div style={s.cardMeta}>Código {e.codigo} · Semestre {e.semestre}°</div>
                  </div>
                </div>
                
                {/* Bloque Derecho: Métricas principales, badge de estado y chevron */}
                <div style={s.cardRight}>
                  <div style={s.metricaItem}>
                    <span style={s.metricaLabel}>Promedio</span>
                    <span style={{ ...s.metricaVal, color: e.promedio < 3.0 ? '#A32D2D' : '#854F0B' }}>
                      {e.promedio}
                    </span>
                  </div>
                  <div style={s.metricaItem}>
                    <span style={s.metricaLabel}>Reprobadas</span>
                    <span style={s.metricaVal}>{e.materiasReprobadas}</span>
                  </div>
                  <span style={{ ...s.pill, background: nivel.background, color: nivel.color }}>
                    {nivel.label}
                  </span>
                  <span style={s.chevron}>{abierto ? '▾' : '▸'}</span>
                </div>

              </div>

              {/* Detalle Desplegable (Se renderiza condicionalmente si el ID está activo) */}
              {abierto && (
                <div style={s.cardDetalle}>
                  
                  {/* Subpanel: Desglose de Alertas Específicas */}
                  <div style={s.alertasWrap}>
                    <div style={s.alertasTitle}>Alertas detectadas</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                      {e.alertas.map((a, i) => (
                        <div key={i} style={{ ...s.alertaItem, borderLeft: `2px solid ${nivel.border}` }}>
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Subpanel: Acciones Rápidas de Gestión/Seguimiento */}
                  <div style={s.accionesWrap}>
                    <button style={s.btnPrimario}>Ver historial completo</button>
                    <button style={s.btnSecundario}>Registrar seguimiento</button>
                    <button style={s.btnSecundario}>Enviar notificación</button>
                  </div>

                </div>
              )}

            </div>
          )
        })}
      </div>

    </div>
  )
}

/**
 * ─── SISTEMA DE ESTILOS (CSS-in-JS) ──────────────────────────────────────────
 * Objetos de estilos modulares que controlan la distribución estructural 
 * (Grid y Flexbox) y las tipografías de la interfaz del Coordinador.
 */
const s = {
  // Grilla para contenedores de analítica/métrica de cabecera
  statsRow:            { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:            { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:           { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:             { fontSize: 22, fontWeight: 500, color: '#111' },
  statSub:             { fontSize: 11, color: '#999', marginTop: 3 },
  // Píldoras estéticas (Badges)
  pill:                { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  // Banner de alertas críticas de la facultad
  alertaInstitucional: { background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#A32D2D' },
  // Barra horizontal de controles
  filtrosWrap:         { display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '12px 16px' },
  filtroLabel:         { fontSize: 12, color: '#666', marginRight: 4 },
  filtroBtn:           { fontSize: 11, padding: '5px 12px', borderRadius: 6, border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' },
  filtroActivo:        { background: '#1A6B3A', color: '#fff', borderColor: '#1A6B3A' },
  // Contenedor modular de fila de estudiante
  card:                { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, overflow: 'hidden' },
  cardHead:            { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' },
  cardLeft:            { display: 'flex', alignItems: 'center', gap: 10 },
  cardRight:           { display: 'flex', alignItems: 'center', gap: 14 },
  dot:                 { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  miniAvatar:          { width: 30, height: 30, borderRadius: '50%', background: '#E8F3EC', color: '#1A6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 },
  cardNombre:          { fontSize: 13, fontWeight: 500, color: '#111' },
  cardMeta:            { fontSize: 11, color: '#999', marginTop: 2 },
  metricaItem:         { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  metricaLabel:        { fontSize: 10, color: '#999' },
  metricaVal:          { fontSize: 14, fontWeight: 500, color: '#111' },
  chevron:             { fontSize: 13, color: '#999' },
  // Vista interna expandida (Acordeón abierto)
  cardDetalle:         { borderTop: '0.5px solid #f0f0f0', padding: '14px 16px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 },
  alertasWrap:         { flex: 1 },
  alertasTitle:        { fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  alertaItem:          { fontSize: 12, color: '#333', background: '#fff', padding: '6px 10px', borderRadius: 6 },
  accionesWrap:        { display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 },
  // Botones de acción del panel
  btnPrimario:         { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#1A6B3A', color: '#fff', cursor: 'pointer', fontWeight: 500 },
  btnSecundario:       { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', color: '#333', cursor: 'pointer' },
}