import { useState, useCallback } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Serif+4:wght@300;400;600&family=DM+Sans:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const STEPS = [
  { id: 1, label: "Datos del Docente",  icon: "👤", color: "#1d4ed8" },
  { id: 2, label: "Contexto Académico", icon: "🏫", color: "#0369a1" },
  { id: 3, label: "Currícula NEM",      icon: "📚", color: "#0f766e" },
  { id: 4, label: "Estrategia",         icon: "🎯", color: "#7c3aed" },
  { id: 5, label: "Plus",               icon: "✨", color: "#b45309" },
];

const CAMPOS = [
  { value: "Lenguajes", desc: "Comunicación, lectura y expresión creativa" },
  { value: "Saberes y Pensamiento Científico", desc: "Matemáticas, ciencias, tecnología, STEAM" },
  { value: "Ética, Naturaleza y Sociedades", desc: "Historia, geografía, formación cívica" },
  { value: "De lo Humano y lo Comunitario", desc: "Arte, cultura física, socioemocional" },
];

const METODOLOGIAS = [
  { value: "Proyecto de Aula (NEM)", icon: "🏗️" },
  { value: "Aprendizaje Basado en Problemas (ABP)", icon: "🔍" },
  { value: "Aprendizaje Basado en Indagación (STEAM)", icon: "🔬" },
  { value: "Aula Invertida", icon: "🔄" },
  { value: "Aprendizaje Basado en el Servicio", icon: "🤝" },
  { value: "Aprendizaje Cooperativo", icon: "👥" },
];

const NIVELES = ["Preescolar", "Primaria", "Secundaria", "Media Superior", "Superior"];
const GRADOS  = ["1°", "2°", "3°", "4°", "5°", "6°"];

const REQUIRED = {
  1: ["docente", "escuela", "municipio", "estado"],
  2: ["nivel", "grado", "disciplina", "problematica"],
  3: ["campo", "eje", "contenido", "pda"],
  4: ["metodologia", "materiales"],
  5: [],
};

const LABELS = {
  docente:"nombre del docente", escuela:"nombre de la escuela",
  municipio:"municipio", estado:"estado", nivel:"nivel educativo",
  grado:"grado", disciplina:"disciplina", problematica:"problemática",
  campo:"campo formativo", eje:"eje articulador", contenido:"contenido",
  pda:"PDA", metodologia:"metodología", materiales:"materiales",
};

const init = {
  docente:"Dr. Francisco De Jesús Luna Benítez", escuela:"", cct:"", municipio:"", estado:"",
  nivel:"", grado:"", disciplina:"", grupoAlumnos:"", problematica:"",
  campo:"", eje:"", contenido:"", pda:"",
  metodologia:"", sesiones:"3", duracion:"50", materiales:"",
  gamificacion:false, reciclaje:false, notasExtra:"",
};

// ── Shared input styles ────────────────────────────────────────────────────
const IS = {
  base: {
    width:"100%", padding:"0.68rem 0.9rem", borderRadius:"0.6rem",
    fontSize:"0.875rem", color:"#1e293b", outline:"none",
    transition:"all 0.18s", boxSizing:"border-box",
    fontFamily:"'DM Sans', sans-serif",
  },
};

function useFocus() {
  const [f, setF] = useState(false);
  return [f, { onFocus:()=>setF(true), onBlur:()=>setF(false) }];
}

function Input({ value, onChange, placeholder, type="text", error }) {
  const [focused, fx] = useFocus();
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...fx}
    style={{...IS.base, border:`1.5px solid ${error?"#fca5a5":focused?"#3b82f6":"#e2e8f0"}`,
      background:focused?"#f8fbff":"#f8fafc", boxShadow:focused?"0 0 0 3px #dbeafe":"none"}} />;
}

function Textarea({ value, onChange, placeholder, rows=3, error }) {
  const [focused, fx] = useFocus();
  return <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} {...fx}
    style={{...IS.base, resize:"vertical", lineHeight:1.65,
      border:`1.5px solid ${error?"#fca5a5":focused?"#3b82f6":"#e2e8f0"}`,
      background:focused?"#f8fbff":"#f8fafc", boxShadow:focused?"0 0 0 3px #dbeafe":"none"}} />;
}

function Select({ value, onChange, options, error }) {
  const [focused, fx] = useFocus();
  return (
    <select value={value} onChange={onChange} {...fx}
      style={{...IS.base, border:`1.5px solid ${error?"#fca5a5":focused?"#3b82f6":"#e2e8f0"}`,
        background:focused?"#f8fbff":"#f8fafc", boxShadow:focused?"0 0 0 3px #dbeafe":"none"}}>
      <option value="">— Seleccionar —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Field({ label, hint, required, error, children }) {
  return (
    <div style={{marginBottom:"1rem"}}>
      <label style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",
        fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",
        color:"#334155",marginBottom:"0.38rem",fontFamily:"'DM Sans',sans-serif"}}>
        <span>{label}{required&&<span style={{color:"#dc2626",marginLeft:3}}>*</span>}</span>
        {hint&&<span style={{fontSize:"0.64rem",color:"#64748b",fontWeight:400,letterSpacing:"normal",textTransform:"none"}}>{hint}</span>}
      </label>
      {children}
      {error&&<p style={{color:"#dc2626",fontSize:"0.7rem",marginTop:"0.28rem"}}>⚠ {error}</p>}
    </div>
  );
}

// ── Steps ──────────────────────────────────────────────────────────────────
function Step1({form,upd,errors}) {
  const u = k => e => upd(k, e.target.value);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
      <div style={{gridColumn:"1/-1"}}>
        <Field label="Nombre completo del docente" required error={errors.docente}>
          <Input value={form.docente} onChange={u("docente")} placeholder="Dr. Francisco De Jesús Luna Benítez" error={errors.docente}/>
        </Field>
      </div>
      <Field label="Nombre de la escuela" required error={errors.escuela}>
        <Input value={form.escuela} onChange={u("escuela")} placeholder="Ej. Secundaria General No. 1" error={errors.escuela}/>
      </Field>
      <Field label="CCT" hint="Clave del centro">
        <Input value={form.cct} onChange={u("cct")} placeholder="Ej. 29DST0001Z"/>
      </Field>
      <Field label="Municipio" required error={errors.municipio}>
        <Input value={form.municipio} onChange={u("municipio")} placeholder="Ej. Tlaxcala de Xicohténcatl" error={errors.municipio}/>
      </Field>
      <Field label="Estado" required error={errors.estado}>
        <Input value={form.estado} onChange={u("estado")} placeholder="Ej. Tlaxcala" error={errors.estado}/>
      </Field>
    </div>
  );
}

function Step2({form,upd,errors}) {
  const u = k => e => upd(k, e.target.value);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
      <Field label="Nivel educativo" required error={errors.nivel}>
        <Select value={form.nivel} onChange={u("nivel")} options={NIVELES} error={errors.nivel}/>
      </Field>
      <Field label="Grado" required error={errors.grado}>
        <Select value={form.grado} onChange={u("grado")} options={GRADOS} error={errors.grado}/>
      </Field>
      <Field label="Disciplina / Asignatura" required error={errors.disciplina}>
        <Input value={form.disciplina} onChange={u("disciplina")} placeholder="Ej. Matemáticas, Informática, Español…" error={errors.disciplina}/>
      </Field>
      <Field label="Alumnos en el grupo" hint="Aprox.">
        <Input value={form.grupoAlumnos} onChange={u("grupoAlumnos")} type="number" placeholder="30"/>
      </Field>
      <div style={{gridColumn:"1/-1"}}>
        <Field label="Problemática o situación del contexto" required hint="Situación real del entorno" error={errors.problematica}>
          <Textarea value={form.problematica} onChange={u("problematica")} rows={4} error={errors.problematica}
            placeholder="Describe la problemática comunitaria, escolar o social que da origen a esta planeación. Ej: Los estudiantes no identifican fuentes confiables de información en internet…"/>
        </Field>
      </div>
    </div>
  );
}

function Step3({form,upd,errors}) {
  const u = k => e => upd(k, e.target.value);
  return (
    <div>
      <Field label="Campo formativo NEM" required error={errors.campo}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"0.2rem"}}>
          {CAMPOS.map(c => (
            <button key={c.value} type="button" onClick={() => upd("campo", c.value)}
              style={{padding:"0.8rem",borderRadius:"0.7rem",textAlign:"left",cursor:"pointer",
                border:`2px solid ${form.campo===c.value?"#0f766e":"#e2e8f0"}`,
                background:form.campo===c.value?"#f0fdfa":"#f8fafc",transition:"all 0.15s"}}>
              <p style={{fontSize:"0.76rem",fontWeight:700,color:form.campo===c.value?"#0f766e":"#334155",marginBottom:"0.18rem",fontFamily:"'DM Sans',sans-serif"}}>{c.value}</p>
              <p style={{fontSize:"0.67rem",color:"#64748b",fontFamily:"'DM Sans',sans-serif",lineHeight:1.35}}>{c.desc}</p>
            </button>
          ))}
        </div>
        {errors.campo && <p style={{color:"#dc2626",fontSize:"0.7rem",marginTop:"0.3rem"}}>⚠ {errors.campo}</p>}
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
        <Field label="Eje articulador" required error={errors.eje}>
          <Input value={form.eje} onChange={u("eje")} placeholder="Ej. Pensamiento Crítico, Inclusión…" error={errors.eje}/>
        </Field>
        <Field label="Contenido temático" required error={errors.contenido}>
          <Input value={form.contenido} onChange={u("contenido")} placeholder="Ej. Fracciones, Ecosistemas…" error={errors.contenido}/>
        </Field>
      </div>
      <Field label="PDA — Proceso de Desarrollo del Aprendizaje" required hint="Del libro de planes y programas SEP" error={errors.pda}>
        <Textarea value={form.pda} onChange={u("pda")} rows={3} error={errors.pda}
          placeholder="Ej. Reconoce y aplica fracciones en situaciones de la vida cotidiana relacionando el todo con sus partes…"/>
      </Field>
    </div>
  );
}

function Step4({form,upd,errors}) {
  const u = k => e => upd(k, e.target.value);
  return (
    <div>
      <Field label="Metodología didáctica" required error={errors.metodologia}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.6rem",marginBottom:"0.2rem"}}>
          {METODOLOGIAS.map(m => (
            <button key={m.value} type="button" onClick={() => upd("metodologia", m.value)}
              style={{padding:"0.75rem 0.5rem",borderRadius:"0.7rem",textAlign:"center",cursor:"pointer",
                border:`2px solid ${form.metodologia===m.value?"#7c3aed":"#e2e8f0"}`,
                background:form.metodologia===m.value?"#f5f3ff":"#f8fafc",transition:"all 0.15s"}}>
              <span style={{fontSize:"1.3rem",display:"block",marginBottom:"0.28rem"}}>{m.icon}</span>
              <p style={{fontSize:"0.66rem",fontWeight:700,color:form.metodologia===m.value?"#7c3aed":"#475569",fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{m.value}</p>
            </button>
          ))}
        </div>
        {errors.metodologia && <p style={{color:"#dc2626",fontSize:"0.7rem",marginTop:"0.3rem"}}>⚠ {errors.metodologia}</p>}
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
        <Field label="Número de sesiones">
          <Input value={form.sesiones} onChange={u("sesiones")} type="number" placeholder="3"/>
        </Field>
        <Field label="Duración por sesión (min)">
          <Input value={form.duracion} onChange={u("duracion")} type="number" placeholder="50"/>
        </Field>
      </div>
      <Field label="Materiales y recursos didácticos" required hint="Listas, tecnología, libros SEP…" error={errors.materiales}>
        <Textarea value={form.materiales} onChange={u("materiales")} rows={3} error={errors.materiales}
          placeholder="Ej. Libros de texto SEP, dispositivos con internet, cartulinas, marcadores, tijeras, videos de YouTube, formularios de Google…"/>
      </Field>
    </div>
  );
}

function Step5({form,upd}) {
  const u = k => e => upd(k, e.target.value);
  const opts = [
    {key:"gamificacion",icon:"🎮",title:"Gamificación educativa",
     desc:"Sistema de puntos, insignias y retos para motivar la participación activa del alumnado.",
     on:"#1d4ed8",bg:"#eff6ff",br:"#93c5fd",tbg:"#3b82f6"},
    {key:"reciclaje",icon:"♻️",title:"Sustentabilidad y reciclaje",
     desc:"Vincula la actividad con educación ambiental, materiales reciclados y cuidado del planeta.",
     on:"#065f46",bg:"#f0fdf4",br:"#86efac",tbg:"#22c55e"},
  ];
  return (
    <div>
      <p style={{fontSize:"0.8rem",color:"#64748b",marginBottom:"1.2rem",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>
        Activa las opciones que desees. La IA generará secciones adicionales y detalladas para cada una.
      </p>
      <div style={{display:"flex",flexDirection:"column",gap:"0.85rem",marginBottom:"1.4rem"}}>
        {opts.map(o => (
          <button key={o.key} type="button" onClick={() => upd(o.key, !form[o.key])}
            style={{display:"flex",alignItems:"flex-start",gap:"1rem",padding:"1rem 1.1rem",
              borderRadius:"0.9rem",textAlign:"left",cursor:"pointer",width:"100%",
              border:`2px solid ${form[o.key]?o.br:"#e2e8f0"}`,
              background:form[o.key]?o.bg:"#f8fafc",transition:"all 0.18s"}}>
            <span style={{fontSize:"1.7rem",flexShrink:0}}>{o.icon}</span>
            <div style={{flex:1}}>
              <p style={{fontWeight:700,fontSize:"0.86rem",color:form[o.key]?o.on:"#334155",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.18rem"}}>{o.title}</p>
              <p style={{fontSize:"0.74rem",color:"#64748b",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{o.desc}</p>
            </div>
            <div style={{width:"2.1rem",height:"1.2rem",borderRadius:"9999px",flexShrink:0,marginTop:"0.2rem",
              background:form[o.key]?o.tbg:"#d1d5db",transition:"background 0.2s",position:"relative"}}>
              <span style={{position:"absolute",top:"0.12rem",width:"0.96rem",height:"0.96rem",borderRadius:"9999px",
                background:"white",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",transition:"left 0.2s",
                left:form[o.key]?"1rem":"0.12rem"}}/>
            </div>
          </button>
        ))}
      </div>
      <Field label="Notas adicionales / Adecuaciones curriculares" hint="Opcional">
        <Textarea value={form.notasExtra} onChange={u("notasExtra")} rows={4}
          placeholder="Alumnos con NEE, adecuaciones de acceso, atención a la diversidad, contexto específico del grupo…"/>
      </Field>
    </div>
  );
}

// ── Validation ─────────────────────────────────────────────────────────────
function validate(step, form) {
  const err = {};
  (REQUIRED[step]||[]).forEach(k => {
    if (!form[k]||!form[k].toString().trim()) err[k] = `El campo "${LABELS[k]}" es obligatorio.`;
  });
  return err;
}

// ── Prompt ─────────────────────────────────────────────────────────────────
function buildPrompt(f) {
  return `
Eres un especialista de alto nivel en diseño curricular de la Nueva Escuela Mexicana (NEM) de México, con vasta experiencia en pedagogía crítica, didáctica y evaluación formativa. 

TAREA: Genera una PLANEACIÓN DIDÁCTICA COMPLETA, EXTENSA Y DE MÁXIMO DETALLE. NO resumas. Cada sección debe estar plenamente desarrollada con ejemplos concretos, instrucciones directamente utilizables, preguntas detonadoras textuales y orientaciones pedagógicas profesionales.

═══════════════════════════════════════
DATOS DE LA PLANEACIÓN
═══════════════════════════════════════
Docente       : ${f.docente}
Escuela       : ${f.escuela}${f.cct?" | CCT: "+f.cct:""}
Ubicación     : ${f.municipio}, ${f.estado}
Nivel/Grado   : ${f.nivel} — ${f.grado} grado
Disciplina    : ${f.disciplina}
Alumnos       : ${f.grupoAlumnos||"No especificado"}
Campo         : ${f.campo}
Eje           : ${f.eje}
Contenido     : ${f.contenido}
PDA           : ${f.pda}
Metodología   : ${f.metodologia}
Sesiones      : ${f.sesiones} × ${f.duracion} minutos
Materiales    : ${f.materiales}
Problemática  : ${f.problematica}
Gamificación  : ${f.gamificacion?"SÍ":"NO"}
Sustentabilidad: ${f.reciclaje?"SÍ":"NO"}
Notas extra   : ${f.notasExtra||"Ninguna"}

═══════════════════════════════════════
ESTRUCTURA OBLIGATORIA CON MÁXIMO DETALLE
═══════════════════════════════════════

SECCIÓN 1 — ENCABEZADO INSTITUCIONAL
Tabla completa con todos los datos anteriores (docente, escuela, CCT, ubicación, nivel, grado, disciplina, campo, eje, contenido, PDA, metodología, sesiones, duración, ciclo escolar 2024-2025).

SECCIÓN 2 — PROPÓSITO GENERAL
Mínimo 3 párrafos desarrollados sobre el propósito pedagógico desde el enfoque humanista y comunitario de la NEM. Explica: (a) cómo esta planeación atiende la problemática identificada, (b) qué habilidades, valores y conocimientos desarrollará el estudiantado, (c) vinculación con la comunidad y el entorno.

SECCIÓN 3 — APRENDIZAJES ESPERADOS
Mínimo 7 aprendizajes esperados concretos y medibles, clasificados en: 
• Cognitivos (saber): mínimo 3
• Procedimentales (saber hacer): mínimo 2  
• Actitudinales (saber ser): mínimo 2

SECCIÓN 4 — SECUENCIA DIDÁCTICA DETALLADA
Para CADA una de las ${f.sesiones} sesiones, desarrolla completa y exhaustivamente:

╔═ SESIÓN [N] DE ${f.sesiones} — ${f.duracion} MINUTOS ═╗

▸ MOMENTO 1: INICIO (aprox. 15 min)
  - Actividad de apertura con descripción paso a paso
  - EXACTAMENTE 5 preguntas detonadoras textuales que dirá el docente
  - Cómo se activan conocimientos previos
  - Organización del espacio y del grupo en este momento
  - Qué produce o registra el alumno

▸ MOMENTO 2: DESARROLLO (aprox. ${Math.round(parseInt(f.duracion)*0.5)} min)
  - Descripción DETALLADA, paso a paso, de la actividad principal
  - Instrucciones textuales que el docente puede leer/adaptar directamente
  - Al menos 2 ejemplos concretos y específicos del tema (no genéricos)
  - Roles de los estudiantes y organización si trabajan en equipo
  - Cómo el docente monitorea, retroalimenta y apoya
  - Un ejemplo resuelto o demostración del contenido central

▸ MOMENTO 3: CIERRE (aprox. 15 min)
  - Actividad de síntesis y sistematización del aprendizaje
  - 3 preguntas metacognitivas textuales para el grupo
  - Producto o evidencia concreta que se obtiene en esta sesión
  - Instrucción de tarea o extensión (opcional)

SECCIÓN 5 — MATERIALES Y RECURSOS DETALLADOS
Lista organizada por categoría:
• Materiales físicos: lista cada uno con cantidad sugerida por alumno/equipo
• Recursos digitales: con URL o nombre de la herramienta y cómo usarla
• Recursos impresos: fichas, hojas de trabajo, libros SEP (página específica si aplica)
• Preparación previa del docente: qué debe preparar antes de cada sesión

SECCIÓN 6 — ESTRATEGIA DE EVALUACIÓN INTEGRAL

6.1 EVALUACIÓN DIAGNÓSTICA
Instrumento completo listo para aplicar (preguntas, actividad, escala) con instrucciones de aplicación e interpretación de resultados.

6.2 EVALUACIÓN FORMATIVA (durante el proceso)
Desarrolla 3 instrumentos distintos y completos:
  a) Lista de cotejo con mínimo 8 indicadores (SÍ/NO/EN PROCESO)
  b) Escala estimativa con 5 criterios y 4 niveles de logro con descriptores
  c) Preguntas de reflexión oral o escrita para el diario del alumno

6.3 RÚBRICA DE EVALUACIÓN SUMATIVA
Tabla completa con:
  - Mínimo 5 criterios de evaluación
  - 4 niveles: Excelente (4), Satisfactorio (3), En desarrollo (2), Insuficiente (1)
  - Descriptores específicos y detallados en CADA celda de la tabla
  - Ponderación sugerida para cada criterio

6.4 AUTOEVALUACIÓN Y COEVALUACIÓN
Instrumento breve de autoevaluación (5 afirmaciones con escala 1-4) y una dinámica de coevaluación entre pares con criterios.

${f.gamificacion?`SECCIÓN 7 — ESTRATEGIA DE GAMIFICACIÓN
• Sistema de puntos: qué acciones otorgan puntos y cuántos (tabla detallada)
• Insignias: describe 6 insignias con nombre creativo, criterio para obtenerla y descripción visual
• Retos opcionales: 3 retos de profundización voluntaria con instrucciones
• Tablero de progreso: cómo se construye, actualiza y exhibe en el aula
• Recompensas y reconocimientos: cómo se celebran los logros de forma significativa`:""}

${f.reciclaje?`SECCIÓN ${f.gamificacion?"8":"7"} — EDUCACIÓN AMBIENTAL Y SUSTENTABILIDAD
• Lista de materiales reciclados específicos y cómo prepararlos antes de clase
• Actividad integrada de reflexión ambiental (descripción completa, 20 min)
• 5 preguntas de conciencia ecológica para el grupo
• Vinculación con al menos 2 ODS de la Agenda 2030 aplicados al nivel escolar
• Compromisos ambientales que pueden asumir los alumnos`:""}

${f.notasExtra?`SECCIÓN DE ADECUACIONES CURRICULARES
Basándote en: "${f.notasExtra}"
Desarrolla orientaciones concretas y aplicables para atención a la diversidad, NEE, y ajustes metodológicos específicos.`:""}

SECCIÓN FINAL — FUNDAMENTACIÓN CURRICULAR
Cita y explica brevemente al menos 5 referentes: marco curricular NEM 2022, LGSEMP, Plan de Estudios 2022, libros de texto gratuitos o autores de pedagogía crítica (Paulo Freire, Lev Vygotsky, David Ausubel u otros pertinentes).

═══════════════════════════════════════
REGLAS DE FORMATO Y CALIDAD:
• Usa lenguaje pedagógico profesional y preciso
• Sé exhaustivo: si una actividad necesita 10 líneas, escríbelas todas
• Cada pregunta detonadora va numerada y entrecomillada
• Usa ══, ──, ▸, •, ◆ para estructurar visualmente
• NO uses asteriscos de markdown (*) ya que el texto se verá en pantalla monoespaciada
• Mantén coherencia entre el campo formativo, el contenido y las actividades propuestas
═══════════════════════════════════════
`.trim();
}

// ── Welcome Screen ──────────────────────────────────────────────────────────
function WelcomeScreen({onStart}) {
  const features = [
    {icon:"🎓",text:"Alineado al Plan de Estudios NEM 2022"},
    {icon:"🤖",text:"Generado con IA (Gemini Flash)"},
    {icon:"📄",text:"Exportable a PDF con portada"},
    {icon:"⚡",text:"Planeaciones ultra-detalladas"},
  ];
  const [hover, setHover] = useState(false);
  return (
    <div style={{maxWidth:660,margin:"0 auto",padding:"2.5rem 1rem"}}>
      <div style={{
        background:"linear-gradient(145deg,#1e3a8a 0%,#1d4ed8 55%,#0369a1 100%)",
        borderRadius:"1.75rem",padding:"3.5rem 2.5rem 2.5rem",textAlign:"center",
        boxShadow:"0 30px 60px -10px rgba(30,58,138,0.45)",marginBottom:"1.25rem",
        position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"9999px",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"absolute",bottom:-70,left:-40,width:240,height:240,borderRadius:"9999px",background:"rgba(255,255,255,0.04)"}}/>
        <div style={{position:"absolute",top:40,left:30,width:80,height:80,borderRadius:"9999px",background:"rgba(255,255,255,0.04)"}}/>

        <div style={{fontSize:"3.8rem",marginBottom:"1.2rem",display:"inline-block",
          filter:"drop-shadow(0 6px 12px rgba(0,0,0,0.25))"}}>📋</div>

        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2.4rem",fontWeight:800,
          color:"white",lineHeight:1.15,marginBottom:"0.5rem",letterSpacing:"-0.01em"}}>
          Asistente Pedagógico <span style={{color:"#93c5fd"}}>NEM</span>
        </h1>
        <p style={{fontSize:"0.95rem",color:"#bfdbfe",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.5rem",letterSpacing:"0.02em"}}>
          Nueva Escuela Mexicana · Diseño Curricular con IA
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",
          background:"rgba(255,255,255,0.13)",borderRadius:"9999px",
          padding:"0.4rem 1.2rem",marginBottom:"2.2rem"}}>
          <span style={{fontSize:"0.78rem",color:"#e0f2fe",fontFamily:"'DM Sans',sans-serif"}}>
            👨‍🏫 {init.docente}
          </span>
        </div>

        <p style={{color:"#dbeafe",fontSize:"0.92rem",lineHeight:1.8,
          fontFamily:"'Source Serif 4',serif",marginBottom:"2.5rem",maxWidth:490,margin:"0 auto 2.5rem"}}>
          Bienvenido a su asistente de planeación docente. En minutos generaremos una planeación didáctica <strong style={{color:"#93c5fd"}}>completa, detallada y lista para el aula</strong>, alineada al marco curricular de la Nueva Escuela Mexicana 2022.
        </p>

        <button onClick={onStart}
          onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
          style={{
            background:"white",color:"#1d4ed8",border:"none",
            padding:"1rem 3rem",borderRadius:"1rem",cursor:"pointer",
            fontSize:"1rem",fontWeight:700,fontFamily:"'DM Sans',sans-serif",
            boxShadow:hover?"0 16px 35px rgba(0,0,0,0.28)":"0 8px 20px rgba(0,0,0,0.2)",
            transform:hover?"translateY(-2px)":"translateY(0)",
            transition:"all 0.18s",letterSpacing:"0.01em",
          }}>
          Comenzar Planeación →
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1.25rem"}}>
        {features.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"0.8rem",
            background:"white",borderRadius:"0.875rem",padding:"0.9rem 1rem",
            boxShadow:"0 1px 8px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
            <span style={{fontSize:"1.4rem"}}>{f.icon}</span>
            <span style={{fontSize:"0.78rem",fontWeight:600,color:"#334155",fontFamily:"'DM Sans',sans-serif",lineHeight:1.35}}>{f.text}</span>
          </div>
        ))}
      </div>

      <div style={{background:"white",borderRadius:"1rem",padding:"1rem 1.25rem",
        border:"1px solid #e2e8f0",boxShadow:"0 1px 8px rgba(0,0,0,0.05)"}}>
        <p style={{fontSize:"0.72rem",color:"#64748b",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,textAlign:"center"}}>
          🏛️ Basado en el <strong style={{color:"#1e3a8a"}}>Plan de Estudios 2022 SEP</strong> · Campos Formativos NEM · Marco curricular humanista y comunitario
        </p>
      </div>
    </div>
  );
}

// ── Result View ─────────────────────────────────────────────────────────────
function ResultView({result,form,onNew}) {
  const [copied,setCopied] = useState(false);

  const handleCopy = useCallback(()=>{
    navigator.clipboard.writeText(result).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  },[result]);

  const handlePrint = ()=>{
    const w = window.open("","_blank");
    const escaped = result.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    w.document.write(`<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<title>Planeación NEM · ${form.docente}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Serif+4:wght@300;400;600&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Source Serif 4',Georgia,serif;color:#1e293b;background:white;font-size:11pt;line-height:1.75}
@page{size:A4;margin:2cm 2.3cm}
.cover{page-break-after:always;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2cm 1cm}
.cover-badge{width:90pt;height:90pt;border-radius:50%;background:linear-gradient(135deg,#1e3a8a,#0369a1);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5cm;font-size:40pt;line-height:1}
.cover h1{font-family:'Playfair Display',serif;font-size:28pt;color:#1e3a8a;line-height:1.2;margin-bottom:0.4cm}
.cover h2{font-family:'DM Sans',sans-serif;font-size:13pt;color:#64748b;font-weight:400;margin-bottom:1.2cm}
.cover-strip{width:100%;background:#1e3a8a;height:4pt;margin:0.8cm 0}
.meta-box{border:1.5pt solid #dbeafe;border-left:5pt solid #1d4ed8;border-radius:6pt;padding:0.6cm 1cm;text-align:left;max-width:14cm;margin:0 auto 0.8cm}
.meta-box p{font-family:'DM Sans',sans-serif;font-size:10pt;color:#334155;margin-bottom:0.25cm;line-height:1.5}
.meta-box strong{color:#1e3a8a}
.cover-foot{font-family:'DM Sans',sans-serif;font-size:8.5pt;color:#94a3b8;margin-top:1cm}
.content{padding-top:0.5cm}
pre{font-family:'Source Serif 4',Georgia,serif;white-space:pre-wrap;word-wrap:break-word;font-size:10.5pt;line-height:1.8;color:#1e293b}
.footer{border-top:1.5pt solid #e2e8f0;margin-top:1.5cm;padding-top:0.4cm;font-family:'DM Sans',sans-serif;font-size:8pt;color:#94a3b8;text-align:center}
</style></head><body>
<div class="cover">
  <div class="cover-badge">📋</div>
  <div class="cover-strip"></div>
  <h1>Planeación Didáctica<br>Nueva Escuela Mexicana</h1>
  <h2>Ciclo Escolar 2024 – 2025</h2>
  <div class="meta-box">
    <p><strong>Docente:</strong> ${form.docente}</p>
    <p><strong>Escuela:</strong> ${form.escuela}${form.cct?" &nbsp;·&nbsp; CCT: "+form.cct:""}</p>
    <p><strong>Ubicación:</strong> ${form.municipio}, ${form.estado}</p>
    <p><strong>Nivel / Grado:</strong> ${form.nivel} — ${form.grado} grado</p>
    <p><strong>Disciplina:</strong> ${form.disciplina}${form.grupoAlumnos?" &nbsp;·&nbsp; "+form.grupoAlumnos+" alumnos":""}</p>
    <p><strong>Campo Formativo:</strong> ${form.campo}</p>
    <p><strong>Metodología:</strong> ${form.metodologia}</p>
    <p><strong>Sesiones:</strong> ${form.sesiones} sesiones × ${form.duracion} minutos</p>
  </div>
  <div class="cover-strip"></div>
  <p class="cover-foot">Generado con Asistente Pedagógico NEM · Herramienta de apoyo docente con IA</p>
</div>
<div class="content"><pre>${escaped}</pre></div>
<div class="footer">⚠ Este documento fue generado con apoyo de Inteligencia Artificial. El docente es responsable de su revisión, adaptación y aplicación pedagógica. · SEP · NEM 2022</div>
</body></html>`);
    w.document.close();
    setTimeout(()=>{w.focus();w.print();},700);
  };

  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"1.5rem 1rem 3rem"}}>
      <div style={{
        background:"linear-gradient(135deg,#065f46,#059669)",
        borderRadius:"1.25rem",padding:"1.5rem 1.75rem",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",
        boxShadow:"0 12px 30px rgba(5,150,105,0.3)",marginBottom:"1.25rem",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <span style={{fontSize:"2rem"}}>✅</span>
          <div>
            <p style={{color:"#ecfdf5",fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.09em",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.15rem"}}>Lista para usar</p>
            <h2 style={{color:"white",fontSize:"1.25rem",fontFamily:"'Playfair Display',serif",fontWeight:700}}>Planeación Generada con IA</h2>
          </div>
        </div>
        <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
          {[
            {label:copied?"✓ Copiado":"📋 Copiar",fn:handleCopy,style:{background:copied?"white":"rgba(255,255,255,0.2)",color:copied?"#059669":"white",border:"none"}},
            {label:"🖨️ Exportar PDF",fn:handlePrint,style:{background:"white",color:"#065f46",border:"none"}},
            {label:"＋ Nueva",fn:onNew,style:{background:"rgba(255,255,255,0.15)",color:"white",border:"1.5px solid rgba(255,255,255,0.3)"}},
          ].map((btn,i)=>(
            <button key={i} onClick={btn.fn}
              style={{...btn.style,padding:"0.6rem 1.15rem",borderRadius:"0.6rem",cursor:"pointer",
                fontWeight:700,fontSize:"0.82rem",fontFamily:"'DM Sans',sans-serif",transition:"opacity 0.15s"}}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{background:"white",borderRadius:"1.25rem",
        boxShadow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{background:"#1e293b",padding:"0.65rem 1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
          {["#ef4444","#f59e0b","#22c55e"].map((c,i)=>(
            <span key={i} style={{width:"0.65rem",height:"0.65rem",borderRadius:"9999px",background:c,display:"inline-block"}}/>
          ))}
          <span style={{color:"#94a3b8",fontSize:"0.72rem",fontFamily:"monospace",marginLeft:"0.5rem"}}>
            planeacion_{(form.disciplina||"nem").toLowerCase().replace(/\s+/g,"_")}_nem.txt
          </span>
        </div>
        <div style={{padding:"1.75rem 2rem",maxHeight:"65vh",overflowY:"auto"}}>
          <pre style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:"0.865rem",
            lineHeight:1.85,color:"#1e293b",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
            {result}
          </pre>
        </div>
      </div>
      <p style={{textAlign:"center",fontSize:"0.68rem",color:"#94a3b8",marginTop:"1rem",fontFamily:"'DM Sans',sans-serif"}}>
        ⚠️ Documento de apoyo pedagógico generado con IA · Revisión y adaptación docente obligatoria antes de aplicar
      </p>
    </div>
  );
}

// ── App Principal ───────────────────────────────────────────────────────────
const LOAD_MSGS = [
  "Analizando contexto pedagógico…",
  "Construyendo secuencia didáctica detallada…",
  "Redactando actividades con ejemplos…",
  "Elaborando instrumentos de evaluación…",
  "Generando rúbricas y criterios…",
  "Finalizando planeación completa…",
];

export default function AsistenteNEM() {
  const [screen,  setScreen]  = useState("welcome");
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState(init);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [result,  setResult]  = useState("");

  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const goNext = ()=>{
    const err = validate(step,form);
    if(Object.keys(err).length){setErrors(err);return;}
    setErrors({}); setStep(s=>s+1);
  };
  const goBack = ()=>{setErrors({});setStep(s=>s-1);};

  const handleGenerate = async ()=>{
    setLoading(true); setLoadMsg(LOAD_MSGS[0]);
    let i=0;
    const iv = setInterval(()=>{i=(i+1)%LOAD_MSGS.length;setLoadMsg(LOAD_MSGS[i]);},2200);

    const API_KEY = "AIzaSyDDlKteBds31I6kFFhPixu9x0CC5UQEGMg";
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
        {method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            contents:[{parts:[{text:buildPrompt(form)}]}],
            generationConfig:{temperature:0.65,maxOutputTokens:8192},
          })});
      const data = await res.json();
      const txt  = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setResult(txt||"No se recibió respuesta de Gemini.\n\n"+JSON.stringify(data,null,2));
    } catch(e) {
      setResult("❌ Error de conexión con Gemini:\n"+e.message);
    }
    clearInterval(iv); setLoading(false); setScreen("result");
  };

  const progress = ((step-1)/(STEPS.length-1))*100;
  const sd = STEPS[step-1];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#f0f4ff 0%,#e8f3fd 45%,#f0fdf4 100%)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        *{-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes bar{0%,100%{transform:translateX(-100%)}50%{transform:translateX(100%)}}
      `}</style>

      {/* Navbar */}
      <nav style={{
        background:"rgba(255,255,255,0.88)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(226,232,240,0.9)",
        padding:"0.85rem 1.5rem",display:"flex",alignItems:"center",gap:"0.9rem",
        position:"sticky",top:0,zIndex:100,
      }}>
        <div style={{width:"2.1rem",height:"2.1rem",borderRadius:"0.5rem",
          background:"linear-gradient(135deg,#1d4ed8,#0369a1)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>📋</div>
        <div>
          <p style={{fontSize:"0.88rem",fontWeight:800,color:"#1e3a8a",lineHeight:1,fontFamily:"'DM Sans',sans-serif"}}>Asistente Pedagógico NEM</p>
          <p style={{fontSize:"0.62rem",color:"#64748b",marginTop:"0.1rem",fontFamily:"'DM Sans',sans-serif"}}>Nueva Escuela Mexicana · SEP 2022</p>
        </div>
        {screen==="form"&&!loading&&(
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"0.4rem"}}>
            <span style={{fontSize:"0.68rem",color:"#94a3b8",marginRight:"0.3rem",fontFamily:"'DM Sans',sans-serif"}}>{step}/{STEPS.length}</span>
            {STEPS.map(s=>(
              <div key={s.id} style={{width:"0.45rem",height:"0.45rem",borderRadius:"9999px",
                background:step>=s.id?"#1d4ed8":"#e2e8f0",transition:"background 0.2s"}}/>
            ))}
          </div>
        )}
      </nav>

      {/* Welcome */}
      {screen==="welcome" && <WelcomeScreen onStart={()=>setScreen("form")}/>}

      {/* Form */}
      {screen==="form"&&!loading&&(
        <div style={{maxWidth:700,margin:"0 auto",padding:"2rem 1rem"}}>
          {/* Stepper */}
          <div style={{marginBottom:"1.5rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"0.45rem"}}>
              <p style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                Paso {step} de {STEPS.length} — <span style={{color:sd.color}}>{sd.label}</span>
              </p>
              <p style={{fontSize:"0.7rem",color:sd.color,fontWeight:700}}>{Math.round(progress)}%</p>
            </div>
            <div style={{height:"0.3rem",background:"#e2e8f0",borderRadius:"9999px",overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:"9999px",
                background:`linear-gradient(90deg,${sd.color},${sd.color}99)`,
                width:`${progress}%`,transition:"width 0.4s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.8rem",padding:"0 0.25rem"}}>
              {STEPS.map(s=>(
                <div key={s.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem"}}>
                  <button onClick={()=>s.id<step&&setStep(s.id)}
                    style={{width:"2.35rem",height:"2.35rem",borderRadius:"0.6rem",
                      border:`2px solid ${step===s.id?s.color:s.id<step?"#93c5fd":"#e2e8f0"}`,
                      background:step===s.id?s.color:s.id<step?"#eff6ff":"white",
                      color:step===s.id?"white":s.id<step?"#1d4ed8":"#94a3b8",
                      fontSize:step>s.id?"0.85rem":"0.95rem",cursor:s.id<step?"pointer":"default",
                      display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,
                      transform:step===s.id?"scale(1.1)":"scale(1)",
                      boxShadow:step===s.id?`0 4px 14px ${s.color}50`:"none",
                      transition:"all 0.2s"}}>
                    {s.id<step?"✓":s.icon}
                  </button>
                  <span style={{fontSize:"0.6rem",fontWeight:step===s.id?700:500,
                    color:step===s.id?s.color:"#94a3b8",textAlign:"center",maxWidth:"3.5rem",lineHeight:1.3}}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div style={{background:"white",borderRadius:"1.5rem",
            boxShadow:"0 10px 40px rgba(0,0,0,0.09)",border:"1px solid #e2e8f0",overflow:"hidden"}}>
            <div style={{background:`linear-gradient(135deg,${sd.color},${sd.color}c0)`,
              padding:"1.4rem 2rem",display:"flex",alignItems:"center",gap:"1rem"}}>
              <span style={{fontSize:"2rem",filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{sd.icon}</span>
              <div>
                <p style={{color:"rgba(255,255,255,0.65)",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:"0.12rem"}}>Paso {step} de {STEPS.length}</p>
                <h2 style={{color:"white",fontSize:"1.3rem",fontFamily:"'Playfair Display',serif",fontWeight:700}}>{sd.label}</h2>
              </div>
            </div>

            <div style={{padding:"1.75rem 2rem"}}>
              {step===1&&<Step1 form={form} upd={upd} errors={errors}/>}
              {step===2&&<Step2 form={form} upd={upd} errors={errors}/>}
              {step===3&&<Step3 form={form} upd={upd} errors={errors}/>}
              {step===4&&<Step4 form={form} upd={upd} errors={errors}/>}
              {step===5&&<Step5 form={form} upd={upd}/>}
            </div>

            <div style={{padding:"1.1rem 2rem 1.6rem",display:"flex",justifyContent:"space-between",
              alignItems:"center",borderTop:"1px solid #f1f5f9"}}>
              <button onClick={goBack} disabled={step===1}
                style={{padding:"0.65rem 1.4rem",borderRadius:"0.7rem",border:"1.5px solid #e2e8f0",
                  background:"white",color:"#64748b",fontWeight:700,fontSize:"0.84rem",
                  cursor:step===1?"default":"pointer",opacity:step===1?0:1,
                  transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif"}}>
                ← Anterior
              </button>
              {step<5?(
                <button onClick={goNext}
                  style={{padding:"0.75rem 2.2rem",borderRadius:"0.875rem",border:"none",
                    background:`linear-gradient(135deg,${sd.color},${sd.color}c0)`,
                    color:"white",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",
                    boxShadow:`0 6px 20px ${sd.color}45`,fontFamily:"'DM Sans',sans-serif",transition:"all 0.18s"}}
                  onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow=`0 10px 24px ${sd.color}55`;}}
                  onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow=`0 6px 20px ${sd.color}45`;}}>
                  Siguiente →
                </button>
              ):(
                <button onClick={handleGenerate}
                  style={{display:"flex",alignItems:"center",gap:"0.5rem",
                    padding:"0.8rem 2rem",borderRadius:"0.875rem",border:"none",
                    background:"linear-gradient(135deg,#059669,#0d9488)",
                    color:"white",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",
                    boxShadow:"0 6px 20px rgba(5,150,105,0.4)",fontFamily:"'DM Sans',sans-serif"}}>
                  <span>✨</span> Generar Planeación con IA
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {screen==="form"&&loading&&(
        <div style={{maxWidth:480,margin:"5rem auto",padding:"0 1rem",textAlign:"center"}}>
          <div style={{background:"white",borderRadius:"1.5rem",
            boxShadow:"0 20px 60px rgba(0,0,0,0.1)",padding:"3rem 2.5rem",border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:"3rem",marginBottom:"1.4rem",display:"inline-block",animation:"spin 3s linear infinite"}}>⚙️</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",color:"#1e3a8a",marginBottom:"0.6rem"}}>
              Generando planeación…
            </h3>
            <p style={{color:"#64748b",fontSize:"0.84rem",marginBottom:"2rem",minHeight:"1.3rem",fontFamily:"'DM Sans',sans-serif"}}>{loadMsg}</p>
            <div style={{height:"0.3rem",background:"#f1f5f9",borderRadius:"9999px",overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,#1d4ed8,#059669,transparent)",
                animation:"bar 2s ease-in-out infinite"}}/>
            </div>
            <p style={{fontSize:"0.68rem",color:"#94a3b8",marginTop:"1.2rem",fontFamily:"'DM Sans',sans-serif"}}>
              Solicitando planeación ultra-detallada a Gemini · 20–45 segundos
            </p>
          </div>
        </div>
      )}

      {/* Result */}
      {screen==="result"&&(
        <ResultView result={result} form={form}
          onNew={()=>{setScreen("welcome");setStep(1);setForm(init);setResult("");}}/>
      )}
    </div>
  );
}
