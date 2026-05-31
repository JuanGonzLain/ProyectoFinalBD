import { useState } from 'react'

// ENTRADA DE DATOS: Registros históricos estáticos para demostración y simulación del modelo.
// REEMPLAZAR POR CONSULTA DE BASE DE DATOS REAL vista_historial_academico_estudiante
const HISTORIAL = [
  {
    semestre: '2022-1', materias: [
      { nombre: 'Cálculo integral',         creditos: 4, nota: 3.8, estado: 'ok' },
      { nombre: 'Programación I',           creditos: 3, nota: 4.2, estado: 'ok' },
      { nombre: 'Álgebra lineal',           creditos: 3, nota: 2.9, estado: 'warn' },
      { nombre: 'Inglés I',                 creditos: 2, nota: 4.0, estado: 'ok' },
    ]
  },
  {
    semestre: '2022-2', materias: [
      { nombre: 'Cálculo diferencial',      creditos: 4, nota: 3.5, estado: 'ok' },
      { nombre: 'Programación II',          creditos: 3, nota: 4.5, estado: 'ok' },
      { nombre: 'Estadística',              creditos: 3, nota: 3.1, estado: 'ok' },
      { nombre: 'Inglés II',                creditos: 2, nota: 3.9, estado: 'ok' },
    ]
  },
  {
    semestre: '2023-1', materias: [
      { nombre: 'Estructuras de datos',     creditos: 4, nota: 4.3, estado: 'ok' },
      { nombre: 'Bases de datos I',         creditos: 3, nota: 4.1, estado: 'ok' },
      { nombre: 'Sistemas operativos',      creditos: 3, nota: 3.7, estado: 'ok' },
      { nombre: 'Matemáticas discretas',    creditos: 3, nota: 2.5, estado: 'err' },
    ]
  },
  {
    semestre: '2023-2', materias: [
      { nombre: 'Redes de computadores',    creditos: 3, nota: 3.8, estado: 'ok' },
      { nombre: 'Ingeniería de software I', creditos: 3, nota: 4.4, estado: 'ok' },
      { nombre: 'Matemáticas discretas',    creditos: 3, nota: 3.2, estado: 'ok' },
      { nombre: 'Electiva I',               creditos: 2, nota: 4.0, estado: 'ok' },
    ]
  },
  {
    semestre: '2024-1', materias: [
      { nombre: 'Ingeniería de software II',creditos: 3, nota: 4.2, estado: 'ok' },
      { nombre: 'Bases de datos II',        creditos: 3, nota: 3.9, estado: 'ok' },
      { font: 'Arquitectura de software',   creditos: 3, nota: 4.1, estado: 'ok' },
      { nombre: 'Electiva II',              creditos: 2, nota: 3.7, estado: 'ok' },
    ]
  },
]

// Diccionario global de estados para homologación visual de alertas y badges académicos
const BADGE = {
  ok:   { background: '#EAF3DE', color: '#3B6D11' },
  warn: { background: '#FAEEDA', color: '#854F0B' },
  err:  { background: '#FCEBEB', color: '#A32D2D' },
}

// Función principal del submódulo: Renderiza el reporte analítico del recorrido académico del estudiante.
export default function HistorialAcademico() {
  // Estado local para persistir cuál bloque del acordeón semestral se encuentra desplegado
  const [semestreAbierto, setSemestreAbierto] = useState('2024-1')

  // LÓGICA DE PROCESAMIENTO: Cálculos analíticos basados en el arreglo unificado de asignaturas cursadas, ENTRADA DE DATOS DESDE LA BASE DE DATOS, seccion usada mas para backend pero se deja aqui para simular el modelo completo de procesamiento de datos en el frontend
  const totalCreditos = HISTORIAL.flatMap(s => s.materias).reduce((acc, m) => acc + m.creditos, 0)
  
  // Cálculo analítico del promedio ponderado (Suma de Notas * Créditos / Total de Créditos) funcion a implementar en el backend pero se deja aqui para simular el modelo completo de procesamiento de datos en el frontend
  const promedio = (
    HISTORIAL.flatMap(s => s.materias).reduce((acc, m) => acc + m.nota * m.creditos, 0) / totalCreditos
  ).toFixed(2)
  
  // Contador analítico para alertas de persistencia o pérdida de asignaturas (notas inferiores a 3.0) usar la vista vista_rendimiento_por_asignatura # de reprobadas por estudiante, seccion usada mas para backend pero se deja aqui para simular el modelo completo de procesamiento de datos en el frontend
  const reprobadas = HISTORIAL.flatMap(s => s.materias).filter(m => m.nota < 3.0).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* BLOQUE DE ESTADÍSTICAS GENERALES: Tarjetas analíticas de rendimiento histórico acumulado  FUNCIONES A IMPLEMENTAR EN EL BACKEND */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Promedio acumulado</div>
          <div style={s.statVal}>{promedio}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Créditos cursados</div>
          <div style={s.statVal}>{totalCreditos}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Semestres completados</div>
          <div style={s.statVal}>{HISTORIAL.length}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Materias reprobadas</div>
          <div style={s.statVal}>{reprobadas}</div>
          {reprobadas > 0 && <span style={{ ...s.pill, ...BADGE.err, marginTop: 4, display: 'inline-block' }}>Atención</span>}
        </div>
      </div>

      {/* COMPONENTE DE CONTROL CONTENEDOR: Acordeón dinámico ordenado cronológicamente de forma inversa */}
      <div style={s.panel}>
        <div style={s.panelHead}>
          <span style={s.panelTitle}>Materias por semestre</span>
          <span style={{ fontSize: 11, color: '#999' }}>{HISTORIAL.length} semestres</span>
        </div>
        <div style={{ padding: '8px 0' }}>
          {HISTORIAL.slice().reverse().map(sem => {
            const abierto = semestreAbierto === sem.semestre
            
            // Cálculo del promedio ponderado específico para el ciclo académico evaluado REEMPLAZAR POR CONSULTA A LA BASE DE DATOS CON CÁLCULO PREVIO EN EL BACKEND
            const promSem = (
              sem.materias.reduce((acc, m) => acc + m.nota * m.creditos, 0) /
              sem.materias.reduce((acc, m) => acc + m.creditos, 0)
            ).toFixed(2)

            return (
              <div key={sem.semestre} style={s.acordeonItem}>
                
                {/* Cabecera del ítem: Muestra metadatos del ciclo e interactúa con el estado de apertura */}
                <div
                  style={{ ...s.acordeonHead, ...(abierto ? s.acordeonHeadActive : {}) }}
                  onClick={() => setSemestreAbierto(abierto ? null : sem.semestre)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={s.acordeonArrow}>{abierto ? '▾' : '▸'}</span>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>Semestre {sem.semestre}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 12, color: '#666' }}>{sem.materias.length} materias</span>
                    <span style={{ fontSize: 12, color: '#666' }}>Promedio: <strong>{promSem}</strong></span>
                  </div>
                </div>

                {/* Contenido desplegable: Grid/Tabla detallada de las asignaturas vinculadas al período */}
                {abierto && (
                  <div style={{ padding: '0 16px 12px' }}>
                    <table style={s.table}>
                      <thead>
                        <tr>
                          <th style={s.th}>Asignatura</th>
                          <th style={s.th}>Créditos</th>
                          <th style={s.th}>Nota</th>
                          <th style={s.th}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.materias.map((m, i) => (
                          <tr key={i}>
                            <td style={s.td}>{m.nombre}</td>
                            <td style={s.td}>{m.creditos}</td>
                            <td style={s.td}><strong>{m.nota}</strong></td>
                            <td style={s.td}>
                              <span style={{ ...s.pill, ...BADGE[m.estado] }}>
                                {m.estado === 'ok' ? 'Aprobada' : m.estado === 'warn' ? 'Habilitó' : 'Reprobada'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// OBJETO DE ESTILOS LOCALES: Mapeo estricto del lenguaje de diseño del Dashboard Estudiantil
const s = {
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 },
  statCard: { background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: '14px 16px' },
  statLabel:{ fontSize: 11, color: '#666', marginBottom: 6 },
  statVal:  { fontSize: 22, fontWeight: 500, color: '#111' },
  pill:     { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  panel:    { background: '#fff', border: '0.5px solid #eee', borderRadius: 12 },
  panelHead:{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle:{ fontSize: 13, fontWeight: 500, color: '#111' },
  acordeonItem: { borderBottom: '0.5px solid #eee' },
  acordeonHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' },
  acordeonHeadActive: { background: '#F0F7FF' },
  acordeonArrow: { fontSize: 12, color: '#666' },
  table:    { width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 8 },
  th:       { textAlign: 'left', color: '#666', fontWeight: 500, padding: '6px 8px', borderBottom: '0.5px solid #eee', fontSize: 11 },
  td:       { padding: '8px 8px', borderBottom: '0.5px solid #eee', color: '#111', verticalAlign: 'middle' },
}