//todos los datos de la vista importados desde la base de datos, actualmente se muestran datos estáticos para simular el modelo completo de procesamiento de datos en el frontend, pero se deben reemplazar por consultas reales a la base de datos para obtener la información actualizada del estudiante.
//REEMPLAZAR  TODOS LOS DATOSPOR CONSULTA DE BASE DE DATOS REAL
import { useState } from 'react'

// Función principal del submódulo: Renderiza y gestiona la hoja de datos personales e institucionales del estudiante.
export default function MiPerfil() {
  // Estados locales para la persistencia transitoria y mutabilidad de los datos de contacto en el cliente
  const [editando, setEditando]   = useState(false)
  const [telefono, setTelefono]   = useState('300 123 4567')
  const [direccion, setDireccion] = useState('Cra 7 # 40-53, Bogotá')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>

      {/* COMPONENTE CONTENEDOR: Panel principal de información del perfil */}
      <div style={s.panel}>
        <div style={s.panelBody}>

          {/* ENCABEZADO DE SECCIÓN: Muestra la identidad académica y el disparador del flujo de edición */}
          <div style={s.encabezado}>
            <div style={{ flex: 1 }}>
              {/* ENTRADA DE DATOS: Nombre del estudiante. REEMPLAZAR POR ATRIBUTO DE LA BD (Ej: usuario.nombre) */}
              <div style={s.nombre}>Carlos Ariza</div>
              {/* ENTRADA DE DATOS: Rol y programa académico. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <div style={s.rol}>Estudiante activo · Ingeniería de Sistemas</div>
              {/* ENTRADA DE DATOS: Período vigente. REEMPLAZAR POR ATRIBUTO DE LA BD */}
              <span style={{ ...s.pill, ...s.badge.ok, marginTop: 6, display: 'inline-block' }}>
                Matriculado 2025-1
              </span>
            </div>
            <div>
              {/* Manejo condicional de estados del formulario de edición */}
              {editando
                ? <button style={s.btnGuardar} onClick={() => setEditando(false)}>Guardar cambios</button> // REEMPLAZAR: Webhook o mutation para persistir cambios vía petición HTTP (PUT/PATCH).
                : <button style={s.btnEditar}  onClick={() => setEditando(true)}>Editar perfil</button>
              }
            </div>
          </div>

          {/* REJILLA DE INFORMACIÓN: Matriz de datos estáticos e inputs reactivos */}
          <div style={s.grid}>
            {/* ENTRADA DE DATOS: Campos institucionales estrictos de solo lectura (Procedentes de consultas a tablas maestras) */}
            <Campo label="Código estudiantil"     valor="20231234" />
            <Campo label="Documento"             valor="1020 456 789" />
            <Campo label="Correo institucional"  valor="c.ariza@udistrital.edu.co" />
            <Campo label="Programa"              valor="Ingeniería de Sistemas" />
            <Campo label="Facultad"              valor="Facultad de Ingeniería" />
            <Campo label="Semestre actual"       valor="6°" />

            {/* ENTRADA DE DATOS: Campos editables de contacto (Mutación local controlada) */}
            <CampoEditable
              label="Teléfono"
              valor={telefono}
              editando={editando}
              onChange={setTelefono}
            />
            <CampoEditable
              label="Dirección"
              valor={direccion}
              editando={editando}
              onChange={setDireccion}
            />
          </div>

        </div>
      </div>

      {/* COMPONENTE INFORMATIVO: Alerta de restricciones de mutabilidad del modelo corporativo */}
      <div style={s.nota}>
        ℹ Para actualizar datos como nombre o documento, comunícate con la oficina de registro.
      </div>

    </div>
  )
}

// Función de componente para la renderización de campos institucionales inmutables
function Campo({ label, valor }) {
  return (
    <div style={s.campoWrap}>
      <div style={s.campoLabel}>{label}</div>
      <div style={s.campoValor}>{valor}</div>
    </div>
  )
}

// Función de componente para la renderización dinámica de campos de contacto mutables
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

// OBJETO DE ESTILOS LOCALES: Especificaciones de maquetación y diseño del módulo de perfil
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