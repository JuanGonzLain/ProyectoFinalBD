// TODOS LOS DATOS DE LA VISTA SERÁN IMPORTADOS DESDE LA BASE DE DATOS. 
// Actualmente se muestran datos estáticos para simular el modelo de procesamiento de datos en el frontend.
// REEMPLAZAR TODOS LOS DATOS POR CONSULTA DE BASE DE DATOS REAL 
import { useState } from 'react'

export default function MiPerfil() {
  // datos estaticos para simular el modelo completo de procesamiento de datos en el frontend, pero se deben reemplazar por consultas reales a la base de datos para obtener la información actualizada del docente.
  const [editando, setEditando]   = useState(false)
  const [telefono, setTelefono]   = useState('315 987 6543')
  const [direccion, setDireccion] = useState('Calle 26 # 69B-50, Bogotá')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>

      {/* COMPONENTE CONTENEDOR: Panel principal de información del perfil */}
      <div style={s.panel}>
        <div style={s.panelBody}>

          {/* ENCABEZADO DE SECCIÓN: Muestra la identidad docente y el disparador del flujo de edición */}
          <div style={s.encabezado}>
            <div style={{ flex: 1 }}>
              {/* ENTRADA DE DATOS: Nombre del docente. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <div style={s.nombre}>María Pérez</div>
              {/* ENTRADA DE DATOS: Rol y adscripción de facultad. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <div style={s.rol}>Docente de Planta · Ingeniería de Sistemas</div>
              {/* ENTRADA DE DATOS: Estado del periodo vigente. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <span style={{ ...s.pill, ...s.badge.ok, marginTop: 6, display: 'inline-block' }}>
                Periodo Activo 2025-1
              </span>
            </div>
            <div>
              {/* Manejo condicional de estados del formulario de edición */}
              {editando
                ? <button style={s.btnGuardar} onClick={() => setEditando(false)}>Guardar cambios</button> // REEMPLAZAR: Mutation/Axios PUT para persistir cambios en BD
                : <button style={s.btnEditar}  onClick={() => setEditando(true)}>Editar perfil</button>
              }
            </div>
          </div>

          {/* REJILLA DE INFORMACIÓN: Matriz de datos de escalafón e inputs reactivos */}
          <div style={s.grid}>
            {/* ENTRADA DE DATOS: Campos contractuales e institucionales de solo lectura */}
            <Campo label="Código Docente"         valor="D2015048" />
            <Campo label="Documento de Identidad" valor="52.345.678" />
            <Campo label="Correo Institucional"   valor="m.perez@udistrital.edu.co" />
            <Campo label="Facultad"               valor="Facultad de Ingeniería" />
            <Campo label="Categoría Escalafón"    valor="Asociado" />
            <Campo label="Tipo de Vinculación"    valor="Tiempo Completo" />

            {/* ENTRADA DE DATOS: Campos editables de contacto (Mutación local controlada) */}
            <CampoEditable
              label="Teléfono de Contacto"
              valor={telefono}
              editando={editando}
              onChange={setTelefono}
            />
            <CampoEditable
              label="Dirección de Domicilio"
              valor={direccion}
              editando={editando}
              onChange={setDireccion}
            />
          </div>

        </div>
      </div>

      {/* COMPONENTE INFORMATIVO: Alerta de restricciones adaptada al esquema de color docente */}
      <div style={s.nota}>
        ℹ Para realizar modificaciones en datos de escalafón, vinculación académica o documento de identidad, radique una solicitud
      </div>

    </div>
  )
}

// Componente auxiliar para campos fijos
function Campo({ label, valor }) {
  return (
    <div style={s.campoWrap}>
      <div style={s.campoLabel}>{label}</div>
      <div style={s.campoValor}>{valor}</div>
    </div>
  )
}

// Componente auxiliar para campos editables
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

// OBJETO DE ESTILOS LOCALES: Cambiado al esquema Emerald Green (#12947C) para Docentes
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
  // Estilos verdes para inputs y botones del rol Docente
  input:      { fontSize: 13, color: '#111', padding: '6px 8px', border: '0.5px solid #12947C', borderRadius: 6, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#EAF5F3' },
  btnEditar:  { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', cursor: 'pointer', color: '#333' },
  btnGuardar: { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#12947C', cursor: 'pointer', color: '#fff', fontWeight: 500 },
  pill:       { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  badge:      { ok: { background: '#EAF3DE', color: '#3B6D11' }, warn: { background: '#FAEEDA', color: '#854F0B' } },
  nota:       { fontSize: 12, color: '#444', background: '#EAF5F3', border: '0.5px solid #A1D6CC', borderRadius: 8, padding: '10px 14px' },
}