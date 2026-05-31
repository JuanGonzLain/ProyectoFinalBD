import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoUniversidad from '../assets/Escudo_UD.png'

// Futura entrada de usuarios y roles desde base de datos, registros estáticos para demo
const ROLES = [ //matriz de roles predefinidos para demo, cada rol con su correo institucional simulado para autocompletar el campo de correo al seleccionar el rol, REEMPLAZAR CON DATOS REALES EN IMPLEMENTACIÓN FINAL CON BASE DE DATOS
  { key: 'admin',          label: 'Admin',    email: 'admin@universidad.edu.co' },
  { key: 'coordinador',    label: 'Coord.',   email: 'coord@universidad.edu.co' },
  { key: 'docente',        label: 'Docente',  email: 'docente@universidad.edu.co' },
  { key: 'estudiante',     label: 'Estud.',   email: 'est@universidad.edu.co' },
  { key: 'administrativo', label: 'Admvo.',   email: 'adm@universidad.edu.co' },
]

export default function Login() { //funcion principal del componente de login, maneja estado de campos, selección de rol y lógica de redirección
  const navigate = useNavigate()
  const [correo,    setCorreo]    = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [rolActivo, setRolActivo] = useState(null)
  const [error,     setError]     = useState('')

 //al seleccionar un rol, se autocompleta el correo con el email asociado al rol para facilitar el demo, se asigna una contraseña genérica y se limpia cualquier error previo
  function seleccionarRol(rol) { 
    setRolActivo(rol.key)
    setCorreo(rol.email)
    setPassword('demo1234')
    setError('')
  }

  //redirecciona a dashboard correspondiente al rol seleccionado, validación básica para demo
  function handleLogin() {
    if (!correo || !password) { //error de campo email
      setError('Por favor completa todos los campos.')
      return
    }
    if (!rolActivo) { //error de selección de rol para demo, se fuerza a seleccionar un rol para demostrar la redirección a diferentes dashboards según el rol
      setError('Selecciona un rol para el modo demo.')
      return
    }
    setError('')
    navigate(`/dashboards/${rolActivo}`)//redirecciona a la ruta del dashboard según el rol activo, por ejemplo: /dashboards/admin para el rol admin, esto se maneja en el componente App.jsx con rutas dinámicas para cada dashboard
  }

  return ( //estructura principal del login dividida en dos paneles, izquierdo con información institucional y derecho con formulario de login y selección de roles para demo
    <div style={s.page}>
      <div style={s.card}>

        {/* Panel izquierdo */}
        <div style={s.left}>
        
          {/* 1. Header Text (Arriba) */}
          <div style={s.brand}>
            <div style={s.brandTextContainer}>
              <div style={s.brandName}>SIGAU</div>
            </div>
          </div>

          {/* 2. Logo Contenedor (Centro) */}
          <div style={s.logoContainer}>
            <img 
              src={logoUniversidad} 
              alt="Logo Universidad Distrital" 
              style={s.brandLogo} 
            />
          </div>

          {/* 3. Footer Text (Abajo) */}
          <div style={s.leftFooter}>
            <h1 style={s.heroTitle}>Sistema de Gestión Académica Universitaria</h1>
            <p style={s.heroText}>
              Plataforma centralizada para la administración de estudiantes,
              docentes, programas académicos y reportes institucionales.
            </p>
            <div style={s.badgeCondor}>MEJOR QUE CÓNDOR </div>
          </div>
        </div>

        {/* Panel derecho - formulario de login */}
        <div style={s.right}>
          <h2 style={s.title}>Iniciar sesión</h2>
          <p style={s.sub}>Ingresa con tus credenciales institucionales</p>

          {error && ( // Si hay un error, mostrar el mensaje en un cuadro rojo debajo del subtítulo, antes de los campos de entrada
            <div style={s.errorBox}>
              ⚠ {error}
            </div>
          )}


          <div style={s.field}>  {/* El campo de correo electrónico, con su etiqueta y el input controlado por el estado `correo`. Al cambiar el valor del input, se actualiza el estado. */}        
            <label style={s.label}>Correo institucional</label>
            <input
              style={s.input}
              type="email"
              placeholder="usuario@universidad.edu.co"
              value={correo}
              onChange={e => setCorreo(e.target.value)} //alamcena el correo en la funcion login
            />
          </div>

          <div style={s.field}> {/* El campo de contraseña, con su etiqueta y el input controlado por el estado `password`. El tipo del input cambia entre 'text' y 'password' según el estado `showPass` para mostrar u ocultar la contraseña. Al cambiar el valor del input, se actualiza el estado. */}
            <label style={s.label}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                style={s.input}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}//alamcena la contraseña en la funcion login
              />
              <button
                style={s.eyeBtn} //boton para mostrar u ocultar la contraseña, cambia el estado `showPass` en funcion login
                onClick={() => setShowPass(!showPass)}
                type="button"
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            <span style={s.forgot}>¿Olvidaste tu contraseña?</span>
          </div>

          <div style={s.dividerRow}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>acceso rápido demo</span>
            <div style={s.dividerLine} />
          </div>

          <div style={s.rolesGrid}>
            {ROLES.map(rol => ( //define roles dinámicamente desde el array, instacia rol con los datos definidos en el array
              <button
                key={rol.key}
                style={{
                  ...s.chip,
                  ...(rolActivo === rol.key ? s.chipActive : {}),
                }}
                onClick={() => seleccionarRol(rol)} //al hacer clic en un rol, se llama a la función `seleccionarRol` con el rol cargado, lo que actualiza el estado del rol activo y autocompleta el correo y contraseña para demo
              >
                <span style={s.chipLabel}>{rol.label}</span>
              </button>
            ))}
          </div>
          
          <div style={s.btnLoginContainer}>          
            <button style={s.btnLogin} onClick={handleLogin}>
              Iniciar sesión
            </button>
          </div>        
        </div>

      </div>
    </div>
  )
}

const s = { //pagina de estilos en línea para el componente de login
  page: { //estilos para centrar el card de login en la pantalla
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
    boxSizing: 'border-box',
  },
  card: { //estilos para el contenedor principal del login
    display: 'flex',
    width: '90vw',
    height: '90vh',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '0.5px solid #ddd',
    backgroundColor: '#fff',
  },
  // Panel Izquierdo estructurado
  left: {
    flex: 1,
    width: '30%',
    backgroundColor: '#0C447C',
    padding: '48px 44px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  brand: { //estilos para el header del panel izquierdo, con el nombre de la marca o institución, centrado horizontalmente y con un espacio entre el logo y el texto
    justifyContent: 'center',
    display: 'flex', 
    alignItems: 'center', 
    gap: 12 
  },
  brandTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: { 
    fontSize: '40px', 
    fontWeight: '700', 
    color: '#fff',
    letterSpacing: '0.5px'
  },
  brandSub: { 
    fontSize: '12px', 
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '400'
  },
  logoContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
  },
  brandLogo: {
    width: '250%',            
    maxHeight: '350px',      
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)', // Filtro blanco para fondo oscuro
  },
  leftFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  heroTitle: { 
    fontSize: '22px', 
    fontWeight: '600', 
    color: '#fff', 
    margin: 0, 
    lineHeight: 1.3 
  },
  heroText: { 
    fontSize: '13px', 
    color: 'rgba(255,255,255,0.65)', 
    margin: 0, 
    lineHeight: 1.7 
  },
  badgeCondor: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '6px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  
  // Panel Derecho estructurado
  right: {
    width: '70%',
    flexShrink: 0,
    padding: '56px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: { fontSize: 20, fontWeight: 500, margin: '0 0 4px', color: '#111' },
  sub: { fontSize: 13, color: '#666', margin: '0 0 24px' },
  errorBox: {
    backgroundColor: '#fff0f0',
    border: '0.5px solid #f5c2c2',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 12,
    color: '#c0392b',
    marginBottom: 14,
  },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#555', marginBottom: 5, fontWeight: 500 },
  input: {
    width: '65%', 
    padding: '9px 12px',
    borderRadius: 8,
    border: '0.5px solid #ccc',
    fontSize: 13,
    color: '#111',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
  },
  eyeBtn: {
    position: 'absolute', 
    right: 10, 
    top: '50%',
    transform: 'translateY(-70%)',
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    fontSize: 14,
  },
  forgot: { display: 'block', textAlign: 'right', fontSize: 12, color: '#666', marginTop: 5, cursor: 'pointer' },
  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 14px' },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: '#ddd' },
  dividerText: { fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' },
  rolesGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 20 },
  chip: {
    border: '0.5px solid #ddd',
    borderRadius: 8,
    padding: '8px 4px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: 'all .12s',
  },
  chipActive: {
    borderColor: '#185FA5',
    backgroundColor: '#E6F1FB',
  },
  chipLabel: { 
    fontSize: 10, 
    color: '#555', 
    display: 'block' 
  },
  btnLoginContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  btnLogin: {
    width: '25%', 
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0C447C',
    color: '#fff',
    border: 'none',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
}