import { useState, useCallback } from "react";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Patrick+Hand&family=DM+Sans:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ── Constantes ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Datos del Docente",  icon: "👤", color: "#1d4ed8" },
  { id: 2, label: "Contexto Académico", icon: "🏫", color: "#0369a1" },
  { id: 3, label: "Currícula NEM",      icon: "📚", color: "#0f766e" },
  { id: 4, label: "Estrategia",         icon: "🎯", color: "#7c3aed" },
  { id: 5, label: "Plus",               icon: "✨", color: "#b45309" },
];

const CAMPOS = [
  { value: "Lenguajes",                      desc: "Comunicación, lectura y expresión creativa" },
  { value: "Saberes y Pensamiento Científico", desc: "Matemáticas, ciencias, tecnología, STEAM" },
  { value: "Ética, Naturaleza y Sociedades",  desc: "Historia, geografía, formación cívica" },
  { value: "De lo Humano y lo Comunitario",   desc: "Arte, cultura física, socioemocional" },
];

const METODOLOGIAS = [
  { value: "Proyecto de Aula (NEM)",                       icon: "🏗️" },
  { value: "Aprendizaje Basado en Problemas (ABP)",         icon: "🔍" },
  { value: "Aprendizaje Basado en Indagación (STEAM)",      icon: "🔬" },
  { value: "Aula Invertida",                                icon: "🔄" },
  { value: "Aprendizaje Basado en el Servicio",             icon: "🤝" },
  { value: "Aprendizaje Cooperativo",                       icon: "👥" },
];

const EJES = [
  "Inclusión",
  "Pensamiento crítico",
  "Interculturalidad crítica",
  "Igualdad de género",
  "Vida saludable",
  "Apropiación de las culturas a través de la lectura y la escritura",
  "Artes y experiencias estéticas",
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
  docente:"Dr. Francisco De Jesús Luna Benítez", escuela:"", cct:"",
  municipio:"", estado:"Tlaxcala", zonaEscolar:"", turno:"Matutino",
  nivel:"Secundaria", grado:"", disciplina:"", grupoAlumnos:"", problematica:"",
  campo:"", eje:"", contenido:"", pda:"",
  metodologia:"", sesiones:"6", duracion:"50", materiales:"",
  gamificacion:false, reciclaje:false, notasExtra:"",
};

// ── Input styles ──────────────────────────────────────────────────────────────
function useFocus() {
  const [f, setF] = useState(false);
  return [f, { onFocus:()=>setF(true), onBlur:()=>setF(false) }];
}
const baseInput = (focused, error) => ({
  width:"100%", padding:"0.68rem 0.9rem", borderRadius:"0.6rem",
  fontSize:"0.875rem", color:"#1e293b", outline:"none",
  transition:"all 0.18s", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif",
  border:`1.5px solid ${error?"#fca5a5":focused?"#3b82f6":"#e2e8f0"}`,
  background:focused?"#f8fbff":"#f8fafc",
  boxShadow:focused?"0 0 0 3px #dbeafe":"none",
});
function Input({ value, onChange, placeholder, type="text", error }) {
  const [f, fx] = useFocus();
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...fx} style={baseInput(f,error)}/>;
}
function Textarea({ value, onChange, placeholder, rows=3, error }) {
  const [f, fx] = useFocus();
  return <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} {...fx}
    style={{...baseInput(f,error), resize:"vertical", lineHeight:1.65}}/>;
}
function Select({ value, onChange, options, error }) {
  const [f, fx] = useFocus();
  return (
    <select value={value} onChange={onChange} {...fx} style={baseInput(f,error)}>
      <option value="">— Seleccionar —</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
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

// ── Steps ─────────────────────────────────────────────────────────────────────
function Step1({form,upd,errors}) {
  const u = k => e => upd(k, e.target.value);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
      <div style={{gridColumn:"1/-1"}}>
        <Field label="Nombre completo del docente" required error={errors.docente}>
          <Input value={form.docente} onChange={u("docente")} error={errors.docente}/>
        </Field>
      </div>
      <Field label="Nombre de la escuela" required error={errors.escuela}>
        <Input value={form.escuela} onChange={u("escuela")} placeholder="Ej. Secundaria General 'Mariano Matamoros'" error={errors.escuela}/>
      </Field>
      <Field label="CCT" hint="Clave del Centro de Trabajo">
        <Input value={form.cct} onChange={u("cct")} placeholder="Ej. 29DST0001Z"/>
      </Field>
      <Field label="Zona Escolar">
        <Input value={form.zonaEscolar} onChange={u("zonaEscolar")} placeholder="Ej. 01"/>
      </Field>
      <Field label="Turno">
        <Select value={form.turno} onChange={u("turno")} options={["Matutino","Vespertino","Nocturno"]}/>
      </Field>
      <Field label="Municipio" required error={errors.municipio}>
        <Input value={form.municipio} onChange={u("municipio")} placeholder="Ej. Calpulalpan" error={errors.municipio}/>
      </Field>
      <Field label="Estado" required error={errors.estado}>
        <Input value={form.estado} onChange={u("estado")} placeholder="Tlaxcala" error={errors.estado}/>
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
        <Input value={form.disciplina} onChange={u("disciplina")} placeholder="Ej. Matemáticas" error={errors.disciplina}/>
      </Field>
      <Field label="Alumnos en el grupo" hint="Aprox.">
        <Input value={form.grupoAlumnos} onChange={u("grupoAlumnos")} type="number" placeholder="30"/>
      </Field>
      <div style={{gridColumn:"1/-1"}}>
        <Field label="Problemática o situación del contexto" required hint="Situación real del entorno" error={errors.problematica}>
          <Textarea value={form.problematica} onChange={u("problematica")} rows={4} error={errors.problematica}
            placeholder="Describe la problemática comunitaria o escolar que da origen a esta planeación…"/>
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
          {CAMPOS.map(c=>(
            <button key={c.value} type="button" onClick={()=>upd("campo",c.value)}
              style={{padding:"0.8rem",borderRadius:"0.7rem",textAlign:"left",cursor:"pointer",
                border:`2px solid ${form.campo===c.value?"#0f766e":"#e2e8f0"}`,
                background:form.campo===c.value?"#f0fdfa":"#f8fafc",transition:"all 0.15s"}}>
              <p style={{fontSize:"0.76rem",fontWeight:700,color:form.campo===c.value?"#0f766e":"#334155",marginBottom:"0.18rem",fontFamily:"'DM Sans',sans-serif"}}>{c.value}</p>
              <p style={{fontSize:"0.67rem",color:"#64748b",fontFamily:"'DM Sans',sans-serif",lineHeight:1.35}}>{c.desc}</p>
            </button>
          ))}
        </div>
        {errors.campo&&<p style={{color:"#dc2626",fontSize:"0.7rem",marginTop:"0.3rem"}}>⚠ {errors.campo}</p>}
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
        <Field label="Eje articulador principal" required error={errors.eje}>
          <Select value={form.eje} onChange={u("eje")} options={EJES} error={errors.eje}/>
        </Field>
        <Field label="Contenido temático" required error={errors.contenido}>
          <Input value={form.contenido} onChange={u("contenido")} placeholder="Ej. Proporcionalidad directa" error={errors.contenido}/>
        </Field>
      </div>
      <Field label="PDA — Proceso de Desarrollo del Aprendizaje" required hint="Del libro de planes y programas SEP" error={errors.pda}>
        <Textarea value={form.pda} onChange={u("pda")} rows={3} error={errors.pda}
          placeholder="Ej. Reconoce y aplica fracciones en situaciones de la vida cotidiana…"/>
      </Field>
    </div>
  );
}
function Step4({form,upd,errors}) {
  const u = k => e => upd(k, e.target.value);
  return (
    <div>
      <Field label="Metodología didáctica" required error={errors.metodologia}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.6rem"}}>
          {METODOLOGIAS.map(m=>(
            <button key={m.value} type="button" onClick={()=>upd("metodologia",m.value)}
              style={{padding:"0.75rem 0.5rem",borderRadius:"0.7rem",textAlign:"center",cursor:"pointer",
                border:`2px solid ${form.metodologia===m.value?"#7c3aed":"#e2e8f0"}`,
                background:form.metodologia===m.value?"#f5f3ff":"#f8fafc",transition:"all 0.15s"}}>
              <span style={{fontSize:"1.3rem",display:"block",marginBottom:"0.28rem"}}>{m.icon}</span>
              <p style={{fontSize:"0.66rem",fontWeight:700,color:form.metodologia===m.value?"#7c3aed":"#475569",fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>{m.value}</p>
            </button>
          ))}
        </div>
        {errors.metodologia&&<p style={{color:"#dc2626",fontSize:"0.7rem",marginTop:"0.3rem"}}>⚠ {errors.metodologia}</p>}
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
        <Field label="Número de sesiones">
          <Input value={form.sesiones} onChange={u("sesiones")} type="number" placeholder="6"/>
        </Field>
        <Field label="Duración por sesión (min)">
          <Input value={form.duracion} onChange={u("duracion")} type="number" placeholder="50"/>
        </Field>
      </div>
      <Field label="Materiales y recursos didácticos" required hint="Libros SEP, tecnología, materiales…" error={errors.materiales}>
        <Textarea value={form.materiales} onChange={u("materiales")} rows={3} error={errors.materiales}
          placeholder="Ej. Libros de texto SEP, cartulinas, marcadores, dispositivos con internet…"/>
      </Field>
    </div>
  );
}
function Step5({form,upd}) {
  const u = k => e => upd(k, e.target.value);
  const opts = [
    {key:"gamificacion",icon:"🎮",title:"Gamificación educativa",
     desc:"Sistema de puntos, insignias y retos para motivar la participación.",
     on:"#1d4ed8",bg:"#eff6ff",br:"#93c5fd",tbg:"#3b82f6"},
    {key:"reciclaje",icon:"♻️",title:"Sustentabilidad y reciclaje",
     desc:"Materiales reciclados y vinculación con educación ambiental.",
     on:"#065f46",bg:"#f0fdf4",br:"#86efac",tbg:"#22c55e"},
  ];
  return (
    <div>
      <p style={{fontSize:"0.8rem",color:"#64748b",marginBottom:"1.2rem",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>
        Activa las opciones adicionales que desees incluir en la planeación.
      </p>
      <div style={{display:"flex",flexDirection:"column",gap:"0.85rem",marginBottom:"1.4rem"}}>
        {opts.map(o=>(
          <button key={o.key} type="button" onClick={()=>upd(o.key,!form[o.key])}
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
              <span style={{position:"absolute",top:"0.12rem",width:"0.96rem",height:"0.96rem",
                borderRadius:"9999px",background:"white",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
                transition:"left 0.2s",left:form[o.key]?"1rem":"0.12rem"}}/>
            </div>
          </button>
        ))}
      </div>
      <Field label="Notas adicionales / Adecuaciones curriculares" hint="Opcional">
        <Textarea value={form.notasExtra} onChange={u("notasExtra")} rows={4}
          placeholder="Alumnos con NEE, adecuaciones de acceso, atención a la diversidad…"/>
      </Field>
    </div>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────
function validate(step, form) {
  const err = {};
  (REQUIRED[step]||[]).forEach(k=>{
    if(!form[k]||!form[k].toString().trim()) err[k]=`El campo "${LABELS[k]}" es obligatorio.`;
  });
  return err;
}

// ── JSON Prompt ───────────────────────────────────────────────────────────────
function buildJsonPrompt(f) {
  return `
Eres especialista en diseño curricular de la Nueva Escuela Mexicana (NEM).
Genera una planeación didáctica en formato JSON puro.

DATOS:
- Docente: ${f.docente} | Escuela: ${f.escuela} | CCT: ${f.cct||"N/A"} | Zona: ${f.zonaEscolar||"N/A"} | Turno: ${f.turno}
- Ubicación: ${f.municipio}, ${f.estado} | Nivel: ${f.nivel} | Grado: ${f.grado} | Alumnos: ${f.grupoAlumnos||"N/A"}
- Disciplina: ${f.disciplina} | Campo: ${f.campo} | Eje: ${f.eje}
- Contenido: ${f.contenido} | PDA: ${f.pda}
- Metodología: ${f.metodologia} | Sesiones: ${f.sesiones} × ${f.duracion} min | Materiales: ${f.materiales}
- Problemática: ${f.problematica}
- Gamificación: ${f.gamificacion?"Sí":"No"} | Sustentabilidad: ${f.reciclaje?"Sí":"No"}
- Notas extra: ${f.notasExtra||"Ninguna"}

INSTRUCCIÓN CRÍTICA: Responde ÚNICAMENTE con JSON válido. Sin texto, sin backticks, sin markdown.

ESTRUCTURA EXACTA:

{
  "periodoAplicacion": "Ej: Noviembre 2025 — 1er bimestre ciclo 2025-2026",
  "situacionProblema": "3-4 oraciones contextualizadas en la problemática indicada",
  "escenario": "Aula",
  "nombreProyecto": "Nombre creativo del proyecto vinculado al contenido",
  "producto": "Producto final concreto que elaborarán los alumnos",
  "ejesSeleccionados": [1, 3],
  "contenido": "Descripción extendida del contenido disciplinar (2-3 oraciones con ejemplos)",
  "pda": "PDA redactado con claridad pedagógica",
  "sesiones": [
    {
      "numero": 1,
      "tipo": "F1",
      "descripcion": "INICIO: Actividad de apertura y pregunta detonadora. Ej para ${f.contenido}: [escribe aquí una pregunta detonadora real y cómo se organiza el grupo, mínimo 3 oraciones]. DESARROLLO: Actividad principal con pasos claros y ejemplo concreto del tema. Ej: [describe la actividad paso a paso con roles de los alumnos y un ejemplo numérico o situacional real, mínimo 4 oraciones]. CIERRE: Síntesis y pregunta metacognitiva. Ej: [cómo se concluye la sesión y qué pregunta se lanza para reflexionar, mínimo 2 oraciones].",
      "evaluacionFormativa": "MO, ES",
      "formaTrabajo": "Equipos de 3",
      "materiales": "Libro SEP, cartulinas"
    }
  ],
  "evaluacion": {
    "diagnostica": "Instrumento diagnóstico con 2-3 preguntas o actividad clave",
    "formativa": "2 instrumentos formativos con criterios básicos de observación",
    "rubrica": [
      {
        "criterio": "Comprensión del concepto",
        "excelente": "Explica y aplica sin errores con ejemplos propios",
        "satisfactorio": "Aplica correctamente con mínimos errores",
        "enDesarrollo": "Aplica parcialmente con apoyo del docente",
        "insuficiente": "No logra aplicar el concepto aún con apoyo"
      },
      {
        "criterio": "Participación y trabajo colaborativo",
        "excelente": "Lidera, propone y apoya a sus compañeros",
        "satisfactorio": "Participa activamente en las actividades",
        "enDesarrollo": "Participa solo cuando se le solicita",
        "insuficiente": "No participa ni colabora con el equipo"
      },
      {
        "criterio": "Calidad del producto final",
        "excelente": "Producto completo, claro y con argumentación sólida",
        "satisfactorio": "Producto completo con pequeños errores",
        "enDesarrollo": "Producto incompleto o con errores relevantes",
        "insuficiente": "No entrega o el producto no cumple los criterios"
      }
    ]
  },
  "fundamentacion": "2-3 oraciones sobre fundamentos NEM, Plan de Estudios 2022 y metodología elegida",
  "gamificacion": ${f.gamificacion?`{
    "sistema": "Descripción del sistema de puntos e insignias",
    "insignias": ["Insignia 1", "Insignia 2", "Insignia 3"],
    "retos": ["Reto 1", "Reto 2"]
  }`:"null"},
  "sustentabilidad": ${f.reciclaje?`{
    "materiales": "Lista de materiales reciclados",
    "actividad": "Actividad de reflexión ambiental integrada",
    "ods": "Vinculación con ODS de la Agenda 2030"
  }`:"null"}
}

REGLAS:
- Genera EXACTAMENTE ${f.sesiones} sesiones; tipo: 1-2="F1", 3-4="F2", últimas="EV"
- Campo "descripcion" de cada sesión: usa el formato INICIO/DESARROLLO/CIERRE con ejemplos REALES del tema "${f.contenido}"
- Rúbrica: usa EXACTAMENTE los 3 criterios del ejemplo, adapta solo el contenido al tema
- Sé conciso pero pedagógicamente preciso
`.trim();
}

// ── PDF HTML Generator (SEPE Tlaxcala Format) ─────────────────────────────────
function generateFormatHTML(form, plan) {
  const ejesTodos = EJES.map((e, i) => ({
    num: i + 1, nombre: e,
    marcado: plan.ejesSeleccionados && plan.ejesSeleccionados.includes(i + 1),
  }));

  const header = `
    <div class="page-header">
      <div class="header-left">
        <svg width="90" height="75" viewBox="0 0 90 75" xmlns="http://www.w3.org/2000/svg">
          <rect width="90" height="75" rx="4" fill="#f0f0f0"/>
          <!-- Tlaxcala flower logo approximation -->
          <circle cx="35" cy="38" r="14" fill="none" stroke="#7030A0" stroke-width="2"/>
          <circle cx="35" cy="22" r="5" fill="#7030A0"/>
          <circle cx="35" cy="54" r="5" fill="#7030A0"/>
          <circle cx="21" cy="38" r="5" fill="#7030A0"/>
          <circle cx="49" cy="38" r="5" fill="#7030A0"/>
          <circle cx="25" cy="27" r="4" fill="#C0A020"/>
          <circle cx="45" cy="27" r="4" fill="#C0A020"/>
          <circle cx="25" cy="49" r="4" fill="#C0A020"/>
          <circle cx="45" cy="49" r="4" fill="#C0A020"/>
          <circle cx="35" cy="38" r="6" fill="#7030A0"/>
          <text x="52" y="28" font-family="Arial Black" font-size="10" font-weight="900" fill="#4B0082">TLAXCALA</text>
          <text x="52" y="40" font-family="Arial" font-size="6" fill="#555">UNA NUEVA HISTORIA</text>
          <text x="52" y="51" font-family="Arial" font-size="6" fill="#555">2021 – 2027</text>
        </svg>
      </div>
      <div class="header-center">
        <p class="header-title">DEPARTAMENTO DE EDUCACIÓN SECUNDARIA GENERAL</p>
        <p class="header-subtitle">JEFATURAS DE ENSEÑANZA</p>
      </div>
      <div class="header-right">
        <div class="fivb-box">
          <p style="font-size:7pt;color:#333;line-height:1.3">Beach Volleyball<br><strong>World Championships</strong></p>
          <div style="background:#1a3c6e;color:white;padding:2px 6px;font-size:8pt;font-weight:bold;margin:2px 0">TLAXCALA 2023</div>
          <p style="font-size:8pt;font-weight:bold;color:#1a3c6e">FIVB</p>
        </div>
      </div>
    </div>
  `;

  const footer = `
    <div class="page-footer">
      <div class="footer-qr">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect width="40" height="40" fill="white" stroke="#ccc" stroke-width="0.5"/>
          <rect x="2" y="2" width="16" height="16" fill="none" stroke="black" stroke-width="1.5"/>
          <rect x="5" y="5" width="10" height="10" fill="black"/>
          <rect x="22" y="2" width="16" height="16" fill="none" stroke="black" stroke-width="1.5"/>
          <rect x="25" y="5" width="10" height="10" fill="black"/>
          <rect x="2" y="22" width="16" height="16" fill="none" stroke="black" stroke-width="1.5"/>
          <rect x="5" y="25" width="10" height="10" fill="black"/>
          <rect x="22" y="22" width="5" height="5" fill="black"/>
          <rect x="29" y="22" width="5" height="5" fill="black"/>
          <rect x="22" y="29" width="5" height="5" fill="black"/>
          <rect x="29" y="29" width="5" height="5" fill="black"/>
        </svg>
      </div>
      <div class="footer-logos">
        <div class="footer-sepe">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="none" stroke="#4a7c3f" stroke-width="1.5"/>
            <circle cx="10" cy="12" r="3" fill="#4a7c3f"/>
            <circle cx="20" cy="12" r="3" fill="#4a7c3f"/>
            <circle cx="15" cy="8" r="3" fill="#7030A0"/>
            <circle cx="15" cy="20" r="3" fill="#7030A0"/>
          </svg>
          <div>
            <p style="font-size:11pt;font-weight:900;color:#4a7c3f;line-height:1">SEPE</p>
            <p style="font-size:5pt;color:#555;line-height:1.3">SECRETARÍA DE EDUCACIÓN<br>PÚBLICA DEL ESTADO</p>
          </div>
        </div>
        <div class="footer-uset">
          <p style="font-size:13pt;font-weight:900;color:#1a3c6e;line-height:1">USET</p>
          <p style="font-size:5pt;color:#555;line-height:1.3">UNIDAD DE SERVICIOS EDUCATIVOS<br>DEL ESTADO DE TLAXCALA</p>
        </div>
      </div>
      <div class="footer-bar"></div>
    </div>
  `;

  const watermark = `
    <div class="watermark">
      <svg width="320" height="420" viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg" opacity="0.06">
        <g transform="translate(160,210)">
          <!-- Large petal shapes -->
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(0)"/>
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(45)"/>
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(90)"/>
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(135)"/>
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(180)"/>
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(225)"/>
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(270)"/>
          <ellipse cx="0" cy="-90" rx="28" ry="70" fill="#7030A0" transform="rotate(315)"/>
          <!-- Inner petals -->
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(22.5)"/>
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(67.5)"/>
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(112.5)"/>
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(157.5)"/>
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(202.5)"/>
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(247.5)"/>
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(292.5)"/>
          <ellipse cx="0" cy="-55" rx="18" ry="45" fill="#C0A020" transform="rotate(337.5)"/>
          <circle cx="0" cy="0" r="28" fill="#7030A0"/>
          <circle cx="0" cy="0" r="18" fill="#C0A020"/>
          <!-- Outer decorative ring -->
          <circle cx="0" cy="0" r="130" fill="none" stroke="#7030A0" stroke-width="2"/>
          <circle cx="0" cy="0" r="145" fill="none" stroke="#C0A020" stroke-width="1"/>
        </g>
      </svg>
    </div>
  `;

  // Build session rows
  const sessionRows = (plan.sesiones || []).map(s => `
    <tr class="session-row">
      <td class="td-num">${s.numero}</td>
      <td class="td-tipo">${s.tipo || 'F1'}</td>
      <td class="td-desc">${(s.descripcion || s.descripcionCompleta || '').replace(/\n/g,'<br>').replace(/INICIO:/g,'<strong>INICIO:</strong>').replace(/DESARROLLO:/g,'<br><strong>DESARROLLO:</strong>').replace(/CIERRE:/g,'<br><strong>CIERRE:</strong>')}</td>
      <td class="td-eval">${s.evaluacionFormativa || ''}</td>
      <td class="td-forma">${s.formaTrabajo || ''}</td>
      <td class="td-mat">${s.materiales || ''}</td>
    </tr>
  `).join('');

  // Rubric rows
  const rubricRows = (plan.evaluacion?.rubrica || []).map(r => `
    <tr>
      <td style="font-weight:bold;color:#7030A0;padding:4pt 6pt;border:1pt solid #4472C4;font-size:8pt">${r.criterio}</td>
      <td style="padding:4pt 6pt;border:1pt solid #4472C4;font-size:7.5pt;background:#e8f5e9">${r.excelente}</td>
      <td style="padding:4pt 6pt;border:1pt solid #4472C4;font-size:7.5pt;background:#fff9c4">${r.satisfactorio}</td>
      <td style="padding:4pt 6pt;border:1pt solid #4472C4;font-size:7.5pt;background:#fff3e0">${r.enDesarrollo}</td>
      <td style="padding:4pt 6pt;border:1pt solid #4472C4;font-size:7.5pt;background:#fce4ec">${r.insuficiente}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Plano Didáctico – ${form.escuela}</title>
<link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Patrick Hand', 'Comic Sans MS', cursive; color: #1a1a1a; background: white; font-size: 10pt; }
  @page { size: A4; margin: 1.4cm 1.6cm 1.8cm 1.6cm; }

  /* LAYOUT */
  .page { position: relative; min-height: 100vh; }
  .page-break { page-break-after: always; }

  /* HEADER */
  .page-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 8pt; margin-bottom: 10pt;
    border-bottom: 2pt solid #C9A820;
  }
  .header-left { flex: 0 0 auto; }
  .header-center { flex: 1; text-align: center; padding: 0 12pt; }
  .header-title {
    font-family: 'IM Fell English', 'Palatino Linotype', serif;
    font-size: 12.5pt; letter-spacing: 0.06em; color: #1a1a1a; line-height: 1.4;
  }
  .header-subtitle {
    font-family: 'IM Fell English', 'Palatino Linotype', serif;
    font-size: 11pt; letter-spacing: 0.05em; color: #1a1a1a;
  }
  .header-right { flex: 0 0 auto; }
  .fivb-box { border: 1pt solid #ccc; padding: 4pt 6pt; border-radius: 3pt; text-align: center; min-width: 90pt; }

  /* WATERMARK */
  .watermark {
    position: fixed; right: -30pt; top: 50%;
    transform: translateY(-50%); pointer-events: none; z-index: 0;
  }

  /* CONTENT */
  .content { position: relative; z-index: 1; }

  /* BANNERS */
  .banner-green {
    background: #5a9e44; color: white; text-align: center;
    padding: 5pt 10pt; font-weight: bold; font-size: 11pt;
    border-radius: 2pt;
  }
  .banner-blue {
    background: #4472C4; color: white; text-align: center;
    padding: 5pt 10pt; font-weight: bold; font-size: 11pt;
    border-radius: 2pt;
  }
  .banner-purple {
    background: #7030A0; color: white; text-align: center;
    padding: 5pt 10pt; font-weight: bold; font-size: 11pt;
    border-radius: 2pt;
  }

  /* TABLES */
  .tbl { width: 100%; border-collapse: collapse; margin-bottom: 10pt; }
  .tbl td, .tbl th {
    border: 1pt solid #4472C4; padding: 5pt 7pt; vertical-align: top;
    font-family: 'Patrick Hand', cursive; font-size: 9.5pt; line-height: 1.45;
  }
  .tbl .lbl { color: #7030A0; font-weight: bold; background: #f8f4ff; white-space: nowrap; }
  .tbl .val { color: #1a1a1a; }
  .tbl-header {
    background: #5a9e44; color: white; font-weight: bold;
    text-align: center; font-size: 10pt; padding: 5pt;
  }
  .tbl-subheader {
    background: #4472C4; color: white; font-weight: bold;
    text-align: center; font-size: 9pt; padding: 4pt;
  }

  /* STRATEGY TABLE */
  .strat-table { width: 100%; border-collapse: collapse; margin-top: 6pt; font-size: 8.5pt; }
  .strat-table th {
    background: #5a9e44; color: white; border: 1pt solid #3a7e2a;
    padding: 5pt 4pt; text-align: center; font-size: 8.5pt; line-height: 1.3;
  }
  .strat-table td {
    border: 1pt solid #4472C4; padding: 5pt 6pt; vertical-align: top;
    line-height: 1.6; font-size: 8pt;
  }
  .td-num { text-align: center; font-weight: bold; color: #7030A0; width: 22pt; }
  .td-tipo { text-align: center; width: 22pt; }
  .td-desc { width: 52%; }
  .td-eval { width: 10%; font-size: 7.5pt; }
  .td-forma { width: 9%; font-size: 7.5pt; }
  .td-mat { width: 13%; font-size: 7.5pt; }
  .session-row:nth-child(even) { background: #f7f7ff; }

  /* EJES TABLE */
  .ejes-tbl { width: 50%; border-collapse: collapse; margin-bottom: 10pt; }
  .ejes-tbl td { border: 1pt solid #4472C4; padding: 4pt 7pt; font-size: 9pt; }
  .ejes-mark { text-align: center; color: #7030A0; font-weight: bold; background: #f8f4ff; width: 40pt; }
  .ejes-num { color: #7030A0; font-weight: bold; width: 22pt; }

  /* NOMENCLATURA */
  .nom-tbl { width: 100%; border-collapse: collapse; margin-bottom: 8pt; font-size: 8.5pt; }
  .nom-tbl td { border: 1pt solid #4472C4; padding: 4pt 6pt; }

  /* FOOTER */
  .page-footer {
    position: fixed; bottom: 0; left: 0; right: 0;
    padding: 6pt 1.6cm 4pt;
    background: white;
  }
  .footer-bar {
    height: 5pt;
    background: linear-gradient(90deg, #C9A820 0%, #e8c840 50%, #C9A820 100%);
    margin-top: 4pt; border-radius: 2pt;
  }
  .footer-logos {
    display: flex; justify-content: center; align-items: center;
    gap: 24pt; padding-bottom: 4pt;
  }
  .footer-sepe { display: flex; align-items: center; gap: 6pt; }
  .footer-uset { text-align: left; }
  .footer-qr { position: absolute; left: 1.6cm; bottom: 12pt; }

  /* SECTION SPACING */
  .section { margin-bottom: 12pt; }
  .mt { margin-top: 10pt; }

  /* APRENDIZAJES */
  .aprendizaje-item { padding: 3pt 0 3pt 10pt; border-left: 3pt solid #5a9e44; margin-bottom: 4pt; font-size: 9pt; }

  /* EVALUACION */
  .eval-section { background: #f8f4ff; border: 1pt solid #4472C4; border-radius: 3pt; padding: 8pt; margin-bottom: 8pt; }
  .eval-title { color: #7030A0; font-weight: bold; font-size: 10pt; margin-bottom: 5pt; }

  /* GAMIFICACION */
  .gami-box { background: #eff6ff; border: 1.5pt solid #93c5fd; border-radius: 4pt; padding: 8pt; margin-bottom: 8pt; }
  .sust-box { background: #f0fdf4; border: 1.5pt solid #86efac; border-radius: 4pt; padding: 8pt; margin-bottom: 8pt; }
</style>
</head>
<body>

${watermark}

<!-- ═══════════════════════════ PÁGINA 1: DATOS GENERALES ═══════════════════════════ -->
<div class="page content page-break">
  ${header}

  <div class="section">
    <div class="banner-green">Plano Didáctico de ${form.disciplina} correspondiente al Ciclo Escolar 2025 – 2026</div>
  </div>

  <table class="tbl">
    <tr>
      <td class="lbl" style="width:30%">Escuela: ${form.escuela}</td>
      <td class="val" colspan="2" style="width:70%">CCT: ${form.cct || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</td>
    </tr>
    <tr>
      <td class="lbl">Zona Escolar: ${form.zonaEscolar || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</td>
      <td class="lbl" style="width:20%">Turno: ${form.turno}</td>
      <td class="lbl">Localidad: ${form.municipio}, ${form.estado}</td>
    </tr>
    <tr>
      <td class="lbl">Grados y Grupos: ${form.grado} – ${form.grupoAlumnos ? form.grupoAlumnos+' alumnos' : ''}</td>
      <td class="lbl" colspan="2">Nombre del docente: ${form.docente}</td>
    </tr>
  </table>

  <table class="tbl">
    <tr>
      <td class="lbl">Periodo de Aplicación:</td>
      <td class="val">${plan.periodoAplicacion || 'Ciclo Escolar 2025-2026'}</td>
    </tr>
  </table>

  <div class="section mt">
    <div class="banner-green" style="margin-bottom:0">Plano Didáctico</div>
  </div>
</div>

<!-- ═══════════════════════════ PÁGINA 2: GENERALIDADES + EJES ═══════════════════════════ -->
<div class="page content page-break">
  ${header}

  <table class="tbl" style="margin-bottom:10pt">
    <tr>
      <td class="tbl-header" colspan="3">Generalidades (Estructura General del Proyecto)</td>
    </tr>
    <tr>
      <td class="lbl" style="width:18%">Situación-Problema</td>
      <td class="val" colspan="2">${plan.situacionProblema || form.problematica}</td>
    </tr>
    <tr>
      <td class="lbl">Escenario</td>
      <td class="val" style="width:28%">(${plan.escenario==='Aula'?'✓':'&nbsp;&nbsp;'}) Aula</td>
      <td class="val" style="width:27%">(&nbsp;&nbsp;) Escolar</td>
    </tr>
    <tr>
      <td class="lbl">Nombre del Proyecto</td>
      <td class="val" colspan="2">${plan.nombreProyecto || ''}</td>
    </tr>
    <tr>
      <td class="lbl">Metodología</td>
      <td class="val" colspan="2">${form.metodologia}</td>
    </tr>
    <tr>
      <td class="lbl">Producto</td>
      <td class="val" colspan="2">${plan.producto || ''}</td>
    </tr>
  </table>

  <table class="ejes-tbl">
    <tr>
      <td class="tbl-subheader" style="width:40pt">Marcar</td>
      <td class="tbl-subheader" colspan="2">Ejes Articuladores</td>
    </tr>
    ${ejesTodos.map(e=>`
    <tr>
      <td class="ejes-mark">(${e.marcado?'✓':'&nbsp;&nbsp;&nbsp;'})</td>
      <td class="ejes-num">${e.num}.</td>
      <td style="font-size:9pt;padding:4pt 7pt">${e.nombre}</td>
    </tr>`).join('')}
  </table>
</div>

<!-- ═══════════════════════════ PÁGINA 3: CONTENIDO + PDA ═══════════════════════════ -->
<div class="page content page-break">
  ${header}

  <table class="tbl" style="margin-bottom:10pt">
    <tr><td class="tbl-header">Contenido</td></tr>
    <tr><td class="val" style="min-height:60pt;padding:10pt">${(plan.contenido||form.contenido).replace(/\n/g,'<br>')}</td></tr>
    <tr><td class="tbl-header">Procesos de Desarrollo de Aprendizaje (PDA)</td></tr>
    <tr><td class="val" style="min-height:80pt;padding:10pt">${(plan.pda||form.pda).replace(/\n/g,'<br>')}</td></tr>
  </table>

  <div class="section mt">
    <div class="banner-green" style="margin-bottom:0">Campo Formativo: ${form.campo} &nbsp;|&nbsp; Eje Articulador: ${form.eje}</div>
  </div>
</div>

<!-- ═══════════════════════════ PÁGINA 4: NOMENCLATURA + ESTRATEGIA ═══════════════════════════ -->
<div class="page content page-break">
  ${header}

  <table class="nom-tbl">
    <tr><td class="tbl-subheader" colspan="7">Nomenclatura del tipo de Actividades</td></tr>
    <tr>
      <td><strong>C</strong> – Contenido</td>
      <td><strong>EV</strong> – Evaluación</td>
      <td><strong>F1</strong> – Fase 1</td>
      <td><strong>F2</strong> – Fase 2</td>
      <td><strong>F3</strong> – Fase 3</td>
      <td><strong>F4</strong> – Fase 4</td>
      <td><strong>F5</strong> – Fase 5</td>
    </tr>
  </table>

  <table class="nom-tbl" style="margin-bottom:12pt">
    <tr><td class="tbl-subheader" colspan="9">Nomenclatura del Proceso de Evaluación Formativa</td></tr>
    <tr>
      <td><strong>MO</strong> – Motivar y Orientar</td>
      <td><strong>ES</strong> – Establecer y Socializar criterios</td>
      <td><strong>E</strong> – Explorar</td>
      <td><strong>M</strong> – Monitoreo</td>
      <td><strong>C</strong> – Control</td>
      <td><strong>RL</strong> – Resaltar Logros</td>
      <td><strong>PA</strong> – Promover Autoevaluación</td>
      <td><strong>PC</strong> – Promover Coevaluación</td>
      <td><strong>R</strong> – Retroalimentación</td>
    </tr>
  </table>

  <table class="strat-table">
    <tr>
      <th rowspan="2" style="width:28pt">Periodo lectivo<br>(Sesiones)</th>
      <th colspan="3">Actividades</th>
      <th rowspan="2" style="width:10%">Forma de<br>trabajo</th>
      <th rowspan="2" style="width:14%">Materiales</th>
    </tr>
    <tr>
      <th style="width:28pt">Tipo</th>
      <th style="width:42%">Descripción</th>
      <th style="width:12%">Proceso de Evaluación Formativa</th>
    </tr>
    ${sessionRows}
  </table>
</div>

<!-- ═══════════════════════════ PÁGINA 5: EVALUACIÓN ═══════════════════════════ -->
<div class="page content page-break">
  ${header}

  <div class="banner-purple" style="margin-bottom:10pt">Estrategia de Evaluación Integral</div>

  <div class="eval-section">
    <div class="eval-title">📋 Evaluación Diagnóstica</div>
    <p style="font-size:9pt;line-height:1.6">${(plan.evaluacion?.diagnostica||'').replace(/\n/g,'<br>')}</p>
  </div>

  <div class="eval-section">
    <div class="eval-title">📊 Evaluación Formativa</div>
    <p style="font-size:9pt;line-height:1.6">${(plan.evaluacion?.formativa||'').replace(/\n/g,'<br>')}</p>
  </div>

  ${rubricRows ? `
  <div class="banner-green" style="margin-bottom:6pt;font-size:10pt">Rúbrica de Evaluación Sumativa</div>
  <table class="tbl" style="font-size:8pt">
    <tr>
      <th style="background:#7030A0;color:white;padding:5pt;border:1pt solid #4472C4;width:18%">Criterio</th>
      <th style="background:#2e7d32;color:white;padding:5pt;border:1pt solid #4472C4">Excelente (4)</th>
      <th style="background:#f9a825;color:white;padding:5pt;border:1pt solid #4472C4">Satisfactorio (3)</th>
      <th style="background:#e65100;color:white;padding:5pt;border:1pt solid #4472C4">En desarrollo (2)</th>
      <th style="background:#c62828;color:white;padding:5pt;border:1pt solid #4472C4">Insuficiente (1)</th>
    </tr>
    ${rubricRows}
  </table>
  ` : ''}
</div>

<!-- ═══════════════════════════ PÁGINA 6: EXTRAS + FUNDAMENTACIÓN ═══════════════════════════ -->
<div class="page content">
  ${header}

  ${plan.gamificacion ? `
  <div class="banner-blue" style="margin-bottom:8pt">🎮 Estrategia de Gamificación</div>
  <div class="gami-box">
    <p style="font-size:9pt;margin-bottom:6pt"><strong>Sistema de puntos:</strong> ${plan.gamificacion.sistema}</p>
    <p style="font-size:9pt;margin-bottom:4pt"><strong>Insignias:</strong></p>
    ${(plan.gamificacion.insignias||[]).map((ins,i)=>`<div class="aprendizaje-item">🏅 ${ins}</div>`).join('')}
    <p style="font-size:9pt;margin-top:6pt;margin-bottom:4pt"><strong>Retos opcionales:</strong></p>
    ${(plan.gamificacion.retos||[]).map((r,i)=>`<div class="aprendizaje-item">⚡ ${r}</div>`).join('')}
  </div>
  ` : ''}

  ${plan.sustentabilidad ? `
  <div class="banner-green" style="margin-bottom:8pt">♻️ Educación Ambiental y Sustentabilidad</div>
  <div class="sust-box">
    <p style="font-size:9pt;margin-bottom:6pt"><strong>Materiales reciclados:</strong> ${plan.sustentabilidad.materiales}</p>
    <p style="font-size:9pt;margin-bottom:6pt"><strong>Actividad ambiental:</strong> ${plan.sustentabilidad.actividad}</p>
    <p style="font-size:9pt"><strong>Vinculación con ODS:</strong> ${plan.sustentabilidad.ods}</p>
  </div>
  ` : ''}

  <div class="section">
    <div class="banner-purple" style="margin-bottom:6pt">Fundamentación Curricular</div>
    <div style="background:#f9f9f9;border:1pt solid #ccc;border-radius:3pt;padding:8pt;font-size:9pt;line-height:1.7">
      ${(plan.fundamentacion||'').replace(/\n/g,'<br>')}
    </div>
  </div>

  <div class="section">
    <div class="banner-green" style="margin-bottom:6pt">Notas Adicionales / Adecuaciones Curriculares</div>
    <div style="border:1pt solid #4472C4;border-radius:3pt;padding:8pt;min-height:50pt;font-size:9pt">
      ${form.notasExtra||'Sin adecuaciones curriculares específicas indicadas.'}
    </div>
  </div>

  <div style="margin-top:20pt;text-align:center;font-size:8pt;color:#888;border-top:1pt solid #e2e8f0;padding-top:8pt">
    ⚠️ Documento generado con apoyo de Inteligencia Artificial como herramienta pedagógica. 
    El docente es responsable de su revisión, adaptación y aplicación. · SEP · NEM 2022
  </div>
</div>

${footer}

</body>
</html>`;
}

// ── Welcome Screen ─────────────────────────────────────────────────────────────
function WelcomeScreen({onStart}) {
  const [hover, setHover] = useState(false);
  const features = [
    {icon:"🎓",text:"Plan de Estudios NEM 2022"},
    {icon:"🤖",text:"IA Gemini 1.5 Flash"},
    {icon:"📄",text:"PDF con formato SEPE Tlaxcala"},
    {icon:"⚡",text:"Planeaciones ultra-detalladas"},
  ];
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
        <div style={{fontSize:"3.8rem",marginBottom:"1.2rem",display:"inline-block",filter:"drop-shadow(0 6px 12px rgba(0,0,0,0.25))"}}>📋</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2.4rem",fontWeight:800,
          color:"white",lineHeight:1.15,marginBottom:"0.5rem"}}>
          Asistente Pedagógico <span style={{color:"#93c5fd"}}>NEM</span>
        </h1>
        <p style={{fontSize:"0.95rem",color:"#bfdbfe",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.5rem"}}>
          Nueva Escuela Mexicana · Diseño Curricular con IA
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",
          background:"rgba(255,255,255,0.13)",borderRadius:"9999px",padding:"0.4rem 1.2rem",marginBottom:"2.2rem"}}>
          <span style={{fontSize:"0.78rem",color:"#e0f2fe",fontFamily:"'DM Sans',sans-serif"}}>
            👨‍🏫 {init.docente}
          </span>
        </div>
        <p style={{color:"#dbeafe",fontSize:"0.9rem",lineHeight:1.8,fontFamily:"'DM Sans',sans-serif",
          marginBottom:"2.5rem",maxWidth:490,margin:"0 auto 2.5rem"}}>
          Genera planeaciones didácticas <strong style={{color:"#93c5fd"}}>completas y detalladas</strong> con el formato oficial <strong style={{color:"#93c5fd"}}>SEPE – USET Tlaxcala</strong>, listas para imprimir y entregar.
        </p>
        <button onClick={onStart}
          onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
          style={{background:"white",color:"#1d4ed8",border:"none",padding:"1rem 3rem",
            borderRadius:"1rem",cursor:"pointer",fontSize:"1rem",fontWeight:700,
            fontFamily:"'DM Sans',sans-serif",
            boxShadow:hover?"0 16px 35px rgba(0,0,0,0.28)":"0 8px 20px rgba(0,0,0,0.2)",
            transform:hover?"translateY(-2px)":"translateY(0)",transition:"all 0.18s"}}>
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
        border:"1px solid #e2e8f0",boxShadow:"0 1px 8px rgba(0,0,0,0.05)",textAlign:"center"}}>
        <p style={{fontSize:"0.72rem",color:"#64748b",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7}}>
          🏛️ <strong style={{color:"#1e3a8a"}}>Formato oficial</strong> DEPARTAMENTO DE EDUCACIÓN SECUNDARIA GENERAL · JEFATURAS DE ENSEÑANZA · SEPE · USET Tlaxcala
        </p>
      </div>
    </div>
  );
}

// ── Result View ────────────────────────────────────────────────────────────────
function ResultView({result, planData, form, onNew}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(()=>{
    navigator.clipboard.writeText(result).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  },[result]);

  const handlePrint = ()=>{
    const html = generateFormatHTML(form, planData);
    const w = window.open("","_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(()=>{w.focus();w.print();},1000);
  };

  return (
    <div style={{maxWidth:820,margin:"0 auto",padding:"1.5rem 1rem 3rem"}}>
      <div style={{
        background:"linear-gradient(135deg,#065f46,#059669)",
        borderRadius:"1.25rem",padding:"1.5rem 1.75rem",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",
        boxShadow:"0 12px 30px rgba(5,150,105,0.3)",marginBottom:"1.25rem",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <span style={{fontSize:"2rem"}}>✅</span>
          <div>
            <p style={{color:"#ecfdf5",fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.09em",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.15rem"}}>Lista para exportar</p>
            <h2 style={{color:"white",fontSize:"1.2rem",fontFamily:"'Playfair Display',serif",fontWeight:700}}>Planeación Generada con IA</h2>
          </div>
        </div>
        <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
          <button onClick={handlePrint} style={{
            padding:"0.65rem 1.4rem",borderRadius:"0.625rem",cursor:"pointer",
            background:"white",border:"none",color:"#065f46",
            fontWeight:700,fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif",
            boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
          }}>
            🖨️ Exportar PDF (Formato SEPE)
          </button>
          <button onClick={handleCopy} style={{
            padding:"0.65rem 1.2rem",borderRadius:"0.625rem",cursor:"pointer",
            background:copied?"white":"rgba(255,255,255,0.2)",border:"none",
            color:copied?"#059669":"white",fontWeight:700,fontSize:"0.82rem",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            {copied?"✓ Copiado":"📋 Copiar texto"}
          </button>
          <button onClick={onNew} style={{
            padding:"0.65rem 1.1rem",borderRadius:"0.625rem",cursor:"pointer",
            background:"rgba(255,255,255,0.15)",border:"1.5px solid rgba(255,255,255,0.3)",
            color:"white",fontWeight:700,fontSize:"0.82rem",fontFamily:"'DM Sans',sans-serif",
          }}>
            ＋ Nueva
          </button>
        </div>
      </div>

      {/* Badge de formato */}
      <div style={{background:"#eff6ff",border:"1.5px solid #93c5fd",borderRadius:"0.75rem",
        padding:"0.75rem 1rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
        <span style={{fontSize:"1.4rem"}}>📄</span>
        <div>
          <p style={{fontSize:"0.8rem",fontWeight:700,color:"#1d4ed8",fontFamily:"'DM Sans',sans-serif"}}>PDF con Formato Oficial SEPE – USET Tlaxcala</p>
          <p style={{fontSize:"0.72rem",color:"#475569",fontFamily:"'DM Sans',sans-serif"}}>
            El PDF incluye: encabezado institucional, logos, datos del docente, generalidades, ejes articuladores, contenido, PDA, tabla de estrategia por sesión, rúbrica de evaluación y fundamentación.
          </p>
        </div>
      </div>

      <div style={{background:"white",borderRadius:"1.25rem",
        boxShadow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{background:"#1e293b",padding:"0.65rem 1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
          {["#ef4444","#f59e0b","#22c55e"].map((c,i)=>(
            <span key={i} style={{width:"0.65rem",height:"0.65rem",borderRadius:"9999px",background:c,display:"inline-block"}}/>
          ))}
          <span style={{color:"#94a3b8",fontSize:"0.72rem",fontFamily:"monospace",marginLeft:"0.5rem"}}>
            planeacion_{(form.disciplina||"nem").toLowerCase().replace(/\s+/g,"_")}.json → html → pdf
          </span>
        </div>
        <div style={{padding:"1.5rem 2rem",maxHeight:"55vh",overflowY:"auto"}}>
          <pre style={{fontFamily:"'Courier New',monospace",fontSize:"0.78rem",lineHeight:1.7,
            color:"#1e293b",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
            {result}
          </pre>
        </div>
      </div>
      <p style={{textAlign:"center",fontSize:"0.68rem",color:"#94a3b8",marginTop:"1rem",fontFamily:"'DM Sans',sans-serif"}}>
        ⚠️ Documento de apoyo pedagógico · Revisión docente obligatoria antes de aplicar · Formato SEPE USET Tlaxcala
      </p>
    </div>
  );
}

// ── App Principal ──────────────────────────────────────────────────────────────
const LOAD_MSGS = [
  "Analizando contexto pedagógico…",
  "Diseñando secuencia de sesiones…",
  "Redactando actividades con ejemplos…",
  "Construyendo rúbricas de evaluación…",
  "Estructurando datos en formato SEPE…",
  "Finalizando planeación completa…",
];

export default function AsistenteNEM() {
  const [screen,   setScreen]   = useState("welcome");
  const [step,     setStep]     = useState(1);
  const [form,     setForm]     = useState(init);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [loadMsg,  setLoadMsg]  = useState("");
  const [result,   setResult]   = useState("");
  const [planData, setPlanData] = useState(null);

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

    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
        {method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            contents:[{parts:[{text:buildJsonPrompt(form)}]}],
            generationConfig:{temperature:0.6,maxOutputTokens:8192},
          })}
      );
      const data = await res.json();
      const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setResult(raw);
      // Parse JSON
      try {
        const clean = raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
        const parsed = JSON.parse(clean);
        setPlanData(parsed);
      } catch(parseErr) {
        // Try to extract JSON from within text
        const match = raw.match(/\{[\s\S]*\}/);
        if(match) {
          try { setPlanData(JSON.parse(match[0])); } catch(_) { setPlanData(null); }
        } else {
          setPlanData(null);
        }
      }
    } catch(e) {
      setResult("❌ Error de conexión con Gemini:\n"+e.message);
      setPlanData(null);
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
      <nav style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(226,232,240,0.9)",
        padding:"0.85rem 1.5rem",display:"flex",alignItems:"center",gap:"0.9rem",
        position:"sticky",top:0,zIndex:100}}>
        <div style={{width:"2.1rem",height:"2.1rem",borderRadius:"0.5rem",
          background:"linear-gradient(135deg,#1d4ed8,#0369a1)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>📋</div>
        <div>
          <p style={{fontSize:"0.88rem",fontWeight:800,color:"#1e3a8a",lineHeight:1}}>Asistente Pedagógico NEM</p>
          <p style={{fontSize:"0.62rem",color:"#64748b",marginTop:"0.1rem"}}>Formato SEPE · USET Tlaxcala · NEM 2022</p>
        </div>
        {screen==="form"&&!loading&&(
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"0.4rem"}}>
            <span style={{fontSize:"0.68rem",color:"#94a3b8",marginRight:"0.3rem"}}>{step}/{STEPS.length}</span>
            {STEPS.map(s=>(
              <div key={s.id} style={{width:"0.45rem",height:"0.45rem",borderRadius:"9999px",
                background:step>=s.id?"#1d4ed8":"#e2e8f0",transition:"background 0.2s"}}/>
            ))}
          </div>
        )}
      </nav>

      {screen==="welcome" && <WelcomeScreen onStart={()=>setScreen("form")}/>}

      {screen==="form"&&!loading&&(
        <div style={{maxWidth:700,margin:"0 auto",padding:"2rem 1rem"}}>
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
                  cursor:step===1?"default":"pointer",opacity:step===1?0:1,transition:"all 0.15s"}}>
                ← Anterior
              </button>
              {step<5?(
                <button onClick={goNext}
                  style={{padding:"0.75rem 2.2rem",borderRadius:"0.875rem",border:"none",
                    background:`linear-gradient(135deg,${sd.color},${sd.color}c0)`,
                    color:"white",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",
                    boxShadow:`0 6px 20px ${sd.color}45`,transition:"all 0.18s"}}
                  onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.target.style.transform="none";}}>
                  Siguiente →
                </button>
              ):(
                <button onClick={handleGenerate}
                  style={{display:"flex",alignItems:"center",gap:"0.5rem",
                    padding:"0.8rem 2rem",borderRadius:"0.875rem",border:"none",
                    background:"linear-gradient(135deg,#059669,#0d9488)",
                    color:"white",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",
                    boxShadow:"0 6px 20px rgba(5,150,105,0.4)"}}>
                  <span>✨</span> Generar Planeación con IA
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {screen==="form"&&loading&&(
        <div style={{maxWidth:480,margin:"5rem auto",padding:"0 1rem",textAlign:"center"}}>
          <div style={{background:"white",borderRadius:"1.5rem",
            boxShadow:"0 20px 60px rgba(0,0,0,0.1)",padding:"3rem 2.5rem",border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:"3rem",marginBottom:"1.4rem",display:"inline-block",animation:"spin 3s linear infinite"}}>⚙️</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",color:"#1e3a8a",marginBottom:"0.6rem"}}>
              Generando planeación…
            </h3>
            <p style={{color:"#64748b",fontSize:"0.84rem",marginBottom:"2rem",minHeight:"1.3rem"}}>{loadMsg}</p>
            <div style={{height:"0.3rem",background:"#f1f5f9",borderRadius:"9999px",overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,#1d4ed8,#059669,transparent)",
                animation:"bar 2s ease-in-out infinite"}}/>
            </div>
            <p style={{fontSize:"0.68rem",color:"#94a3b8",marginTop:"1.2rem"}}>
              Generando JSON estructurado para formato SEPE Tlaxcala · 20–45 seg
            </p>
          </div>
        </div>
      )}

      {screen==="result"&&(
        <ResultView result={result} planData={planData} form={form}
          onNew={()=>{setScreen("welcome");setStep(1);setForm(init);setResult("");setPlanData(null);}}/>
      )}
    </div>
  );
}
