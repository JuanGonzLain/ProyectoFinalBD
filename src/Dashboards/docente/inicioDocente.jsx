import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MisGrupos        from './grupos.jsx'
import Estudiantes       from './Estudiantes'
import RegistroNotas      from './RegistroNotas'
// import RendimientoAsignaturas from './RendimientoAsignaturas'
import MiPerfil from './perfil.jsx'

// Marcadores de posición temporales en caso de que los archivos de sub-vistas aún no estén creados
const InicioDocenteView = ({ setVista }) => <Inicio setVista={setVista} />
const RendimientoAsignaturas = () => <div style={{ padding: 12 }}>Módulo Analítico de Rendimiento</div>

// ENTRADA DE DATOS: Estructura estática con la carga de asignaturas asignadas al docente. REEEMPLAZAR POR CONSULTA A LA BASE DE DATOS REAL
const GRUPOS = [
  { nombre: 'Bases de datos I',       grupo: 'G01', estudiantes: 28, promedio: 3.8, aprobados: 24, enRiesgo: 3, cortes: 'Corte 1 y 2 registrados' },
  { nombre: 'Bases de datos II',      grupo: 'G02', estudiantes: 22, promedio: 4.1, aprobados: 20, enRiesgo: 1, cortes: 'Corte 1 registrado' },
  { nombre: 'Ingeniería de software', grupo: 'G01', estudiantes: 30, promedio: 3.5, aprobados: 23, enRiesgo: 5, cortes: 'Corte 1 registrado' },
]

// Diccionario global para la sincronización dinámica de títulos en la barra superior
const TITULOS = {
  inicio:      'Bienvenida, María',
  perfil:      'Mi perfil',
  grupos:      'Mis grupos',
  estudiantes: 'Estudiantes',
  notas:       'Registro de notas',
  rendimiento: 'Rendimiento de asignaturas',
}

// Subcomponente interno para la renderización de la página principal del docente (Estadísticas y cards)
function Inicio({ setVista }) {
  const totalEstudiantes = GRUPOS.reduce((a, g) => a + g.estudiantes, 0)
  const promedioGeneral  = (GRUPOS.reduce((a, g) => a + g.promedio * g.estudiantes, 0) / totalEstudiantes).toFixed(1)
  const totalRiesgo      = GRUPOS.reduce((a, g) => a + g.enRiesgo, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* BLOQUE DE ESTADÍSTICAS GENERALES */}
      <div style={s.statsRow}>
        <StatCard label="Grupos asignados"     valor={GRUPOS.length} sub="Este período" />
        <StatCard label="Total estudiantes"    valor={totalEstudiantes} sub="En todos los grupos" />
        <StatCard label="Promedio general"     valor={promedioGeneral} badge="Aceptable" badgeEstado="ok" />
        <StatCard label="En riesgo académico"  valor={totalRiesgo} badge="Seguimiento" badgeEstado="warn" />
      </div>

      {/* REJILLA DE TARJETAS (GRIDS) */}
      <div style={s.gruposGrid}>
        {GRUPOS.map((g, i) => (
          <div key={i} style={s.gcard}>
            <div style={s.gcardHead}>
              <div>
                <div style={s.gcardNombre}>{g.nombre}</div>
                <div style={s.gcardGrupo}>Grupo {g.grupo} · {g.estudiantes} estudiantes</div>
              </div>
              <span style={{ ...s.pill, ...s.badge[g.promedio >= 4.0 ? 'ok' : g.promedio >= 3.5 ? 'warn' : 'err'] }}>
                Prom. {g.promedio}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0' }}>
              <div>
                <div style={s.barRow}><span>Aprobados</span><span>{g.aprobados}/{g.estudiantes}</span></div>
                <div style={s.barWrap}><div style={{ ...s.barFill, width: `${(g.aprobados / g.estudiantes) * 100}%`, background: '#1D9E75' }} /></div>
              </div>
              <div>
                <div style={s.barRow}><span>En riesgo</span><span>{g.enRiesgo}/{g.estudiantes}</span></div>
                <div style={s.barWrap}><div style={{ ...s.barFill, width: `${(g.enRiesgo / g.estudiantes) * 100}%`, background: '#BA7517' }} /></div>
              </div>
            </div>

            <div style={s.gcardFooter}>
              <span style={{ fontSize: 11, color: '#999' }}>{g.cortes}</span>
              <button style={s.btnVer} onClick={() => setVista('grupos')}>Ver grupo ↗</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, valor, sub, badge, badgeEstado }) {
  return (
    <div style={s.statCard}>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statVal}>{valor}</div>
      {sub   && <div style={s.statSub}>{sub}</div>}
      {badge && <span style={{ ...s.pill, ...s.badge[badgeEstado], marginTop: 4, display: 'inline-block' }}>{badge}</span>}
    </div>
  )
}

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

// FUNCIÓN PRINCIPAL DEL DASHBOARD DOCENTE
export default function DashboardDocente() {
  const navigate = useNavigate()
  const [vista, setVista] = useState('inicio')

  // CONTROL DE ENRUTAMIENTO INTERNO: Añadida la correspondencia del estado 'perfil'
  const VISTAS = {
    inicio:      <InicioDocenteView setVista={setVista} />,
    perfil:      <MiPerfil />,
    grupos:      <MisGrupos />,
    estudiantes: <Estudiantes />,
    notas:       <RegistroNotas />,
    rendimiento: <RendimientoAsignaturas />,
  }

  return (
    <div style={s.db}>
      
      {/* MENÚ DE NAVEGACIÓN LATERAL (SIDEBAR) */}
      <aside style={s.sidebar}>
        <div style={s.sbBrand}>
          <div style={s.sbBrandName}>SIGAU</div>
          <div style={s.sbBrandSub}>Universidad Distrital</div>
        </div>
        <div style={s.sbUser}>
          <div style={s.sbAvatar}>MP</div>
          <div>
            <div style={s.sbUserName}>María Pérez</div>
            <div style={s.sbUserRole}>Docente · Ing. Sistemas</div>
          </div>
        </div>
        
        <nav style={s.sbNav}>
          <div style={s.sbSection}>Principal</div>
          <NavItem icon="ti-layout-dashboard" label="Inicio"            vista="inicio"      actual={vista} setVista={setVista} />
          {/* NUEVA OPCIÓN: Acceso al módulo de información de perfil docente */}
          <NavItem icon="ti-user"             label="Mi perfil"         vista="perfil"      actual={vista} setVista={setVista} />
          
          <div style={s.sbSection}>Académico</div>
          <NavItem icon="ti-books"            label="Mis grupos"        vista="grupos"      actual={vista} setVista={setVista} />
          <NavItem icon="ti-users"            label="Estudiantes"       vista="estudiantes" actual={vista} setVista={setVista} />
          <NavItem icon="ti-pencil"           label="Registro de notas" vista="notas"       actual={vista} setVista={setVista} />
          <NavItem icon="ti-chart-bar"        label="Rendimiento"       vista="rendimiento" actual={vista} setVista={setVista} />
        </nav>
        
        <div style={s.sbBottom}>
          <NavItem icon="ti-settings" label="Configuración" onClick={() => navigate('/configuracion')} />
          <NavItem icon="ti-logout"   label="Cerrar sesión" onClick={() => navigate('/login')} />
        </div>
      </aside>

      {/* BLOQUE CONTENEDOR PRINCIPAL */}
      <div style={s.main}>
        <div style={s.topbar}>
          <span style={s.topbarTitle}>{TITULOS[vista]}</span>
          <div style={s.topbarRight}>
            <span style={s.topbarPeriod}>📅 Período 2025-1</span>
            <span style={s.topbarBell}>🔔</span>
          </div>
        </div>
        <div style={s.content}>
          {VISTAS[vista]}
        </div>
      </div>

    </div>
  )
}

const s = {
  db:          { display: 'flex', height: '100vh', fontSize: 14, background: '#f4f4f4', overflow: 'hidden' },
  sidebar:     { width: 220, flexShrink: 0, background: '#12947C', display: 'flex', flexDirection: 'column' },
  sbBrand:     { padding: '20px 20px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.1)' },
  sbBrandName: { fontSize: 15, fontWeight: 500, color: '#fff' },
  sbBrandSub:  { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  sbUser:      { padding: '14px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 },
  sbAvatar:    { width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#fff', flexShrink: 0 },
  sbUserName:  { fontSize: 13, color: '#fff', fontWeight: 500 },
  sbUserRole:  { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  sbNav:       { flex: 1, padding: '12px 0', overflowY: 'auto' },
  sbSection:   { fontSize: 10, color: 'rgba(255,255,255,0.35)', padding: '10px 20px 4px', textTransform: 'uppercase', letterSpacing: '0.08em' },
  sbItem:      { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px', color: 'rgba(255,255,255,0.7)', fontSize: 13, borderLeft: '2px solid transparent' },
  sbItemActive:{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderLeftColor: '#fff' },
  sbBottom:    { padding: '12px 0', borderTop: '0.5px solid rgba(255,255,255,0.1)' },
  main:        { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },
  topbar:      { background: '#fff', borderBottom: '0.5px solid #eee', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarTitle: { fontSize: 15, fontWeight: 500, color: '#111' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 12 },
  topbarPeriod:{ fontSize: 12, color: '#666', background: '#f4f4f4', padding: '4px 10px', borderRadius: 8, border: '0.5px solid #ddd' },
  topbarBell:  { fontSize: 18, cursor: 'pointer' },
  content:     { flex: 1, overflowY: 'auto', padding: '20px 24px' },
  statsRow:    { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard:    { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:   { fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:     { fontSize: 22, fontWeight: 500, color: '#111' },
  statSub:     { fontSize: 11, color: '#999', marginTop: 3 },
  pill:        { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  badge:       { ok: { background: '#EAF3DE', color: '#3B6D11' }, warn: { background: '#FAEEDA', color: '#854F0B' }, err: { background: '#FCEBEB', color: '#A32D2D' } },
  gruposGrid:  { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 14 },
  gcard:       { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: 16 },
  gcardHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  gcardNombre: { fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 3 },
  gcardGrupo:  { fontSize: 11, color: '#999' },
  barRow:      { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', marginBottom: 4 },
  barWrap:     { background: '#f4f4f4', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 4 },
  barFill:     { height: 6, borderRadius: 4 },
  gcardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '0.5px solid #eee' },
  btnVer:      { fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '0.5px solid #12947C', background: '#fff', color: '#12947C', cursor: 'pointer' },
}