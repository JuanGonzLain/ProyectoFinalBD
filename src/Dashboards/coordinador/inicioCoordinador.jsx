import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MiPerfil from './perfil.jsx'
// import EstudiantesActivos  from './EstudiantesActivos'
// import RiesgoAcademico     from './RiesgoAcademico'
// import Homologaciones      from './Homologaciones'
// import Reportes             from './Reportes'
// import GruposYCupos        from './GruposYCupos'
// import NotasYAsignaturas   from './NotasYAsignaturas'

// Diccionario de títulos dinámicos para la barra superior según la vista activa, recupera los valores de la base de datos para mostrar 
// el título correcto en la barra superior del dashboard del coordinador,
//  dependiendo de la sección que el usuario haya seleccionado en el menú lateral, esto permite una navegación más intuitiva y contextualizada dentro del dashboard.
const TITULOS = {
  inicio:         'Indicadores de rendimiento',
  estudiantes:  'Estudiantes activos',
  riesgo:       'Riesgo académico',
  homologaciones:'Homologaciones',
  reportes:     'Reportes académicos',
  grupos:       'Grupos y cupos',
  notas:        'Notas y asignaturas',
  perfil:       'Perfil del Coordinador',
}

// Datos duros estáticos  para métricas clave globales del programa, REEMPLAXAR POR DATOS REALES DESDE LA BASE DE DATOS
const STATS = [
  { label: 'Estudiantes activos',   valor: 312, sub: 'Ing. Sistemas', badge: null },
  { label: 'Promedio del programa', valor: 3.7, badge: 'Aceptable', badgeEstado: 'ok' },
  { label: 'En riesgo académico',   valor: 28,  badge: 'Atención',  badgeEstado: 'warn' },
  { label: 'Homologaciones pendientes', valor: 7, badge: 'Revisar', badgeEstado: 'warn' },
]

// Datos duros estáticos para el listado de rendimiento por materia, REEMPLAXAR POR DATOS REALES DESDE LA BASE DE DATOS
const RENDIMIENTO_ASIG = [
  { nombre: 'Bases de datos I',      promedio: 3.8, aprobados: 85, reprobados: 15 },
  { nombre: 'Cálculo diferencial',   promedio: 3.2, aprobados: 70, reprobados: 30 },
  { nombre: 'Ingeniería de software', promedio: 4.1, aprobados: 92, reprobados: 8  },
  { nombre: 'Redes de computadores', promedio: 3.5, aprobados: 78, reprobados: 22 },
  { nombre: 'Álgebra lineal',        promedio: 3.0, aprobados: 65, reprobados: 35 },
]

// Paleta de colores semántica para Badges y Alertas (Éxito, Advertencia, Peligro)
const BADGE = {
  ok:   { background: '#EAF3DE', color: '#3B6D11' },
  warn: { background: '#FAEEDA', color: '#854F0B' },
  err:  { background: '#FCEBEB', color: '#A32D2D' },
}

// Función auxiliar para determinar el estado académico basado en el promedio, seccion usada mas para backend pero se deja aqui 
// para simular el modelo completo de procesamiento de datos en el frontend
function estadoPromedio(p) {
  if (p >= 4.0) return 'ok'
  if (p >= 3.5) return 'warn'
  return 'err'
}

function Inicio() { //función que representa la vista principal del dashboard del coordinador, mostrando indicadores clave de rendimiento académico del programa, alertas prioritarias y un análisis detallado del rendimiento por asignatura.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* BLOQUE: Tarjetas de resumen estadístico */}
      <div style={s.statsRow}>
        {STATS.map((st, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statVal}>{st.valor}</div>
            {st.sub   && <div style={s.statSub}>{st.sub}</div>}
            {st.badge && (
              <span style={{ ...s.pill, ...BADGE[st.badgeEstado], marginTop: 4, display: 'inline-block' }}>
                {st.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* BLOQUE: Tabla de rendimiento por asignatura */}
      <div style={s.panel}>
        <div style={s.panelHead}>
          <span style={s.panelTitle}>Rendimiento por asignatura — Período 2025-1</span>
          <span style={{ fontSize: 11, color: '#999' }}>{RENDIMIENTO_ASIG.length} asignaturas</span>
        </div>
        <div style={s.panelBody}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Asignatura</th>
                <th style={s.th}>Promedio</th>
                <th style={s.th}>Aprobados %</th>
                <th style={s.th}>Distribución</th>
                <th style={s.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {RENDIMIENTO_ASIG.map((a, i) => (
                <tr key={i}>
                  <td style={s.td}>{a.nombre}</td>
                  <td style={s.td}><strong>{a.promedio}</strong></td>
                  <td style={s.td}>{a.aprobados}%</td>
                  {/* Celda con barra de distribución visual (Aprobados vs Reprobados) */}
                  <td style={{ ...s.td, minWidth: 160 }}>
                    <div style={{ display: 'flex', gap: 2, height: 16, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${a.aprobados}%`, background: '#1D9E75' }} />
                      <div style={{ width: `${a.reprobados}%`, background: '#E24B4A' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 3, fontSize: 10, color: '#999' }}>
                      <span>✓ {a.aprobados}%</span>
                      <span>✗ {a.reprobados}%</span>
                  </div>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.pill, ...BADGE[estadoPromedio(a.promedio)] }}>
                      {estadoPromedio(a.promedio) === 'ok' ? 'Bueno' : estadoPromedio(a.promedio) === 'warn' ? 'Aceptable' : 'Bajo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOQUE: Distribución en dos columnas (Historial de promedios y Alertas de riesgo) */}
      <div style={s.row2}>

        {/* Panel Izquierdo: Gráfico de barras horizontal */}
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>Promedio histórico del programa</span>
          </div>
          <div style={s.panelBody}>
            {[
              { sem: '2023-1', prom: 3.5 },
              { sem: '2023-2', prom: 3.6 },
              { sem: '2024-1', prom: 3.5 },
              { sem: '2024-2', prom: 3.8 },
              { sem: '2025-1', prom: 3.7 },
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 4 }}>
                  <span>{p.sem}</span>
                  <span><strong>{p.prom}</strong></span>
                </div>
                <div style={s.barWrap}>
                  {/* Cálculo matemático dinámico basado en escala 0.0 a 5.0 */}
                  <div style={{ ...s.barFill, width: `${(p.prom / 5) * 100}%`, background: '#1A6B3A' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Feed de notificaciones y alertas prioritarias */}
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>Alertas del programa</span>
          </div>
          <div style={s.panelBody}>
            {[
              { tipo: 'err',   texto: '5 estudiantes con más de 2 materias reprobadas' },
              { tipo: 'warn', texto: '28 estudiantes en riesgo académico este período' },
              { tipo: 'warn', texto: '7 homologaciones pendientes de revisión' },
              { tipo: 'ok',   texto: 'Cálculo diferencial mejoró 0.3 puntos vs período anterior' },
              { tipo: 'ok',   texto: 'Tasa de aprobación general: 81%' },
            ].map((a, i) => (
              <div key={i} style={{ ...s.alertaItem, borderLeft: `3px solid ${a.tipo === 'ok' ? '#1D9E75' : a.tipo === 'warn' ? '#BA7517' : '#E24B4A'}` }}>
                <span style={{ fontSize: 12, color: '#333' }}>{a.texto}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

//función de componente para los elementos de navegación lateral, recibe el ícono, etiqueta, vista asociada, vista actual, función para cambiar la vista y una 
// función  onClick para definir el valor de setvista y cambiar la seccion del dashboard que se muestra en el bloque principal, resalta el elemento activo según la vista actual.
function NavItem({ icon, label, vista, actual, setVista, onClick }) {
  const activo = vista && actual === vista
  return (
    <div
      onClick={onClick ?? (() => setVista(vista))}
      style={{ ...s.sbItem, ...(activo ? s.sbItemActive : {}), cursor: 'pointer' }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: 16 }} />
      {label}
    </div>
  )
}


export default function DashboardCoordinador() { //función principal del dashboard, muestra la vista de inicio  por defecto
  const navigate = useNavigate()
  const [vista, setVista] = useState('inicio')

  // MAPEADOR DE VISTAS (MOCKS): Reemplaza los divs de desarrollo por los componentes reales al importarlos
  const VISTAS = {
    inicio:    <Inicio setVista={setVista} />,
    estudiantes:   <EstudiantesActivos />,
    riesgo:        <RiesgoAcademico />,
    homologaciones:<Homologaciones />,
    reportes:      <Reportes />,
    grupos:        <GruposYCupos />,
    notas:         <NotasYAsignaturas />,
  }

  return (
    <div style={s.db}>
      {/* SECCIÓN 1: Menú de Navegación Lateral (Fijo) */}
      <aside style={s.sidebar}>
        <div style={s.sbBrand}>
          <div style={s.sbBrandName}>SIGAU</div>
          <div style={s.sbBrandSub}>Universidad Distrital</div>
        </div>
        
        {/* Datos fijos del usuario autenticado, al hacer click cambia la vista a la sección de perfil */}
        <div style={{ ...s.sbUser, cursor: 'pointer' }} onClick={() => setVista('perfil')}>
          <div style={s.sbAvatar}>JR</div>
          <div>
            <div style={s.sbUserName}>Jorge Ramirez</div>
            <div style={s.sbUserRole}>Coordinador · Ing. Sistemas</div>
          </div>
        </div>

        {/* Lista de enlaces de navegación agrupados por categorías */}
        <nav style={s.sbNav}>
          <div style={s.sbSection}>Principal</div>
          <NavItem icon="ti-layout-dashboard" label="Indicadores"      vista="inicio"        actual={vista} setVista={setVista} />
          
          <div style={s.sbSection}>Programa</div>
          <NavItem icon="ti-users"            label="Estudiantes"        vista="estudiantes"    actual={vista} setVista={setVista} />
          <NavItem icon="ti-alert-triangle"   label="Riesgo académico"   vista="riesgo"         actual={vista} setVista={setVista} />
          <NavItem icon="ti-books"            label="Notas y asignaturas"vista="notes"          actual={vista} setVista={setVista} />
          <NavItem icon="ti-layout-grid"      label="Grupos y cupos"     vista="grupos"         actual={vista} setVista={setVista} />
          
          <div style={s.sbSection}>Gestión</div>
          <NavItem icon="ti-transfer-in"      label="Homologaciones"     vista="homologaciones" actual={vista} setVista={setVista} />
          <NavItem icon="ti-file-analytics"   label="Reportes"           vista="reportes"       actual={vista} setVista={setVista} />
          
          <div style={s.sbSection}>Usuario</div>
          <NavItem icon="ti-user"              label="Mi Perfil"          vista="perfil"         actual={vista} setVista={setVista} />
        </nav>

        {/* Sección inferior con accesos al login y configuraciones del router */}
        <div style={s.sbBottom}>
          <NavItem icon="ti-settings" label="Configuración" onClick={() => navigate('/configuracion')} />
          <NavItem icon="ti-logout"   label="Cerrar sesión" onClick={() => navigate('/login')} />
        </div>
      </aside>

      {/* SECCIÓN 2: Contenedor Principal (Cambia dinámicamente según el estado) */}
      <div style={s.main}>
        {/* Barra superior de contexto */}
        <div style={s.topbar}>
          <span style={s.topbarTitle}>{TITULOS[vista]}</span>
          <div style={s.topbarRight}>
            <span style={s.topbarPeriod}>📅 Período 2025-1</span>
            <span style={s.topbarBell}>🔔</span>
          </div>
        </div>

        {/* Inyección de la subvista calculada en el diccionario de componentes */}
        <div style={s.content}>
          {VISTAS[vista]}
        </div>
      </div>
    </div>
  )
}

const s = {
  db:           { display: 'flex', height: '100vh', fontSize: 14, background: '#f4f4f4', overflow: 'hidden' },
  sidebar:      { width: 220, flexShrink: 0, background: '#1A6B3A', display: 'flex', flexDirection: 'column' },
  sbBrand:      { padding: '20px 20px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.1)' },
  sbBrandName:  { fontSize: 15, fontWeight: 500, color: '#fff' },
  sbBrandSub:   { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  sbUser:       { padding: '14px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 },
  sbAvatar:     { width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#fff', flexShrink: 0 },
  sbUserName:   { fontSize: 13, color: '#fff', fontWeight: 500 },
  sbUserRole:   { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  sbNav:        { flex: 1, padding: '12px 0', overflowY: 'auto' },
  sbSection:    { fontSize: 10, color: 'rgba(255,255,255,0.35)', padding: '10px 20px 4px', textTransform: 'uppercase', letterSpacing: '0.08em' },
  sbItem:       { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px', color: 'rgba(255,255,255,0.7)', fontSize: 13, borderLeft: '2px solid transparent' },
  sbItemActive: { background: 'rgba(255,255,255,0.1)', color: '#fff', borderLeftColor: '#fff' },
  sbBottom:     { padding: '12px 0', borderTop: '0.5px solid rgba(255,255,255,0.1)' },
  main:         { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },
  topbar:       { background: '#fff', borderBottom: '0.5px solid #eee', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarTitle:  { fontSize: 15, fontWeight: 500, color: '#111' },
  topbarRight:  { display: 'flex', alignItems: 'center', gap: 12 },
  topbarPeriod: { fontSize: 12, color: '#666', background: '#f4f4f4', padding: '4px 10px', borderRadius: 8, border: '0.5px solid #ddd' },
  topbarBell:   { fontSize: 18, cursor: 'pointer' },
  content:      { flex: 1, overflowY: 'auto', padding: '20px 24px' },
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:     { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:    { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:      { fontSize: 22, fontWeight: 500, color: '#111' },
  statSub:      { fontSize: 11, color: '#999', marginTop: 3 },
  pill:         { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  row2:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  panel:        { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:    { padding: '14px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle:   { fontSize: 13, fontWeight: 500, color: '#111' },
  panelBody:    { padding: '12px 16px' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:           { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:           { padding: '9px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  barWrap:      { background: '#f4f4f4', borderRadius: 4, height: 6, overflow: 'hidden' },
  barFill:      { height: 6, borderRadius: 4 },
  alertaItem:   { padding: '8px 10px', marginBottom: 8, borderRadius: 6, background: '#fafafa' },
  mockView:     { padding: 24, background: '#fff', borderRadius: 12, border: '0.5px solid #eee', color: '#666', textAlign: 'center' }
}