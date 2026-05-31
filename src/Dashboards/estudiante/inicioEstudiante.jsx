import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
//importaciones de sub-vistas
import MiPerfil from './perfil.jsx'
import EstadoPagos from './pagos.jsx'
import MisMaterias from './misMaterias.jsx'
import HistorialAcademico from './HistorialAcademico.jsx'
/*'import Horario from './Horario'*/

//futura entrada de datos, registros estaticos para demo, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL
const MATERIAS = [
  { nombre: 'Bases de datos',        c1: 4.2, c2: 3.9, def: 4.1, estado: 'ok'   },
  { nombre: 'Redes de computadores', c1: 3.5, c2: 3.8, def: 3.7, estado: 'ok'   },
  { nombre: 'Cálculo diferencial',   c1: 2.8, c2: 3.1, def: 3.0, estado: 'warn' },
  { nombre: 'Ingeniería de software',c1: 4.5, c2: 4.3, def: 4.4, estado: 'ok'   },
  { nombre: 'Álgebra lineal',        c1: 2.5, c2: '—', def: null, estado: 'err' },
]

const PAGOS = [ // entrada de datos, registros estaticos para demo, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL
  { concepto: 'Matrícula 2024-2', fecha: 'Pagado · Oct 2024', estado: 'ok',   label: 'Paz y salvo' },
  { concepto: 'Matrícula 2025-1', fecha: 'Vence 15 Feb 2025', estado: 'warn', label: 'Pendiente'   },
]

//función principal del dashboard, muestras la seccion de la pagina donde se ven la inforamcion
// el bloque muestra la pantalla segun el estado alamcenado en la variable vista, por defecto muestra 
// la vista de inicio con estadísticas y progreso académico, y un resumen de las materias actuales con sus notas.
function Inicio({ setVista }) {
  return (
    //vista de inicio con estadísticas y progreso académico escrita por defecto, en el bloque de contenido principal del dashboard,
    //con un resumen de las materias actuales con sus notas, y un enlace para ver todas las materias en detalle.
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}> {/* bloque de estadísticas principales del estudiante, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL */}
      <div style={s.statsRow}>
        <StatCard s={s} label="Promedio acumulado"  valor="3.7"   badge="Al día"         badgeEstado="ok" />
        <StatCard s={s} label="Materias cursando"   valor="5"    sub="Este período" />
        <StatCard s={s} label="Créditos aprobados"  valor="112"  sub="de 176 totales" />
        <StatCard s={s} label="Estado de matrícula" valor="Activo" badge="Pago pendiente" badgeEstado="warn" valorSmall />
      </div>
      <div style={s.row2}>
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>Materias y notas actuales</span> {/* bloque de materias y notas actuales, con un enlace para ver todas las materias en detalle. */}
            <span onClick={() => setVista('materias')} style={{ ...s.panelLink, cursor: 'pointer' }}>Ver todas ↗</span>
          </div>
          <div style={s.panelBody}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Asignatura</th>
                  <th style={s.th}>Corte 1</th>
                  <th style={s.th}>Corte 2</th>
                  <th style={s.th}>Definitiva</th>
                </tr>
              </thead>
              <tbody>
                {MATERIAS.map((m, i) => ( //FUNCION que muestra materias ENTRADA DE DATOS, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL
                  <tr key={i}>
                    <td style={s.td}>{m.nombre}</td>
                    <td style={s.td}>{m.c1}</td>
                    <td style={s.td}>{m.c2}</td>
                    <td style={s.td}>
                      <span style={{ ...s.pill, ...(s.badge[m.estado] || {}) }}>
                        {m.def !== null ? m.def : 'En riesgo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}> {/* bloque de progreso académico y estado de pagos, con barras de progreso para créditos aprobados, materias aprobadas y semestres cursados, y un resumen del estado de pagos con íconos y etiquetas. */}
          <div style={s.panel}>
            <div style={s.panelHead}>
              <span style={s.panelTitle}>Avance de carrera</span>
              <span style={{ fontSize: 12, color: '#666' }}>64%</span>
            </div>
            {/* FUNCION opcional que muestra el progreso académico con barras de progreso para créditos aprobados, materias aprobadas y semestres cursados, ENTRADA DE DATOS, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL */}
            <div style={{ ...s.panelBody, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <BarraProgreso s={s} label="Créditos aprobados" actual={112} total={176} color="#0C447C" /> 
              <BarraProgreso s={s} label="Materias aprobadas"  actual={38}  total={58}  color="#1D9E75" />
              <BarraProgreso s={s} label="Semestres cursados"  actual={6}   total={10}  color="#BA7517" />
            </div>
          </div>
          <div style={s.panel}> {/* bloque de estado de pagos con íconos y etiquetas*/}
            <div style={s.panelHead}>
              <span style={s.panelTitle}>Estado de pagos</span>
              <span onClick={() => setVista('pagos')} style={s.panelLink}>Ver detalle ↗</span>
            </div>
            <div style={s.panelBody}>
              {/* FUNCION que muestra el estado de pagos con íconos y etiquetas, ENTRADA DE DATOS, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL */}
              {PAGOS.map((p, i) => (
                <div key={i} style={s.pagoItem}>
                  <div style={s.pagoLeft}>
                    <div style={{ ...s.pagoIcon, ...(s.badge[p.estado] || {}) }}>
                      {p.estado === 'ok' ? '✓' : '⏱'}
                    </div>
                    <div>
                      <div style={s.pagoNombre}>{p.concepto}</div>
                      <div style={s.pagoFecha}>{p.fecha}</div>
                    </div>
                  </div>
                  <span style={{ ...s.pill, ...(s.badge[p.estado] || {}) }}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardEstudiante() { //función principal del dashboard, muestra la vista de inicio  por defecto
  const [vista, setVista] = useState('inicio')
  
  // Inicialización del hook router para la navegación e interrupción del ciclo de sesión local
  const navigate = useNavigate()

  //funcion que recupera la información del usuario, como su nombre, carrera, materias inscritas, notas, historial académico y estado de pagos, 
  // REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL
  const TITULOS = {
    inicio: 'Bienvenido, Carlos', perfil: 'Mi perfil',
    materias: 'Mis materias',    notas: 'Mis notas',
    historial: 'Historial académico', horario: 'Horario',
    pagos: 'Estado de pagos',
  }

  //bloque de componentes de vista para cada sección del dashboard, actualmente con 
  // contenido de marcador de posición,
  const Horario = () => <div>Vista Horario</div>

  //funcion que enlaza cada sección del dashboard con su respectiva vista, 
  //define el estado de la variable vista y segun el estado, enlaza con un componente para mostrar el contenido correspondiente 
  //en el bloque principal del dashboard
  const VISTAS = {
    inicio:    <Inicio setVista={setVista} />,
    materias:  <MisMaterias />,
    perfil:    <MiPerfil />,
    historial: <HistorialAcademico />,
    horario:   <Horario />,
    pagos:     <EstadoPagos />,
  }

  //sidebar de navegación lateral con enlaces a diferentes secciones del dashboard, 
  // y un área principal que muestra el contenido según la vista seleccionada.
  return (
    <div style={s.db}>
      <aside style={s.sidebar}>
        <div style={s.sbBrand}>
          <div style={s.sbBrandName}>SIGAU</div>
          <div style={s.sbBrandSub}>Universidad Distrital</div>
        </div>
        <div style={s.sbUser}>
          <div style={s.sbAvatar}>CA</div>
          <div>
            <div style={s.sbUserName}>Carlos Ariza</div> {/* recuperar nombre del usuario, ENTRADA DE DATOS, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL */}
            <div style={s.sbUserRole}>Estudiante · Ing. Sistemas</div>
          </div>
        </div>
        <nav style={s.sbNav}>
          {/* sección de navegación principal con enlaces a diferentes vistas del dashboard, instancias NavItem con la información de cada vista */}
          <div style={s.sbSection}>Principal</div>
          <NavItem icon="ti-layout-dashboard" label="Inicio"              vista="inicio"    actual={vista} setVista={setVista} />
          <NavItem icon="ti-user"             label="Mi perfil"           vista="perfil"    actual={vista} setVista={setVista} />
          <div style={s.sbSection}>Académico</div>
          <NavItem icon="ti-books"            label="Mis materias"        vista="materias"  actual={vista} setVista={setVista} />
          <NavItem icon="ti-history"          label="Historial académico" vista="historial" actual={vista} setVista={setVista} />
          <NavItem icon="ti-calendar"         label="Horario"             vista="horario"   actual={vista} setVista={setVista} />
          <div style={s.sbSection}>Financiero</div>
          <NavItem icon="ti-receipt"          label="Estado de pagos"     vista="pagos"     actual={vista} setVista={setVista} />
        </nav>
        <div style={s.sbBottom}>
          <NavItem icon="ti-settings" label="Configuración" onClick={() => navigate('/configuracion')} />
          {/* CONTROL DE LOGOUT: Dispara la redirección router limpiando la pila de vistas del dashboard hacia el módulo público */}
          <NavItem icon="ti-logout"   label="Cerrar sesión" onClick={() => navigate('/Login')} />
        </div>
      </aside>
      {/* recupera la info de los periodos académicos, ENTRADA DE DATOS, REEMPLAZAR POR ENTRADA DE BASE DE DATOS REAL */}
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

//función de componente para los elementos de navegación lateral, recibe el ícono, etiqueta, vista asociada, vista actual, función para cambiar la vista y una 
// función  onClick para definir el valor de setvista y cambiar la seccion del dashboard que se muestra en el bloque principal, resalta el elemento activo según la vista actual.
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

//funcion estilo que muestra las tarjetas de estadísticas principales en la vista de inicio, 
// recibe el estilo, etiqueta, valor, subtítulo opcional, estado de badge opcional y un flag para mostrar el valor en tamaño pequeño, 
// muestra la información formateada con estilos y colores según el estado del badge.
function StatCard({ s, label, valor, sub, badge, badgeEstado, valorSmall }) {
  return (
    <div style={s.statCard}>
      <div style={s.statLabel}>{label}</div>
      <div style={{ ...s.statVal, ...(valorSmall ? { fontSize: 15, marginTop: 4 } : {}) }}>{valor}</div>
      {sub   && <div style={s.statSub}>{sub}</div>}
      {badge && <span style={{ ...s.pill, ...(s.badge[badgeEstado] || {}), marginTop: 4, display: 'inline-block' }}>{badge}</span>}
    </div>
  )
}

//función de componente para mostrar el progreso académico con barras de progreso para créditos aprobados, materias aprobadas y semestres cursados,
// recibe el estilo, etiqueta, valor actual, valor total y color de la barra, calcula el porcentaje de progreso y muestra una barra visual con la información formateada.
function BarraProgreso({ s, label, actual, total, color }) {
  const pct = Math.round((actual / total) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 5 }}>
        <span>{label}</span><span>{actual} / {total}</span>
      </div>
      <div style={s.barWrap}>
        <div style={{ ...s.barFill, width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// OBJETO DE ESTILOS LOCALES: Arquitectura de diseño de la interfaz del sistema
const s = {
  db:          { display: 'flex', height: '100vh', fontSize: 14, background: '#f4f4f4', overflow: 'hidden' },
  sidebar:     { width: 220, flexShrink: 0, background: '#0C447C', display: 'flex', flexDirection: 'column' },
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
  row2:        { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginTop: 16 },
  panel:       { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:   { padding: '14px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle:  { fontSize: 13, fontWeight: 500, color: '#111' },
  panelLink:   { fontSize: 11, color: '#185FA5', cursor: 'pointer' },
  panelBody:   { padding: '12px 16px' },
  table:       { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th:          { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:          { padding: '8px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
  pill:        { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  badge:       { ok: { background: '#EAF3DE', color: '#3B6D11' }, warn: { background: '#FAEEDA', color: '#854F0B' }, err: { background: '#FCEBEB', color: '#A32D2D' }, info: { background: '#E6F1FB', color: '#185FA5' } },
  barWrap:     { background: '#f4f4f4', borderRadius: 4, height: 6, overflow: 'hidden' },
  barFill:     { height: 6, borderRadius: 4 },
  pagoItem:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '0.5px solid #eee' },
  pagoLeft:    { display: 'flex', alignItems: 'center', gap: 10 },
  pagoIcon:    { width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 },
  pagoNombre:  { fontSize: 12, fontWeight: 500, color: '#111' },
  pagoFecha:   { fontSize: 11, color: '#999' },
}