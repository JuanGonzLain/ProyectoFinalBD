// TODOS LOS DATOS DE LA VISTA IMPORTADOS DESDE LA BASE DE DATOS
// Actualmente se muestran datos estáticos para simular el modelo de procesamiento de datos del coordinador.
// REEMPLAZAR TODOS LOS DATOS POR CONSULTA DE BASE DE DATOS REAL (Ej: tabla_coordinadores)
import { useState } from 'react'

// Función principal del submódulo: Renderiza y gestiona la hoja de datos personales e institucionales del Coordinador.
export default function MiPerfil() {
  // Estados locales para la persistencia transitoria de los datos de contacto del funcionario
  const [editando, setEditando]   = useState(false)
  const [telefono, setTelefono]   = useState('601 323 9300 Ext. 1234')
  const [direccion, setDireccion] = useState('Facultad de Ingeniería, Oficina 402')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>

      {/* COMPONENTE CONTENEDOR: Panel principal de información del perfil administrativo */}
      <div style={s.panel}>
        <div style={s.panelBody}>

          {/* ENCABEZADO DE SECCIÓN: Identidad del funcionario y control de edición */}
          <div style={s.encabezado}>
            <div style={{ flex: 1 }}>
              {/* ENTRADA DE DATOS: Nombre del Coordinador. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <div style={s.nombre}>Jorge Ramirez</div>
              {/* ENTRADA DE DATOS: Cargo y programa bajo gestión. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <div style={s.rol}>Coordinador Académico · Proyecto Curricular de Ingeniería de Sistemas</div>
              {/* ENTRADA DE DATOS: Estado del nombramiento. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <span style={{ ...s.pill, ...s.badge.ok, marginTop: 6, display: 'inline-block' }}>
                Nombramiento Vigente
              </span>
            </div>
            <div>
              {/* Gestión de persistencia: El botón de guardar debería disparar un UPDATE en la tabla de empleados/docentes */}
              {editando
                ? <button style={s.btnGuardar} onClick={() => setEditando(false)}>Guardar cambios</button> 
                : <button style={s.btnEditar}  onClick={() => setEditando(true)}>Editar perfil</button>
              }
            </div>
          </div>

          {/* REJILLA DE INFORMACIÓN: Datos contractuales y de contacto */}
          <div style={s.grid}>
            {/* CAMPOS ADMINISTRATIVOS: Inmutables desde el perfil de usuario (Solo lectura vía RRHH/Registro) */}
            <Campo label="Código de Funcionario"  valor="20101055" />
            <Campo label="Identificación"         valor="CC 79.123.456" />
            <Campo label="Correo Institucional"   valor="j.ramirez@udistrital.edu.co" />
            <Campo label="Dedicación"             valor="Tiempo Completo (40h)" />
            <Campo label="Facultad / Unidad"      valor="Facultad de Ingeniería" />
            <Campo label="Vinculación"            valor="Docente de Planta" />

            {/* CAMPOS DE CONTACTO: Editables para facilitar la comunicación con estudiantes y docentes */}
            <CampoEditable
              label="Teléfono / Extensión"
              valor={telefono}
              editando={editando}
              onChange={setTelefono}
            />
            <CampoEditable
              label="Ubicación de Oficina"
              valor={direccion}
              editando={editando}
              onChange={setDireccion}
            />
          </div>

        </div>
      </div>

      {/* COMPONENTE INFORMATIVO: Protocolo de actualización de datos de carrera */}
      <div style={s.nota}>
        ℹ Los cambios en la vinculación académica o el programa asignado deben gestionarse a través del Consejo de Facultad o la División de Personal.
      </div>

    </div>
  )
}

// Renderización de campos institucionales inmutables
function Campo({ label, valor }) {
  return (
    <div style={s.campoWrap}>
      <div style={s.campoLabel}>{label}</div>
      <div style={s.campoValor}>{valor}</div>
    </div>
  )
}

// Renderización dinámica de campos de contacto mutables
function CampoEditable({ label, valor, editando, onChange }) {
  return (
    <div style={s.campoWrap}>
      <div style={s.campoLabel}>{label}</div>
      {editando
        ? <input style={s.input} value={valor} onChange={e => onChange(e.target.value)} />
        : <div style={s.campoValor}>{valor}</div>
      }
    </div>
  )
}

// OBJETO DE ESTILOS: Mantiene la paleta verde institucional (#1A6B3A) definida para el Dashboard del Coordinador
const s = {
  panel:      { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelBody:  { padding: '24px' },
  encabezado: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 },
  nombre:     { fontSize: 18, fontWeight: 500, color: '#111', marginBottom: 4 },
  rol:        { fontSize: 12, color: '#666' },
  grid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' },
  campoWrap:  { display: 'flex', flexDirection: 'column', gap: 4 },
  campoLabel: { fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  campoValor: { fontSize: 13, color: '#111', padding: '6px 0', borderBottom: '0.5px solid #eee' },
  input:      { fontSize: 13, color: '#111', padding: '6px 8px', border: '0.5px solid #1A6B3A', borderRadius: 6, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#F4FAF6' },
  btnEditar:  { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', cursor: 'pointer', color: '#333' },
  btnGuardar: { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#1A6B3A', cursor: 'pointer', color: '#fff', fontWeight: 500 },
  pill:       { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  badge:      { ok: { background: '#EAF3DE', color: '#3B6D11' }, warn: { background: '#FAEEDA', color: '#854F0B' } },
  nota:       { fontSize: 12, color: '#666', background: '#F8F9FA', border: '0.5px solid #ddd', borderRadius: 8, padding: '10px 14px' },
}