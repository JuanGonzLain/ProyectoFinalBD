// Dashboards/Docente/MisGrupos.jsx
import { useState } from 'react'

/**
 * DOCUMENTACIÓN DE INTEGRACIÓN DE BASE DE DATOS:
 * * Este módulo consume los datos analíticos de la vista: 'fac_ingenieria.vw_rend_x_asig'
 * * Mapeo de campos esperados desde la consulta SQL para reemplazar el estado estático:
 * - g.nombre      <-- vw_rend_x_asig.nombre_asignatura
 * - g.codigo      <-- vw_rend_x_asig.cod_asignatura
 * - g.grupo       <-- [Proviene de la tabla relacional intermedia de Horarios/Grupos]
 * - g.estudiantes <-- vw_rend_x_asig.total_registros
 * - g.promedio    <-- vw_rend_x_asig.promedio_notas
 * - g.aprobados   <-- vw_rend_x_asig.total_aprobados
 * - g.reprobados  <-- vw_rend_x_asig.total_reprobados
 * * NOTA DE OPTIMIZACIÓN: Los campos 'cupo', 'horario', 'salon' y los booleanos de 'cortes' 
 * pertenecen a las tablas de control operacional de la carga académica del semestre actual, 
 * por lo que el Backend deberá retornar un JOIN unificado entre esta vista analítica 
 * y la tabla de asignaciones vigentes del docente autenticado.
 */

// ENTRADA DE DATOS SIMULADA - REEMPLAZAR POR DATOS REALES DESDE LA BASE DE DATOS
const GRUPOS = [
  {
    nombre: 'Bases de datos I',
    codigo: 'BD-101',
    grupo: 'G01',
    estudiantes: 28,
    cupo: 30,
    promedio: 3.8,
    aprobados: 24,
    reprobados: 4,
    enRiesgo: 3,
    horario: 'Lun - Mié 08:00 - 10:00',
    salon: 'Aula 305',
    corte1: true,
    corte2: true,
    corte3: false,
  },
  {
    nombre: 'Bases de datos II',
    codigo: 'BD-201',
    grupo: 'G02',
    estudiantes: 22,
    cupo: 25,
    promedio: 4.1,
    aprobados: 20,
    reprobados: 2,
    enRiesgo: 1,
    horario: 'Mar - Jue 10:00 - 12:00',
    salon: 'Aula 210',
    corte1: true,
    corte2: false,
    corte3: false,
  },
  {
    nombre: 'Ingeniería de software',
    codigo: 'IS-301',
    grupo: 'G01',
    estudiantes: 30,
    cupo: 30,
    promedio: 3.5,
    aprobados: 23,
    reprobados: 7,
    enRiesgo: 5,
    horario: 'Vie 14:00 - 18:00',
    salon: 'Lab 102',
    corte1: true,
    corte2: false,
    corte3: false,
  },
]

const BADGE = {
  ok:   { background: '#EAF3DE', color: '#3B6D11' },
  warn: { background: '#FAEEDA', color: '#854F0B' },
  err:  { background: '#FCEBEB', color: '#A32D2D' },
}

function estadoPromedio(p) { //función de evaluación de estado académico del grupo basada en el promedio general, 
// REEMPLAZAR POR LÓGICA DE NEGOCIO DEFINIDA EN EL BACKEND O POR CONSULTA DIRECTA A LA BASE DE DATOS

  if (p >= 4.0) return 'ok'
  if (p >= 3.5) return 'warn'
  return 'err'
}

function CorteIndicador({ label, registrado }) { //función de componente auxiliar para indicar el estado de registro de notas por corte, 
// REEMPLAZAR POR CONSULTA A LA BASE DE DATOS PARA VERIFICAR EL ESTADO REAL DE REGISTRO DE NOTAS EN CADA CORTE ACADÉMICO
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 11,
      color: registrado ? '#3B6D11' : '#999',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: registrado ? '#1D9E75' : '#ddd',
      }} />
      {label}
    </div>
  )
}

export default function MisGrupos() { //función principal del submódulo: Renderiza el listado de grupos asignados al docente autenticado con sus métricas analíticas de rendimiento académico y estado operativo de registro de notas.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {GRUPOS.map((g, i) => (
        <div key={i} style={s.card}>

          {/* Cabecera: Despliega la información de identificación y promedios globales de la vista */}
          <div style={s.cardHead}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={s.iconBox}>
                <i className="ti ti-books" style={{ fontSize: 20, color: '#12947C' }} />
              </div>
              <div>
                <div style={s.nombre}>{g.nombre}</div>
                <div style={s.meta}>Código {g.codigo} · Grupo {g.grupo}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ ...s.pill, ...BADGE[estadoPromedio(g.promedio)] }}>
                Promedio {g.promedio}
              </span>
              <span style={{ ...s.pill, g_cupo: true, background: g.estudiantes >= g.cupo ? '#FCEBEB' : '#E6F1FB', color: g.estudiantes >= g.cupo ? '#A32D2D' : '#185FA5' }}>
                {g.estudiantes}/{g.cupo} cupos
              </span>
            </div>
          </div>

          {/* Cuerpo del Componente */}
          <div style={s.cardBody}>

            {/* Info básica de la asignación */}
            <div style={s.infoCol}>
              <div style={s.infoItem}>
                <i className="ti ti-clock" style={s.infoIcon} />
                <span>{g.horario}</span>
              </div>
              <div style={s.infoItem}>
                <i className="ti ti-door" style={s.infoIcon} />
                <span>{g.salon}</span>
              </div>
              <div style={s.infoItem}>
                <i className="ti ti-users" style={s.infoIcon} />
                <span>{g.estudiantes} estudiantes matriculados</span>
              </div>
            </div>

            {/* Barras Analíticas: Representación visual directa de las métricas agregadas de la vista SQL */}
            <div style={s.barrasCol}>
              <div style={s.barRow}>
                <span>Aprobados</span>
                <span>{g.aprobados}/{g.estudiantes}</span>
              </div>
              <div style={s.barWrap}>
                <div style={{ ...s.barFill, width: `${(g.aprobados / g.estudiantes) * 100}%`, background: '#1D9E75' }} />
              </div>
              
              <div style={{ ...s.barRow, marginTop: 8 }}>
                <span>Reprobados</span>
                <span>{g.reprobados}/{g.estudiantes}</span>
              </div>
              <div style={s.barWrap}>
                <div style={{ ...s.barFill, width: `${(g.reprobados / g.estudiantes) * 100}%`, background: '#E24B4A' }} />
              </div>
              
              <div style={{ ...s.barRow, marginTop: 8 }}>
                <span>En riesgo</span>
                <span>{g.enRiesgo}/{g.estudiantes}</span>
              </div>
              <div style={s.barWrap}>
                <div style={{ ...s.barFill, width: `${(g.enRiesgo / g.estudiantes) * 100}%`, background: '#BA7517' }} />
              </div>
            </div>

            {/* Estado del flujo operacional de notas */}
            <div style={s.cortesCol}>
              <div style={s.cortesTitle}>Estado de cortes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <CorteIndicador label="Corte 1" registrado={g.corte1} />
                <CorteIndicador label="Corte 2" registrado={g.corte2} />
                <CorteIndicador label="Corte 3" registrado={g.corte3} />
              </div>
            </div>

          </div>

          {/* Footer Interactivo  salto directo a las subvistas registro de notas y estudiantes*/}
          <div style={s.cardFooter}>
            <button style={s.btnSecundario}>Ver estudiantes</button>
            <button style={s.btnPrimario}>Registrar notas</button>
          </div>

        </div>
      ))}
    </div>
  )
}

const s = {
  card:         { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, overflow: 'hidden' },
  cardHead:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '0.5px solid #f0f0f0' },
  iconBox:      { width: 40, height: 40, borderRadius: 10, background: '#E8F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nombre:       { fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 3 },
  meta:         { fontSize: 11, color: '#999' },
  pill:         { display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  cardBody:     { display: 'grid', gridTemplateColumns: '1fr 1.5fr 0.8fr', gap: 24, padding: '16px 20px' },
  infoCol:      { display: 'flex', flexDirection: 'column', gap: 10 },
  infoItem:     { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#444' },
  infoIcon:     { fontSize: 15, color: '#999', flexShrink: 0 },
  barrasCol:    { display: 'flex', flexDirection: 'column' },
  barRow:       { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', marginBottom: 4 },
  barWrap:      { background: '#f4f4f4', borderRadius: 4, height: 6, overflow: 'hidden' },
  barFill:      { height: 6, borderRadius: 4 },
  cortesCol:    { display: 'flex', flexDirection: 'column' },
  cortesTitle:  { fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  cardFooter:   { display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 20px', borderTop: '0.5px solid #f0f0f0', background: '#fafafa' },
  btnPrimario:  { fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#12947C', color: '#fff', cursor: 'pointer', fontWeight: 500 },
  btnSecundario:{ fontSize: 12, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', color: '#333', cursor: 'pointer' },
}