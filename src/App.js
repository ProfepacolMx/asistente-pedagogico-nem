import { useState, useCallback } from "react";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Patrick+Hand&family=DM+Sans:wght@400;500;600;700&display=swap";
document.head.appendChild(fl);

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id:1, label:"Datos del Docente",  icon:"👤", color:"#1d4ed8" },
  { id:2, label:"Contexto Académico", icon:"🏫", color:"#0369a1" },
  { id:3, label:"Currícula NEM",      icon:"📚", color:"#0f766e" },
  { id:4, label:"Estrategia",         icon:"🎯", color:"#7c3aed" },
  { id:5, label:"Plus",               icon:"✨", color:"#b45309" },
];
const CAMPOS = [
  { value:"Lenguajes",                        desc:"Comunicación, lectura y expresión creativa" },
  { value:"Saberes y Pensamiento Científico", desc:"Matemáticas, ciencias, tecnología, STEAM" },
  { value:"Ética, Naturaleza y Sociedades",   desc:"Historia, geografía, formación cívica" },
  { value:"De lo Humano y lo Comunitario",    desc:"Arte, cultura física, socioemocional" },
];
const METODOLOGIAS = [
  { value:"Proyecto de Aula (NEM)",                       icon:"🏗️" },
  { value:"Aprendizaje Basado en Problemas (ABP)",         icon:"🔍" },
  { value:"Aprendizaje Basado en Indagación (STEAM)",      icon:"🔬" },
  { value:"Aula Invertida",                                icon:"🔄" },
  { value:"Aprendizaje Basado en el Servicio",             icon:"🤝" },
  { value:"Aprendizaje Cooperativo",                       icon:"👥" },
];
const EJES = [
  "Inclusión","Pensamiento crítico","Interculturalidad crítica",
  "Igualdad de género","Vida saludable",
  "Apropiación de las culturas a través de la lectura y la escritura",
  "Artes y experiencias estéticas",
];
const NIVELES = ["Preescolar","Primaria","Secundaria","Media Superior","Superior"];
const GRADOS  = ["1°","2°","3°","4°","5°","6°"];
const REQUIRED = {
  1:["docente","escuela","municipio","estado"],
  2:["nivel","grado","disciplina","problematica"],
  3:["campo","eje","contenido","pda"],
  4:["metodologia","materiales"],
  5:[],
};
const LABELS = {
  docente:"nombre del docente",escuela:"nombre de la escuela",
  municipio:"municipio",estado:"estado",nivel:"nivel educativo",
  grado:"grado",disciplina:"disciplina",problematica:"problemática",
  campo:"campo formativo",eje:"eje articulador",contenido:"contenido",
  pda:"PDA",metodologia:"metodología",materiales:"materiales",
};
const INIT = {
  docente:"Dr. Francisco De Jesús Luna Benítez",escuela:"",cct:"",
  municipio:"",estado:"Tlaxcala",zonaEscolar:"",turno:"Matutino",
  nivel:"Secundaria",grado:"",disciplina:"",grupoAlumnos:"",problematica:"",
  campo:"",eje:"",contenido:"",pda:"",
  metodologia:"",sesiones:"6",duracion:"50",materiales:"",
  gamificacion:false,reciclaje:false,notasExtra:"",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
function useFocus(){const[f,s]=useState(false);return[f,{onFocus:()=>s(true),onBlur:()=>s(false)}];}
const iStyle=(f,e)=>({
  width:"100%",padding:"0.68rem 0.9rem",borderRadius:"0.6rem",
  fontSize:"0.875rem",color:"#1e293b",outline:"none",
  transition:"all 0.18s",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",
  border:`1.5px solid ${e?"#fca5a5":f?"#3b82f6":"#e2e8f0"}`,
  background:f?"#f8fbff":"#f8fafc",boxShadow:f?"0 0 0 3px #dbeafe":"none",
});
function Input({value,onChange,placeholder,type="text",error}){
  const[f,fx]=useFocus();
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...fx} style={iStyle(f,error)}/>;
}
function Textarea({value,onChange,placeholder,rows=3,error}){
  const[f,fx]=useFocus();
  return <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} {...fx}
    style={{...iStyle(f,error),resize:"vertical",lineHeight:1.65}}/>;
}
function Select({value,onChange,options,error}){
  const[f,fx]=useFocus();
  return(
    <select value={value} onChange={onChange} {...fx} style={iStyle(f,error)}>
      <option value="">— Seleccionar —</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function Field({label,hint,required,error,children}){
  return(
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

// ─── Step panels ──────────────────────────────────────────────────────────────
function Step1({form,upd,errors}){
  const u=k=>e=>upd(k,e.target.value);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1.4rem"}}>
      <div style={{gridColumn:"1/-1"}}>
        <Field label="Nombre completo del docente" required error={errors.docente}>
          <Input value={form.docente} onChange={u("docente")} error={errors.docente}/>
        </Field>
      </div>
      <Field label="Nombre de la escuela" required error={errors.escuela}>
        <Input value={form.escuela} onChange={u("escuela")} placeholder="Ej. Sec. Gral. 'Mariano Matamoros'" error={errors.escuela}/>
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
function Step2({form,upd,errors}){
  const u=k=>e=>upd(k,e.target.value);
  return(
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
function Step3({form,upd,errors}){
  const u=k=>e=>upd(k,e.target.value);
  return(
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
      <Field label="PDA — Proceso de Desarrollo del Aprendizaje" required hint="Del libro de planes SEP" error={errors.pda}>
        <Textarea value={form.pda} onChange={u("pda")} rows={3} error={errors.pda}
          placeholder="Ej. Reconoce y aplica fracciones en situaciones de la vida cotidiana…"/>
      </Field>
    </div>
  );
}
function Step4({form,upd,errors}){
  const u=k=>e=>upd(k,e.target.value);
  return(
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
function Step5({form,upd}){
  const u=k=>e=>upd(k,e.target.value);
  const opts=[
    {key:"gamificacion",icon:"🎮",title:"Gamificación educativa",
     desc:"Sistema de puntos, insignias y retos para motivar la participación activa.",
     on:"#1d4ed8",bg:"#eff6ff",br:"#93c5fd",tbg:"#3b82f6"},
    {key:"reciclaje",icon:"♻️",title:"Sustentabilidad y reciclaje",
     desc:"Materiales reciclados y vinculación con educación ambiental y ODS.",
     on:"#065f46",bg:"#f0fdf4",br:"#86efac",tbg:"#22c55e"},
  ];
  return(
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

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(step,form){
  const err={};
  (REQUIRED[step]||[]).forEach(k=>{
    if(!form[k]||!form[k].toString().trim()) err[k]=`El campo "${LABELS[k]}" es obligatorio.`;
  });
  return err;
}

// ─── ULTRA-DETAILED JSON PROMPT ───────────────────────────────────────────────
function buildPrompt(f){
  return`
Eres un especialista de élite en diseño curricular de la Nueva Escuela Mexicana (NEM), con doctorado en pedagogía crítica y 20 años de experiencia en educación secundaria en México.

MISIÓN: Generar una planeación didáctica EXHAUSTIVA, EJEMPLIFICADA y LISTA PARA USAR. Cada sesión debe ser tan detallada que un docente sustituto pueda impartirla sin preparación adicional.

DATOS:
Docente: ${f.docente} | Escuela: ${f.escuela} | CCT: ${f.cct||"N/A"}
Zona: ${f.zonaEscolar||"N/A"} | Turno: ${f.turno} | Ubicación: ${f.municipio}, ${f.estado}
Nivel: ${f.nivel} | Grado: ${f.grado} | Disciplina: ${f.disciplina} | Alumnos: ${f.grupoAlumnos||"N/A"}
Campo: ${f.campo} | Eje: ${f.eje} | Contenido: ${f.contenido}
PDA: ${f.pda}
Metodología: ${f.metodologia} | Sesiones: ${f.sesiones} × ${f.duracion} min
Materiales: ${f.materiales}
Problemática: ${f.problematica}
Gamificación: ${f.gamificacion?"SÍ":"NO"} | Sustentabilidad: ${f.reciclaje?"SÍ":"NO"}
Notas: ${f.notasExtra||"Ninguna"}

INSTRUCCIÓN CRÍTICA: Responde ÚNICAMENTE con JSON válido. Cero texto antes o después. Cero markdown. Cero backticks. Solo el objeto JSON.

REGLAS DE CONTENIDO POR SESIÓN (OBLIGATORIAS SIN EXCEPCIÓN):
- inicio: MÍNIMO 300 palabras. Incluye: nombre de la actividad de apertura, instrucciones textuales paso a paso, EXACTAMENTE 5 preguntas detonadoras entrecomilladas y numeradas, descripción de cómo se activan saberes previos con un ejemplo real del tema, organización del espacio físico del aula.
- desarrollo: MÍNIMO 500 palabras. Incluye: nombre de la estrategia central, instrucciones textuales que el docente puede leer directamente, MÍNIMO 3 ejemplos resueltos con números/datos reales del tema (no genéricos), descripción detallada de la dinámica por equipos o individual, roles específicos de cada integrante, cómo el docente circula y monitorea, preguntas de andamiaje que el docente hace durante el recorrido, producto intermedio que se genera.
- cierre: MÍNIMO 200 palabras. Incluye: actividad de síntesis con instrucciones, EXACTAMENTE 3 preguntas metacognitivas entrecomilladas, descripción del producto/evidencia que queda de la sesión, instrucción de tarea o extensión con ejemplos concretos.
- CADA SESIÓN debe tener contenido ÚNICO y DIFERENTE a las demás, mostrando progresión pedagógica clara.
- descripcionCompleta: concatenación de inicio+desarrollo+cierre como texto corrido con subtítulos INICIO:, DESARROLLO:, CIERRE:

{
  "periodoAplicacion": "string",
  "situacionProblema": "string (4-5 oraciones detalladas contextualizando la problemática)",
  "escenario": "Aula",
  "nombreProyecto": "string (nombre creativo y pedagógico del proyecto)",
  "producto": "string (descripción concreta y detallada del producto final que elaborarán los alumnos)",
  "ejesSeleccionados": [números del 1 al 7 que aplican],
  "contenido": "string (descripción extendida del contenido disciplinar, 4-6 oraciones con enfoque NEM)",
  "pda": "string (PDA completo con interpretación pedagógica, 3-4 oraciones)",
  "aprendizajesEsperados": [
    "Cognitivo 1: texto detallado y medible",
    "Cognitivo 2: texto detallado y medible",
    "Cognitivo 3: texto detallado y medible",
    "Procedimental 1: texto detallado y medible",
    "Procedimental 2: texto detallado y medible",
    "Actitudinal 1: texto detallado y medible",
    "Actitudinal 2: texto detallado y medible"
  ],
  "sesiones": [
    {
      "numero": 1,
      "tipo": "F1",
      "titulo": "string (título creativo de la sesión)",
      "inicio": "string — MÍNIMO 300 palabras. Actividad de apertura con nombre, instrucciones paso a paso, 5 preguntas detonadoras textuales numeradas y entrecomilladas, cómo se activan saberes previos con ejemplo real del tema, organización del aula",
      "desarrollo": "string — MÍNIMO 500 palabras. Estrategia central con nombre, instrucciones textuales directas, 3 ejemplos resueltos con datos reales del tema, dinámica de equipos con roles, monitoreo docente, preguntas de andamiaje entrecomilladas, producto intermedio",
      "cierre": "string — MÍNIMO 200 palabras. Actividad de síntesis con instrucciones, 3 preguntas metacognitivas entrecomilladas, evidencia que queda, tarea con ejemplo concreto",
      "descripcionCompleta": "string — texto corrido: INICIO: [texto] DESARROLLO: [texto] CIERRE: [texto]",
      "evaluacionFormativa": "MO, ES, E",
      "formaTrabajo": "string",
      "materiales": "string"
    }
  ],
  "evaluacion": {
    "diagnostica": "string (instrumento completo con 5 preguntas o actividad concreta, instrucciones de aplicación e interpretación)",
    "formativa": "string (3 instrumentos distintos con criterios detallados: lista de cotejo con 8 indicadores, escala estimativa con 4 niveles, diario reflexivo con preguntas)",
    "rubrica": [
      { "criterio":"string", "excelente":"string (descriptor específico de 2-3 oraciones)", "satisfactorio":"string (descriptor específico de 2-3 oraciones)", "enDesarrollo":"string (descriptor específico de 2-3 oraciones)", "insuficiente":"string (descriptor específico de 2-3 oraciones)" },
      { "criterio":"string", "excelente":"string", "satisfactorio":"string", "enDesarrollo":"string", "insuficiente":"string" },
      { "criterio":"string", "excelente":"string", "satisfactorio":"string", "enDesarrollo":"string", "insuficiente":"string" },
      { "criterio":"string", "excelente":"string", "satisfactorio":"string", "enDesarrollo":"string", "insuficiente":"string" },
      { "criterio":"string", "excelente":"string", "satisfactorio":"string", "enDesarrollo":"string", "insuficiente":"string" }
    ],
    "autoevaluacion": "string (5 afirmaciones con escala 1-4 para que el alumno valore su proceso)"
  },
  "fundamentacion": "string (5-6 oraciones citando Plan de Estudios 2022 SEP, NEM, autores como Freire, Vygotsky, Ausubel, Morin y el marco curricular aplicable)",
  "gamificacion": ${f.gamificacion?`{
    "sistema": "string (tabla detallada: qué acciones dan puntos, cuántos puntos, cómo se acumulan)",
    "insignias": ["string insignia 1 con criterio","string insignia 2 con criterio","string insignia 3 con criterio","string insignia 4 con criterio","string insignia 5 con criterio","string insignia 6 con criterio"],
    "retos": ["string reto 1 con instrucciones","string reto 2 con instrucciones","string reto 3 con instrucciones"],
    "tablero": "string (descripción detallada de cómo se construye y actualiza el tablero en el aula)"
  }`:"null"},
  "sustentabilidad": ${f.reciclaje?`{
    "materiales": "string (lista detallada de materiales reciclados, cómo conseguirlos y prepararlos)",
    "actividad": "string (actividad completa de reflexión ambiental de 20 min integrada en la secuencia)",
    "ods": "string (vinculación específica con al menos 2 ODS de la Agenda 2030 con ejemplos concretos)"
  }`:"null"}
}
`.trim();
}

// ─── PDF HTML (SEPE Tlaxcala format) ─────────────────────────────────────────
function buildPdfHtml(form, plan){
  const ejesTodos = EJES.map((e,i)=>({num:i+1,nombre:e,marcado:plan.ejesSeleccionados&&plan.ejesSeleccionados.includes(i+1)}));

  const header=`
<div class="page-header">
  <div class="hdr-left">
    <svg width="90" height="72" viewBox="0 0 90 72" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="72" rx="3" fill="#f5f5f5"/>
      <circle cx="34" cy="37" r="13" fill="none" stroke="#7030A0" stroke-width="1.8"/>
      <circle cx="34" cy="22" r="4.5" fill="#7030A0"/><circle cx="34" cy="52" r="4.5" fill="#7030A0"/>
      <circle cx="19" cy="37" r="4.5" fill="#7030A0"/><circle cx="49" cy="37" r="4.5" fill="#7030A0"/>
      <circle cx="24" cy="26" r="3.5" fill="#C0A020"/><circle cx="44" cy="26" r="3.5" fill="#C0A020"/>
      <circle cx="24" cy="48" r="3.5" fill="#C0A020"/><circle cx="44" cy="48" r="3.5" fill="#C0A020"/>
      <circle cx="34" cy="37" r="5.5" fill="#7030A0"/>
      <text x="55" y="26" font-family="Arial Black" font-size="9.5" font-weight="900" fill="#4B0082">TLAXCALA</text>
      <text x="55" y="38" font-family="Arial" font-size="5.5" fill="#555">UNA NUEVA HISTORIA</text>
      <text x="55" y="48" font-family="Arial" font-size="5.5" fill="#555">2021 – 2027</text>
    </svg>
  </div>
  <div class="hdr-center">
    <p class="hdr-title">DEPARTAMENTO DE EDUCACIÓN SECUNDARIA GENERAL</p>
    <p class="hdr-sub">JEFATURAS DE ENSEÑANZA</p>
  </div>
  <div class="hdr-right">
    <div class="fivb">
      <p style="font-size:6.5pt;color:#333;line-height:1.3">Beach Volleyball<br><strong>World Championships</strong></p>
      <div style="background:#1a3c6e;color:white;padding:2px 5px;font-size:7.5pt;font-weight:bold;margin:2px 0;text-align:center">TLAXCALA 2023</div>
      <p style="font-size:7.5pt;font-weight:bold;color:#1a3c6e;text-align:center">FIVB</p>
    </div>
  </div>
</div>`;

  const footer=`
<div class="page-footer">
  <div class="f-qr">
    <svg width="38" height="38" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="white" stroke="#ccc" stroke-width="0.5"/>
      <rect x="2" y="2" width="16" height="16" fill="none" stroke="black" stroke-width="1.5"/>
      <rect x="5" y="5" width="10" height="10" fill="black"/>
      <rect x="22" y="2" width="16" height="16" fill="none" stroke="black" stroke-width="1.5"/>
      <rect x="25" y="5" width="10" height="10" fill="black"/>
      <rect x="2" y="22" width="16" height="16" fill="none" stroke="black" stroke-width="1.5"/>
      <rect x="5" y="25" width="10" height="10" fill="black"/>
      <rect x="22" y="22" width="5" height="5" fill="black"/><rect x="29" y="22" width="5" height="5" fill="black"/>
      <rect x="22" y="29" width="5" height="5" fill="black"/><rect x="29" y="29" width="5" height="5" fill="black"/>
    </svg>
  </div>
  <div class="f-logos">
    <div class="f-sepe">
      <svg width="28" height="28" viewBox="0 0 30 30"><circle cx="15" cy="15" r="11" fill="none" stroke="#4a7c3f" stroke-width="1.5"/>
      <circle cx="10" cy="12" r="2.8" fill="#4a7c3f"/><circle cx="20" cy="12" r="2.8" fill="#4a7c3f"/>
      <circle cx="15" cy="8" r="2.8" fill="#7030A0"/><circle cx="15" cy="20" r="2.8" fill="#7030A0"/></svg>
      <div><p style="font-size:10pt;font-weight:900;color:#4a7c3f;line-height:1">SEPE</p>
      <p style="font-size:4.5pt;color:#555;line-height:1.4">SECRETARÍA DE EDUCACIÓN<br>PÚBLICA DEL ESTADO</p></div>
    </div>
    <div class="f-uset">
      <p style="font-size:12pt;font-weight:900;color:#1a3c6e;line-height:1">USET</p>
      <p style="font-size:4.5pt;color:#555;line-height:1.4">UNIDAD DE SERVICIOS EDUCATIVOS<br>DEL ESTADO DE TLAXCALA</p>
    </div>
  </div>
  <div class="f-bar"></div>
</div>`;

  const wm=`<div class="watermark"><svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" opacity="0.055">
<g transform="translate(150,200)">
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(0)"/>
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(45)"/>
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(90)"/>
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(135)"/>
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(180)"/>
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(225)"/>
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(270)"/>
  <ellipse cx="0" cy="-85" rx="26" ry="68" fill="#7030A0" transform="rotate(315)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(22.5)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(67.5)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(112.5)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(157.5)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(202.5)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(247.5)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(292.5)"/>
  <ellipse cx="0" cy="-52" rx="16" ry="42" fill="#C0A020" transform="rotate(337.5)"/>
  <circle cx="0" cy="0" r="26" fill="#7030A0"/>
  <circle cx="0" cy="0" r="16" fill="#C0A020"/>
  <circle cx="0" cy="0" r="125" fill="none" stroke="#7030A0" stroke-width="2"/>
  <circle cx="0" cy="0" r="140" fill="none" stroke="#C0A020" stroke-width="1"/>
</g></svg></div>`;

  const sessionRows=(plan.sesiones||[]).map(s=>`
<tr class="sr">
  <td class="tn">${s.numero}</td>
  <td class="tt">${s.tipo||"F1"}</td>
  <td class="td">${(s.descripcionCompleta||"").replace(/\n/g,"<br>")}</td>
  <td class="te">${s.evaluacionFormativa||""}</td>
  <td class="tf">${s.formaTrabajo||""}</td>
  <td class="tm">${s.materiales||""}</td>
</tr>`).join("");

  const rubricRows=(plan.evaluacion?.rubrica||[]).map(r=>`
<tr>
  <td style="font-weight:bold;color:#7030A0;padding:4pt 5pt;border:1pt solid #4472C4;font-size:8pt">${r.criterio}</td>
  <td style="padding:4pt 5pt;border:1pt solid #4472C4;font-size:7.5pt;background:#e8f5e9">${r.excelente}</td>
  <td style="padding:4pt 5pt;border:1pt solid #4472C4;font-size:7.5pt;background:#fffde7">${r.satisfactorio}</td>
  <td style="padding:4pt 5pt;border:1pt solid #4472C4;font-size:7.5pt;background:#fff3e0">${r.enDesarrollo}</td>
  <td style="padding:4pt 5pt;border:1pt solid #4472C4;font-size:7.5pt;background:#fce4ec">${r.insuficiente}</td>
</tr>`).join("");

  return`<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<title>Plano Didáctico – ${form.escuela}</title>
<link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=IM+Fell+English&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Patrick Hand','Comic Sans MS',cursive;color:#1a1a1a;background:white;font-size:10pt}
@page{size:A4;margin:1.4cm 1.6cm 1.9cm 1.6cm}
.pb{page-break-after:always}
.watermark{position:fixed;right:-20pt;top:50%;transform:translateY(-50%);z-index:0;pointer-events:none}
.content{position:relative;z-index:1}
.page-header{display:flex;align-items:center;justify-content:space-between;padding-bottom:7pt;margin-bottom:9pt;border-bottom:2pt solid #C9A820}
.hdr-left{flex:0 0 auto}
.hdr-center{flex:1;text-align:center;padding:0 10pt}
.hdr-title{font-family:'IM Fell English','Palatino Linotype',serif;font-size:12pt;letter-spacing:.05em;line-height:1.4}
.hdr-sub{font-family:'IM Fell English','Palatino Linotype',serif;font-size:10.5pt;letter-spacing:.04em}
.hdr-right{flex:0 0 auto}
.fivb{border:1pt solid #ccc;padding:3pt 5pt;border-radius:3pt;text-align:center;min-width:85pt}
.page-footer{position:fixed;bottom:0;left:0;right:0;padding:5pt 1.6cm 3pt;background:white}
.f-bar{height:4.5pt;background:linear-gradient(90deg,#C9A820,#e8c840,#C9A820);margin-top:4pt;border-radius:2pt}
.f-logos{display:flex;justify-content:center;align-items:center;gap:22pt;padding-bottom:3pt}
.f-sepe{display:flex;align-items:center;gap:5pt}
.f-uset{text-align:left}
.f-qr{position:absolute;left:1.6cm;bottom:10pt}
.banner-g{background:#5a9e44;color:white;text-align:center;padding:4.5pt 8pt;font-weight:bold;font-size:10.5pt;border-radius:2pt}
.banner-b{background:#4472C4;color:white;text-align:center;padding:4.5pt 8pt;font-weight:bold;font-size:10.5pt;border-radius:2pt}
.banner-p{background:#7030A0;color:white;text-align:center;padding:4.5pt 8pt;font-weight:bold;font-size:10.5pt;border-radius:2pt}
.tbl{width:100%;border-collapse:collapse;margin-bottom:9pt}
.tbl td,.tbl th{border:1pt solid #4472C4;padding:4.5pt 6pt;vertical-align:top;font-family:'Patrick Hand',cursive;font-size:9pt;line-height:1.45}
.lbl{color:#7030A0;font-weight:bold;background:#f8f4ff;white-space:nowrap}
.th-g{background:#5a9e44;color:white;font-weight:bold;text-align:center;font-size:9.5pt;padding:4.5pt}
.th-b{background:#4472C4;color:white;font-weight:bold;text-align:center;font-size:8.5pt;padding:4pt}
.st{width:100%;border-collapse:collapse;margin-top:5pt;font-size:8pt}
.st th{background:#5a9e44;color:white;border:1pt solid #3a7e2a;padding:4.5pt 3.5pt;text-align:center;font-size:8pt;line-height:1.3}
.st td{border:1pt solid #4472C4;padding:4.5pt 3.5pt;vertical-align:top;line-height:1.5;font-size:7.5pt}
.tn{text-align:center;font-weight:bold;color:#7030A0;width:24pt}
.tt{text-align:center;width:24pt}
.td{width:42%}
.te{width:13%;font-size:7pt}
.tf{width:10%;font-size:7pt}
.tm{width:14%;font-size:7pt}
.sr:nth-child(even){background:#f7f7ff}
.ejes-tbl{width:55%;border-collapse:collapse;margin-bottom:9pt}
.ejes-tbl td{border:1pt solid #4472C4;padding:3.5pt 6pt;font-size:8.5pt}
.em{text-align:center;color:#7030A0;font-weight:bold;background:#f8f4ff;width:38pt}
.en{color:#7030A0;font-weight:bold;width:20pt}
.nom{width:100%;border-collapse:collapse;margin-bottom:7pt;font-size:8pt}
.nom td{border:1pt solid #4472C4;padding:3.5pt 5pt}
.sec{margin-bottom:11pt}
.ai{padding:3pt 0 3pt 9pt;border-left:2.5pt solid #5a9e44;margin-bottom:3.5pt;font-size:8.5pt}
.ev-box{background:#f8f4ff;border:1pt solid #4472C4;border-radius:3pt;padding:7pt;margin-bottom:7pt}
.ev-ttl{color:#7030A0;font-weight:bold;font-size:9.5pt;margin-bottom:4pt}
.gb{background:#eff6ff;border:1.5pt solid #93c5fd;border-radius:3pt;padding:7pt;margin-bottom:7pt}
.sb{background:#f0fdf4;border:1.5pt solid #86efac;border-radius:3pt;padding:7pt;margin-bottom:7pt}
.mt{margin-top:9pt}
</style></head><body>
${wm}

<!-- PÁG 1: DATOS GENERALES -->
<div class="content pb">
${header}
<div class="sec"><div class="banner-g">Plano Didáctico de ${form.disciplina} correspondiente al Ciclo Escolar 2025 – 2026</div></div>
<table class="tbl">
  <tr><td class="lbl" style="width:30%">Escuela: ${form.escuela}</td><td colspan="2">CCT: ${form.cct||""}</td></tr>
  <tr><td class="lbl">Zona Escolar: ${form.zonaEscolar||""}</td><td class="lbl" style="width:20%">Turno: ${form.turno}</td><td class="lbl">Localidad: ${form.municipio}, ${form.estado}</td></tr>
  <tr><td class="lbl">Grados y Grupos: ${form.grado}${form.grupoAlumnos?" – "+form.grupoAlumnos+" alumnos":""}</td><td colspan="2" class="lbl">Nombre del docente: ${form.docente}</td></tr>
</table>
<table class="tbl"><tr><td class="lbl" style="width:25%">Periodo de Aplicación:</td><td>${plan.periodoAplicacion||"Ciclo Escolar 2025-2026"}</td></tr></table>
<div class="mt"><div class="banner-g">Plano Didáctico</div></div>
${footer}
</div>

<!-- PÁG 2: GENERALIDADES + EJES -->
<div class="content pb">
${header}
<table class="tbl" style="margin-bottom:9pt">
  <tr><td class="th-g" colspan="3">Generalidades (Estructura General del Proyecto)</td></tr>
  <tr><td class="lbl" style="width:18%">Situación-Problema</td><td colspan="2">${plan.situacionProblema||form.problematica}</td></tr>
  <tr><td class="lbl">Escenario</td><td style="width:30%">(${plan.escenario==="Aula"?"✓":"&nbsp;&nbsp;"}) Aula</td><td>(&nbsp;&nbsp;) Escolar &nbsp;&nbsp; (&nbsp;&nbsp;) Comunitario</td></tr>
  <tr><td class="lbl">Nombre del Proyecto</td><td colspan="2">${plan.nombreProyecto||""}</td></tr>
  <tr><td class="lbl">Metodología</td><td colspan="2">${form.metodologia}</td></tr>
  <tr><td class="lbl">Producto</td><td colspan="2">${plan.producto||""}</td></tr>
</table>
<table class="ejes-tbl">
  <tr><td class="th-b" style="width:38pt">Marcar</td><td class="th-b" colspan="2">Ejes Articuladores</td></tr>
  ${ejesTodos.map(e=>`<tr><td class="em">(${e.marcado?"✓":"&nbsp;&nbsp;&nbsp;"})</td><td class="en">${e.num}.</td><td style="font-size:8.5pt;padding:3.5pt 6pt">${e.nombre}</td></tr>`).join("")}
</table>
${footer}
</div>

<!-- PÁG 3: CONTENIDO + PDA + APRENDIZAJES -->
<div class="content pb">
${header}
<table class="tbl" style="margin-bottom:9pt">
  <tr><td class="th-g">Contenido</td></tr>
  <tr><td style="padding:7pt;min-height:45pt">${(plan.contenido||form.contenido).replace(/\n/g,"<br>")}</td></tr>
  <tr><td class="th-g">Procesos de Desarrollo de Aprendizaje</td></tr>
  <tr><td style="padding:7pt;min-height:55pt">${(plan.pda||form.pda).replace(/\n/g,"<br>")}</td></tr>
</table>
<div class="sec">
  <div class="banner-p" style="margin-bottom:5pt">Aprendizajes Esperados</div>
  ${(plan.aprendizajesEsperados||[]).map((a,i)=>`<div class="ai"><strong>${i+1}.</strong> ${a}</div>`).join("")}
</div>
<div class="mt"><div class="banner-g">Campo Formativo: ${form.campo} &nbsp;|&nbsp; Eje Articulador: ${form.eje}</div></div>
${footer}
</div>

<!-- PÁG 4: NOMENCLATURA + ESTRATEGIA -->
<div class="content pb">
${header}
<table class="nom">
  <tr><td class="th-b" colspan="7">Nomenclatura del tipo de Actividades</td></tr>
  <tr><td><strong>C</strong> – Contenido</td><td><strong>EV</strong> – Evaluación</td><td><strong>F1</strong> – Fase 1</td><td><strong>F2</strong> – Fase 2</td><td><strong>F3</strong> – Fase 3</td><td><strong>F4</strong> – Fase 4</td><td><strong>F5</strong> – Fase 5</td></tr>
</table>
<table class="nom" style="margin-bottom:11pt">
  <tr><td class="th-b" colspan="9">Nomenclatura del Proceso de Evaluación Formativa</td></tr>
  <tr>
    <td><strong>MO</strong> – Motivar y Orientar</td><td><strong>ES</strong> – Establecer y Socializar</td>
    <td><strong>E</strong> – Explorar</td><td><strong>M</strong> – Monitoreo</td><td><strong>C</strong> – Control</td>
    <td><strong>RL</strong> – Resaltar Logros</td><td><strong>PA</strong> – Promover Autoevaluación</td>
    <td><strong>PC</strong> – Promover Coevaluación</td><td><strong>R</strong> – Retroalimentación</td>
  </tr>
</table>
<table class="st">
  <tr>
    <th rowspan="2" style="width:24pt">Periodo<br>lectivo</th>
    <th colspan="3">Actividades</th>
    <th rowspan="2" style="width:10%">Forma de<br>trabajo</th>
    <th rowspan="2" style="width:14%">Materiales</th>
  </tr>
  <tr>
    <th style="width:24pt">Tipo</th>
    <th style="width:42%">Descripción</th>
    <th style="width:13%">Evaluación<br>Formativa</th>
  </tr>
  ${sessionRows}
</table>
${footer}
</div>

<!-- PÁG 5: EVALUACIÓN -->
<div class="content pb">
${header}
<div class="banner-p" style="margin-bottom:9pt">Estrategia de Evaluación Integral</div>
<div class="ev-box"><div class="ev-ttl">📋 Evaluación Diagnóstica</div>
  <p style="font-size:8.5pt;line-height:1.65">${(plan.evaluacion?.diagnostica||"").replace(/\n/g,"<br>")}</p></div>
<div class="ev-box"><div class="ev-ttl">📊 Evaluación Formativa</div>
  <p style="font-size:8.5pt;line-height:1.65">${(plan.evaluacion?.formativa||"").replace(/\n/g,"<br>")}</p></div>
${rubricRows?`
<div class="banner-g" style="margin-bottom:5pt;font-size:9.5pt">Rúbrica de Evaluación Sumativa</div>
<table class="tbl" style="font-size:7.5pt">
  <tr>
    <th style="background:#7030A0;color:white;padding:4pt;border:1pt solid #4472C4;width:17%">Criterio</th>
    <th style="background:#2e7d32;color:white;padding:4pt;border:1pt solid #4472C4">Excelente (4)</th>
    <th style="background:#f9a825;color:white;padding:4pt;border:1pt solid #4472C4">Satisfactorio (3)</th>
    <th style="background:#e65100;color:white;padding:4pt;border:1pt solid #4472C4">En desarrollo (2)</th>
    <th style="background:#c62828;color:white;padding:4pt;border:1pt solid #4472C4">Insuficiente (1)</th>
  </tr>
  ${rubricRows}
</table>`:""}
${plan.evaluacion?.autoevaluacion?`
<div class="ev-box mt"><div class="ev-ttl">🔄 Autoevaluación del Alumno</div>
  <p style="font-size:8.5pt;line-height:1.65">${plan.evaluacion.autoevaluacion.replace(/\n/g,"<br>")}</p></div>`:""}
${footer}
</div>

<!-- PÁG 6: EXTRAS + FUNDAMENTACIÓN -->
<div class="content">
${header}
${plan.gamificacion?`<div class="banner-b" style="margin-bottom:7pt">🎮 Estrategia de Gamificación</div>
<div class="gb">
  <p style="font-size:8.5pt;margin-bottom:5pt"><strong>Sistema de puntos:</strong> ${plan.gamificacion.sistema}</p>
  <p style="font-size:8.5pt;margin-bottom:3pt"><strong>Insignias:</strong></p>
  ${(plan.gamificacion.insignias||[]).map(ins=>`<div class="ai">🏅 ${ins}</div>`).join("")}
  <p style="font-size:8.5pt;margin-top:5pt;margin-bottom:3pt"><strong>Retos opcionales:</strong></p>
  ${(plan.gamificacion.retos||[]).map(r=>`<div class="ai">⚡ ${r}</div>`).join("")}
  ${plan.gamificacion.tablero?`<p style="font-size:8.5pt;margin-top:5pt"><strong>Tablero de progreso:</strong> ${plan.gamificacion.tablero}</p>`:""}
</div>`:""}
${plan.sustentabilidad?`<div class="banner-g" style="margin-bottom:7pt">♻️ Educación Ambiental y Sustentabilidad</div>
<div class="sb">
  <p style="font-size:8.5pt;margin-bottom:5pt"><strong>Materiales reciclados:</strong> ${plan.sustentabilidad.materiales}</p>
  <p style="font-size:8.5pt;margin-bottom:5pt"><strong>Actividad ambiental:</strong> ${plan.sustentabilidad.actividad}</p>
  <p style="font-size:8.5pt"><strong>ODS:</strong> ${plan.sustentabilidad.ods}</p>
</div>`:""}
<div class="sec">
  <div class="banner-p" style="margin-bottom:5pt">Fundamentación Curricular</div>
  <div style="background:#f9f9f9;border:1pt solid #ccc;border-radius:3pt;padding:7pt;font-size:8.5pt;line-height:1.7">${(plan.fundamentacion||"").replace(/\n/g,"<br>")}</div>
</div>
${form.notasExtra?`<div class="sec"><div class="banner-g" style="margin-bottom:5pt">Notas Adicionales / Adecuaciones Curriculares</div>
<div style="border:1pt solid #4472C4;border-radius:3pt;padding:7pt;min-height:40pt;font-size:8.5pt">${form.notasExtra}</div></div>`:""}
<div style="margin-top:18pt;text-align:center;font-size:7.5pt;color:#888;border-top:1pt solid #e2e8f0;padding-top:7pt">
  ⚠️ Documento generado con apoyo de Inteligencia Artificial como herramienta pedagógica. El docente es responsable de su revisión, adaptación y aplicación. · SEP · NEM 2022
</div>
${footer}
</div>
</body></html>`;
}

// ─── Word HTML export ─────────────────────────────────────────────────────────
function buildWordHtml(form, plan){
  const ejesList = EJES.map((e,i)=>`
    <tr>
      <td style="width:50pt;text-align:center;border:1pt solid #4472C4;padding:4pt;color:#7030A0;font-weight:bold">
        ${plan.ejesSeleccionados&&plan.ejesSeleccionados.includes(i+1)?"[✓]":"[   ]"}
      </td>
      <td style="width:22pt;border:1pt solid #4472C4;padding:4pt;color:#7030A0;font-weight:bold">${i+1}.</td>
      <td style="border:1pt solid #4472C4;padding:4pt">${e}</td>
    </tr>`).join("");

  const sessionSections=(plan.sesiones||[]).map(s=>`
    <h3 style="color:#1a3c6e;font-family:'Calibri',sans-serif;font-size:12pt;margin:18pt 0 6pt;
      background:#e8f0fe;padding:6pt 10pt;border-left:4pt solid #4472C4">
      Sesión ${s.numero}${s.titulo?" – "+s.titulo:""} &nbsp;&nbsp;
      <span style="font-size:10pt;color:#7030A0">(Tipo: ${s.tipo||"F1"} | ${s.formaTrabajo||""})</span>
    </h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:14pt">
      <tr>
        <td style="width:15%;background:#5a9e44;color:white;font-weight:bold;font-size:10pt;padding:6pt 8pt;border:1pt solid #3a7e2a;vertical-align:top">
          INICIO
        </td>
        <td style="padding:7pt 10pt;border:1pt solid #ccc;font-size:10.5pt;line-height:1.8;vertical-align:top">
          ${(s.inicio||"").replace(/\n/g,"<br>")}
        </td>
      </tr>
      <tr>
        <td style="width:15%;background:#4472C4;color:white;font-weight:bold;font-size:10pt;padding:6pt 8pt;border:1pt solid #3060a0;vertical-align:top">
          DESARROLLO
        </td>
        <td style="padding:7pt 10pt;border:1pt solid #ccc;font-size:10.5pt;line-height:1.8;vertical-align:top;background:#fafbff">
          ${(s.desarrollo||"").replace(/\n/g,"<br>")}
        </td>
      </tr>
      <tr>
        <td style="width:15%;background:#7030A0;color:white;font-weight:bold;font-size:10pt;padding:6pt 8pt;border:1pt solid #5a2080;vertical-align:top">
          CIERRE
        </td>
        <td style="padding:7pt 10pt;border:1pt solid #ccc;font-size:10.5pt;line-height:1.8;vertical-align:top">
          ${(s.cierre||"").replace(/\n/g,"<br>")}
        </td>
      </tr>
      <tr>
        <td style="background:#f5f5f5;font-weight:bold;font-size:9pt;padding:4pt 8pt;border:1pt solid #ccc;color:#555">
          Evaluación Formativa
        </td>
        <td style="padding:4pt 10pt;border:1pt solid #ccc;font-size:9pt;color:#444">${s.evaluacionFormativa||"—"}</td>
      </tr>
      <tr>
        <td style="background:#f5f5f5;font-weight:bold;font-size:9pt;padding:4pt 8pt;border:1pt solid #ccc;color:#555">
          Materiales
        </td>
        <td style="padding:4pt 10pt;border:1pt solid #ccc;font-size:9pt;color:#444">${s.materiales||"—"}</td>
      </tr>
    </table>`).join("");

  const rubricHtml=(plan.evaluacion?.rubrica||[]).length?`
    <table style="width:100%;border-collapse:collapse;margin-top:10pt;font-size:9.5pt">
      <tr>
        <th style="background:#7030A0;color:white;padding:5pt 7pt;border:1pt solid #4472C4;width:18%">Criterio</th>
        <th style="background:#2e7d32;color:white;padding:5pt 7pt;border:1pt solid #4472C4">Excelente (4)</th>
        <th style="background:#f9a825;color:white;padding:5pt 7pt;border:1pt solid #4472C4">Satisfactorio (3)</th>
        <th style="background:#e65100;color:white;padding:5pt 7pt;border:1pt solid #4472C4">En desarrollo (2)</th>
        <th style="background:#c62828;color:white;padding:5pt 7pt;border:1pt solid #4472C4">Insuficiente (1)</th>
      </tr>
      ${(plan.evaluacion.rubrica||[]).map(r=>`
      <tr>
        <td style="font-weight:bold;color:#7030A0;padding:5pt 7pt;border:1pt solid #4472C4">${r.criterio}</td>
        <td style="padding:5pt 7pt;border:1pt solid #4472C4;background:#e8f5e9">${r.excelente}</td>
        <td style="padding:5pt 7pt;border:1pt solid #4472C4;background:#fffde7">${r.satisfactorio}</td>
        <td style="padding:5pt 7pt;border:1pt solid #4472C4;background:#fff3e0">${r.enDesarrollo}</td>
        <td style="padding:5pt 7pt;border:1pt solid #4472C4;background:#fce4ec">${r.insuficiente}</td>
      </tr>`).join("")}
    </table>`:"";

  return`<html xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Asistente NEM">
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
  @page Section1 { size:21cm 29.7cm; margin:2cm 2.5cm 2.5cm 2.5cm; }
  div.Section1 { page:Section1; }
  body { font-family:'Calibri',Arial,sans-serif; font-size:11pt; color:#1a1a1a; line-height:1.6; }
  h1 { font-family:'Calibri',sans-serif; font-size:16pt; color:#1e3a8a; text-align:center; margin-bottom:6pt; }
  h2 { font-family:'Calibri',sans-serif; font-size:13pt; color:white; background:#5a9e44; padding:6pt 10pt; margin:14pt 0 6pt; border-radius:3pt; }
  table { border-collapse:collapse; }
  .cover-box { background:linear-gradient(135deg,#1e3a8a,#1d4ed8); color:white; padding:24pt 20pt; text-align:center; border-radius:6pt; margin-bottom:16pt; }
  .meta-row { display:flex; gap:10pt; margin-bottom:4pt; }
  .meta-lbl { font-weight:bold; color:#1e3a8a; min-width:120pt; }
  p { margin-bottom:6pt; }
</style>
</head>
<body>
<div class="Section1">

<!-- PORTADA -->
<div class="cover-box">
  <p style="font-size:9pt;color:#bfdbfe;margin-bottom:4pt;letter-spacing:.1em">SECRETARÍA DE EDUCACIÓN PÚBLICA · NEM 2022</p>
  <h1 style="color:white;font-size:20pt;margin:0 0 8pt">Planeación Didáctica</h1>
  <p style="font-size:14pt;color:#93c5fd;margin-bottom:14pt">Nueva Escuela Mexicana · Ciclo Escolar 2025-2026</p>
  <table style="width:100%;border-collapse:collapse">
    <tr>
      <td style="padding:4pt 8pt;color:#dbeafe;font-size:10pt;width:50%"><strong style="color:white">Docente:</strong> ${form.docente}</td>
      <td style="padding:4pt 8pt;color:#dbeafe;font-size:10pt;width:50%"><strong style="color:white">Escuela:</strong> ${form.escuela}</td>
    </tr>
    <tr>
      <td style="padding:4pt 8pt;color:#dbeafe;font-size:10pt"><strong style="color:white">Nivel / Grado:</strong> ${form.nivel} — ${form.grado}</td>
      <td style="padding:4pt 8pt;color:#dbeafe;font-size:10pt"><strong style="color:white">Disciplina:</strong> ${form.disciplina}</td>
    </tr>
    <tr>
      <td style="padding:4pt 8pt;color:#dbeafe;font-size:10pt"><strong style="color:white">Campo Formativo:</strong> ${form.campo}</td>
      <td style="padding:4pt 8pt;color:#dbeafe;font-size:10pt"><strong style="color:white">Metodología:</strong> ${form.metodologia}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:4pt 8pt;color:#dbeafe;font-size:10pt"><strong style="color:white">Sesiones:</strong> ${form.sesiones} sesiones × ${form.duracion} minutos &nbsp;|&nbsp; <strong style="color:white">CCT:</strong> ${form.cct||"—"} &nbsp;|&nbsp; <strong style="color:white">Ubicación:</strong> ${form.municipio}, ${form.estado}</td>
    </tr>
  </table>
</div>

<!-- DATOS GENERALES -->
<h2>📋 1. Datos Generales</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:14pt;font-size:10.5pt">
  <tr><td style="background:#f8f4ff;color:#7030A0;font-weight:bold;padding:5pt 8pt;border:1pt solid #4472C4;width:22%">Situación-Problema</td><td style="padding:5pt 8pt;border:1pt solid #4472C4" colspan="3">${plan.situacionProblema||form.problematica}</td></tr>
  <tr><td style="background:#f8f4ff;color:#7030A0;font-weight:bold;padding:5pt 8pt;border:1pt solid #4472C4">Nombre del Proyecto</td><td style="padding:5pt 8pt;border:1pt solid #4472C4" colspan="3">${plan.nombreProyecto||""}</td></tr>
  <tr><td style="background:#f8f4ff;color:#7030A0;font-weight:bold;padding:5pt 8pt;border:1pt solid #4472C4">Producto Final</td><td style="padding:5pt 8pt;border:1pt solid #4472C4" colspan="3">${plan.producto||""}</td></tr>
  <tr><td style="background:#f8f4ff;color:#7030A0;font-weight:bold;padding:5pt 8pt;border:1pt solid #4472C4">Periodo de Aplicación</td><td style="padding:5pt 8pt;border:1pt solid #4472C4" colspan="3">${plan.periodoAplicacion||""}</td></tr>
</table>

<!-- EJES ARTICULADORES -->
<h2>🎯 2. Ejes Articuladores</h2>
<table style="width:60%;border-collapse:collapse;margin-bottom:14pt;font-size:10.5pt">
  ${ejesList}
</table>

<!-- CONTENIDO Y PDA -->
<h2>📚 3. Contenido y PDA</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:14pt;font-size:10.5pt">
  <tr><td style="background:#5a9e44;color:white;font-weight:bold;padding:5pt 8pt;border:1pt solid #3a7e2a">Contenido</td></tr>
  <tr><td style="padding:8pt;border:1pt solid #ccc;line-height:1.8">${(plan.contenido||form.contenido).replace(/\n/g,"<br>")}</td></tr>
  <tr><td style="background:#5a9e44;color:white;font-weight:bold;padding:5pt 8pt;border:1pt solid #3a7e2a">Procesos de Desarrollo de Aprendizaje (PDA)</td></tr>
  <tr><td style="padding:8pt;border:1pt solid #ccc;line-height:1.8">${(plan.pda||form.pda).replace(/\n/g,"<br>")}</td></tr>
</table>

<!-- APRENDIZAJES ESPERADOS -->
<h2>🌟 4. Aprendizajes Esperados</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:14pt;font-size:10.5pt">
  ${(plan.aprendizajesEsperados||[]).map((a,i)=>`
  <tr>
    <td style="width:28pt;text-align:center;background:#5a9e44;color:white;font-weight:bold;padding:4pt;border:1pt solid #3a7e2a">${i+1}</td>
    <td style="padding:5pt 8pt;border:1pt solid #ccc;border-left:3pt solid #5a9e44">${a}</td>
  </tr>`).join("")}
</table>

<!-- SECUENCIA DIDÁCTICA -->
<h2>📅 5. Secuencia Didáctica Detallada</h2>
<p style="font-size:9.5pt;color:#555;margin-bottom:10pt"><em>Duración total: ${form.sesiones} sesiones × ${form.duracion} minutos = ${parseInt(form.sesiones)*parseInt(form.duracion)} minutos. Metodología: ${form.metodologia}</em></p>
${sessionSections}

<!-- EVALUACIÓN -->
<h2>📊 6. Estrategia de Evaluación Integral</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:14pt;font-size:10.5pt">
  <tr><td style="background:#7030A0;color:white;font-weight:bold;padding:5pt 8pt;border:1pt solid #5a2080">Evaluación Diagnóstica</td></tr>
  <tr><td style="padding:8pt;border:1pt solid #ccc;line-height:1.8;background:#f8f4ff">${(plan.evaluacion?.diagnostica||"").replace(/\n/g,"<br>")}</td></tr>
  <tr><td style="background:#7030A0;color:white;font-weight:bold;padding:5pt 8pt;border:1pt solid #5a2080">Evaluación Formativa</td></tr>
  <tr><td style="padding:8pt;border:1pt solid #ccc;line-height:1.8">${(plan.evaluacion?.formativa||"").replace(/\n/g,"<br>")}</td></tr>
</table>
${rubricHtml?`<p style="font-weight:bold;color:#7030A0;font-size:11pt;margin:12pt 0 6pt">Rúbrica de Evaluación Sumativa</p>${rubricHtml}`:""}
${plan.evaluacion?.autoevaluacion?`
<p style="font-weight:bold;color:#7030A0;font-size:11pt;margin:12pt 0 6pt">Autoevaluación y Coevaluación</p>
<div style="background:#f8f4ff;border:1pt solid #4472C4;border-radius:3pt;padding:10pt;font-size:10.5pt;line-height:1.8">${plan.evaluacion.autoevaluacion.replace(/\n/g,"<br>")}</div>`:""}

${plan.gamificacion?`
<h2>🎮 7. Estrategia de Gamificación</h2>
<div style="background:#eff6ff;border:1.5pt solid #93c5fd;border-radius:4pt;padding:10pt;font-size:10.5pt;line-height:1.8;margin-bottom:14pt">
  <p><strong>Sistema de puntos:</strong><br>${plan.gamificacion.sistema}</p>
  <p style="margin-top:8pt"><strong>Insignias:</strong></p>
  ${(plan.gamificacion.insignias||[]).map(ins=>`<p style="padding-left:14pt;border-left:3pt solid #3b82f6;margin-bottom:4pt">🏅 ${ins}</p>`).join("")}
  <p style="margin-top:8pt"><strong>Retos opcionales:</strong></p>
  ${(plan.gamificacion.retos||[]).map(r=>`<p style="padding-left:14pt;border-left:3pt solid #3b82f6;margin-bottom:4pt">⚡ ${r}</p>`).join("")}
  ${plan.gamificacion.tablero?`<p style="margin-top:8pt"><strong>Tablero de progreso:</strong><br>${plan.gamificacion.tablero}</p>`:""}
</div>`:""}

${plan.sustentabilidad?`
<h2>♻️ ${plan.gamificacion?"8":"7"}. Educación Ambiental y Sustentabilidad</h2>
<div style="background:#f0fdf4;border:1.5pt solid #86efac;border-radius:4pt;padding:10pt;font-size:10.5pt;line-height:1.8;margin-bottom:14pt">
  <p><strong>Materiales reciclados:</strong><br>${plan.sustentabilidad.materiales}</p>
  <p style="margin-top:8pt"><strong>Actividad ambiental:</strong><br>${plan.sustentabilidad.actividad}</p>
  <p style="margin-top:8pt"><strong>Vinculación con ODS:</strong><br>${plan.sustentabilidad.ods}</p>
</div>`:""}

<!-- FUNDAMENTACIÓN -->
<h2>📖 ${[plan.gamificacion,plan.sustentabilidad].filter(Boolean).length+7}. Fundamentación Curricular</h2>
<div style="background:#f9f9f9;border-left:4pt solid #5a9e44;padding:10pt 14pt;font-size:10.5pt;line-height:1.8;margin-bottom:14pt">
  ${(plan.fundamentacion||"").replace(/\n/g,"<br>")}
</div>

${form.notasExtra?`
<h2>📝 Adecuaciones Curriculares / Notas</h2>
<div style="border:1.5pt solid #4472C4;border-radius:4pt;padding:10pt;font-size:10.5pt;line-height:1.8;margin-bottom:14pt">
  ${form.notasExtra}
</div>`:""}

<hr style="border:none;border-top:1pt solid #e2e8f0;margin:20pt 0 8pt">
<p style="font-size:8.5pt;color:#888;text-align:center">
  ⚠️ Documento generado con apoyo de Inteligencia Artificial como herramienta pedagógica.<br>
  El docente es responsable de su revisión, adaptación y aplicación. · SEP · NEM 2022 · Asistente Pedagógico NEM
</p>

</div>
</body></html>`;
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
function WelcomeScreen({onStart}){
  const [hov, setHov] = useState(false);
  const steps=[
    {icon:"👤",label:"Paso 1",desc:"Datos del docente y escuela"},
    {icon:"🏫",label:"Paso 2",desc:"Contexto y problemática"},
    {icon:"📚",label:"Paso 3",desc:"Campo formativo y currícula NEM"},
    {icon:"🎯",label:"Paso 4",desc:"Estrategia y metodología"},
    {icon:"✨",label:"Paso 5",desc:"Gamificación y extras"},
  ];
  const features=[
    {icon:"🤖",title:"IA Gemini 1.5 Flash",desc:"Planeaciones ultra-detalladas con ejemplos reales"},
    {icon:"📄",title:"PDF Formato SEPE",desc:"Diseño oficial SEPE – USET Tlaxcala con logos"},
    {icon:"📝",title:"Exportar a Word",desc:"Documento .doc con formato profesional editable"},
    {icon:"🎓",title:"Alineado a NEM 2022",desc:"Plan de Estudios SEP · Campos Formativos · PDA"},
  ];
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1rem"}}>
      {/* Hero */}
      <div style={{background:"linear-gradient(145deg,#0f2057 0%,#1d4ed8 50%,#0369a1 100%)",
        borderRadius:"1.75rem",padding:"3rem 2.5rem",textAlign:"center",
        boxShadow:"0 30px 65px -10px rgba(15,32,87,0.5)",marginBottom:"1.5rem",
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"9999px",background:"rgba(255,255,255,0.04)"}}/>
        <div style={{position:"absolute",bottom:-80,left:-50,width:260,height:260,borderRadius:"9999px",background:"rgba(255,255,255,0.03)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",
          background:"linear-gradient(90deg,#C9A820,#ffe066,#C9A820)"}}/>

        <div style={{fontSize:"4rem",marginBottom:"1rem",filter:"drop-shadow(0 8px 16px rgba(0,0,0,0.3))"}}>📋</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2.5rem",fontWeight:800,
          color:"white",lineHeight:1.1,marginBottom:"0.4rem",letterSpacing:"-0.01em"}}>
          Asistente Pedagógico <span style={{color:"#93c5fd"}}>NEM</span>
        </h1>
        <p style={{fontSize:"0.9rem",color:"#93c5fd",fontFamily:"'DM Sans',sans-serif",
          letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"1rem"}}>
          Nueva Escuela Mexicana · Diseño Curricular con IA
        </p>

        <div style={{display:"inline-flex",alignItems:"center",gap:"0.6rem",
          background:"rgba(255,255,255,0.1)",backdropFilter:"blur(8px)",
          borderRadius:"9999px",padding:"0.5rem 1.4rem",marginBottom:"1.75rem",
          border:"1px solid rgba(255,255,255,0.15)"}}>
          <span style={{fontSize:"1rem"}}>👨‍🏫</span>
          <span style={{fontSize:"0.82rem",color:"#e0f2fe",fontFamily:"'DM Sans',sans-serif"}}>
            {INIT.docente}
          </span>
        </div>

        <p style={{color:"#bfdbfe",fontSize:"0.92rem",lineHeight:1.8,
          fontFamily:"'DM Sans',sans-serif",marginBottom:"2rem",maxWidth:520,margin:"0 auto 2rem"}}>
          Bienvenido a su asistente de planeación docente. En minutos generará una planeación didáctica{" "}
          <strong style={{color:"#93c5fd"}}>completa, ejemplificada y lista para el aula</strong>, con{" "}
          <strong style={{color:"#93c5fd"}}>exportación a PDF y Word</strong> en el formato oficial{" "}
          <strong style={{color:"#fde68a"}}>SEPE – USET Tlaxcala</strong>.
        </p>

        <button onClick={onStart}
          onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
          style={{background:"white",color:"#1d4ed8",border:"none",
            padding:"1.1rem 3.2rem",borderRadius:"1rem",cursor:"pointer",
            fontSize:"1.05rem",fontWeight:700,fontFamily:"'DM Sans',sans-serif",
            boxShadow:hov?"0 20px 40px rgba(0,0,0,0.3)":"0 8px 20px rgba(0,0,0,0.2)",
            transform:hov?"translateY(-2px) scale(1.02)":"scale(1)",transition:"all 0.2s"}}>
          ✏️ Comenzar Planeación
        </button>
      </div>

      {/* Flujo de pasos */}
      <div style={{background:"white",borderRadius:"1.25rem",padding:"1.5rem",
        boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid #e2e8f0",marginBottom:"1rem"}}>
        <p style={{fontSize:"0.72rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",
          color:"#64748b",marginBottom:"1rem",fontFamily:"'DM Sans',sans-serif"}}>🗺️ Flujo de 5 pasos</p>
        <div style={{display:"flex",alignItems:"flex-start",gap:"0",overflowX:"auto"}}>
          {steps.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",flex:1,minWidth:0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1,padding:"0 0.25rem"}}>
                <div style={{width:"3rem",height:"3rem",borderRadius:"0.75rem",
                  background:"linear-gradient(135deg,#1d4ed8,#0369a1)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"1.3rem",marginBottom:"0.4rem",
                  boxShadow:"0 4px 12px rgba(29,78,216,0.3)"}}>
                  {s.icon}
                </div>
                <p style={{fontSize:"0.65rem",fontWeight:700,color:"#1d4ed8",textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>{s.label}</p>
                <p style={{fontSize:"0.6rem",color:"#64748b",textAlign:"center",lineHeight:1.3,fontFamily:"'DM Sans',sans-serif"}}>{s.desc}</p>
              </div>
              {i<4&&<div style={{width:"1.5rem",height:"2px",background:"#e2e8f0",flexShrink:0,marginBottom:"1.5rem"}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1rem"}}>
        {features.map((f,i)=>(
          <div key={i} style={{background:"white",borderRadius:"0.875rem",padding:"1rem",
            boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0",
            display:"flex",alignItems:"flex-start",gap:"0.75rem"}}>
            <div style={{width:"2.5rem",height:"2.5rem",borderRadius:"0.6rem",
              background:"linear-gradient(135deg,#f0f4ff,#e8f3fd)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"1.3rem",flexShrink:0,border:"1px solid #dbeafe"}}>
              {f.icon}
            </div>
            <div>
              <p style={{fontSize:"0.8rem",fontWeight:700,color:"#1e3a8a",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.15rem"}}>{f.title}</p>
              <p style={{fontSize:"0.7rem",color:"#64748b",lineHeight:1.4,fontFamily:"'DM Sans',sans-serif"}}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{background:"linear-gradient(135deg,#f0fdf4,#eff6ff)",borderRadius:"0.875rem",
        padding:"0.9rem 1.1rem",border:"1px solid #e2e8f0",textAlign:"center"}}>
        <p style={{fontSize:"0.72rem",color:"#475569",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7}}>
          🏛️ <strong style={{color:"#1e3a8a"}}>DEPARTAMENTO DE EDUCACIÓN SECUNDARIA GENERAL</strong> · JEFATURAS DE ENSEÑANZA<br/>
          Basado en el <strong style={{color:"#065f46"}}>Plan de Estudios 2022 SEP</strong> · Campos Formativos NEM · Marco humanista y comunitario
        </p>
      </div>
    </div>
  );
}

// ─── Result View ──────────────────────────────────────────────────────────────
function ResultView({result,planData,form,onNew}){
  const [copied,setCopied]=useState(false);
  const [exporting,setExporting]=useState("");

  const handleCopy=useCallback(()=>{
    navigator.clipboard.writeText(result).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  },[result]);

  const handlePdf=()=>{
    setExporting("pdf");
    const plan=planData||{};
    const html=buildPdfHtml(form,plan);
    const w=window.open("","_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(()=>{w.focus();w.print();setExporting("");},1000);
  };

  const handleWord=()=>{
    setExporting("word");
    const plan=planData||{};
    const html=buildWordHtml(form,plan);
    const blob=new Blob(["\ufeff"+html],{type:"application/msword;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`Planeacion_${form.disciplina||"NEM"}_${form.grado||""}.doc`.replace(/\s+/g,"_");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(()=>setExporting(""),500);
  };

  const hasPlan=!!planData;

  return(
    <div style={{maxWidth:850,margin:"0 auto",padding:"1.5rem 1rem 3rem"}}>
      {/* Banner de éxito */}
      <div style={{
        background:"linear-gradient(135deg,#065f46,#059669)",
        borderRadius:"1.25rem",padding:"1.5rem 1.75rem",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        flexWrap:"wrap",gap:"1rem",
        boxShadow:"0 12px 30px rgba(5,150,105,0.3)",marginBottom:"1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <span style={{fontSize:"2.2rem"}}>✅</span>
          <div>
            <p style={{color:"#ecfdf5",fontSize:"0.68rem",textTransform:"uppercase",
              letterSpacing:"0.09em",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.15rem"}}>Lista para exportar</p>
            <h2 style={{color:"white",fontSize:"1.25rem",fontFamily:"'Playfair Display',serif",fontWeight:700}}>
              Planeación Generada con IA
            </h2>
          </div>
        </div>
        <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
          <button onClick={handlePdf} disabled={exporting==="pdf"}
            style={{padding:"0.65rem 1.3rem",borderRadius:"0.625rem",cursor:"pointer",
              background:"white",border:"none",color:"#065f46",
              fontWeight:700,fontSize:"0.82rem",fontFamily:"'DM Sans',sans-serif",
              opacity:exporting==="pdf"?0.7:1,
              boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>
            {exporting==="pdf"?"⏳ Abriendo…":"🖨️ PDF (Formato SEPE)"}
          </button>
          <button onClick={handleWord} disabled={exporting==="word"}
            style={{padding:"0.65rem 1.3rem",borderRadius:"0.625rem",cursor:"pointer",
              background:"rgba(255,255,255,0.2)",border:"none",
              color:"white",fontWeight:700,fontSize:"0.82rem",
              fontFamily:"'DM Sans',sans-serif",
              opacity:exporting==="word"?0.7:1}}>
            {exporting==="word"?"⏳ Descargando…":"📝 Exportar Word (.doc)"}
          </button>
          <button onClick={handleCopy}
            style={{padding:"0.65rem 1.1rem",borderRadius:"0.625rem",cursor:"pointer",
              background:copied?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.15)",
              border:"none",color:copied?"#059669":"white",
              fontWeight:700,fontSize:"0.82rem",fontFamily:"'DM Sans',sans-serif"}}>
            {copied?"✓ Copiado":"📋 Copiar JSON"}
          </button>
          <button onClick={onNew}
            style={{padding:"0.65rem 1rem",borderRadius:"0.625rem",cursor:"pointer",
              background:"rgba(255,255,255,0.12)",
              border:"1.5px solid rgba(255,255,255,0.3)",
              color:"white",fontWeight:700,fontSize:"0.82rem",fontFamily:"'DM Sans',sans-serif"}}>
            ＋ Nueva
          </button>
        </div>
      </div>

      {/* Info badges */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"1rem"}}>
        <div style={{background:"#eff6ff",border:"1.5px solid #93c5fd",borderRadius:"0.75rem",
          padding:"0.7rem 1rem",display:"flex",alignItems:"center",gap:"0.6rem"}}>
          <span style={{fontSize:"1.3rem"}}>🖨️</span>
          <div>
            <p style={{fontSize:"0.75rem",fontWeight:700,color:"#1d4ed8",fontFamily:"'DM Sans',sans-serif"}}>PDF · Formato SEPE Tlaxcala</p>
            <p style={{fontSize:"0.65rem",color:"#475569",fontFamily:"'DM Sans',sans-serif"}}>Logos institucionales, 6 páginas, marca de agua, tabla de sesiones</p>
          </div>
        </div>
        <div style={{background:"#f0fdf4",border:"1.5px solid #86efac",borderRadius:"0.75rem",
          padding:"0.7rem 1rem",display:"flex",alignItems:"center",gap:"0.6rem"}}>
          <span style={{fontSize:"1.3rem"}}>📝</span>
          <div>
            <p style={{fontSize:"0.75rem",fontWeight:700,color:"#065f46",fontFamily:"'DM Sans',sans-serif"}}>Word · Formato editable (.doc)</p>
            <p style={{fontSize:"0.65rem",color:"#475569",fontFamily:"'DM Sans',sans-serif"}}>Cada sesión desglosada en Inicio / Desarrollo / Cierre detallados</p>
          </div>
        </div>
      </div>

      {/* Vista previa del JSON */}
      <div style={{background:"white",borderRadius:"1.25rem",
        boxShadow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{background:"#1e293b",padding:"0.65rem 1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
          {["#ef4444","#f59e0b","#22c55e"].map((c,i)=>(
            <span key={i} style={{width:"0.65rem",height:"0.65rem",borderRadius:"9999px",background:c,display:"inline-block"}}/>
          ))}
          <span style={{color:"#94a3b8",fontSize:"0.72rem",fontFamily:"monospace",marginLeft:"0.5rem"}}>
            planeacion_nem_{(form.disciplina||"").toLowerCase().replace(/\s+/g,"_")}.json
          </span>
          {hasPlan&&<span style={{marginLeft:"auto",fontSize:"0.68rem",color:"#4ade80",fontFamily:"'DM Sans',sans-serif"}}>✓ JSON estructurado</span>}
        </div>
        <div style={{padding:"1.5rem 2rem",maxHeight:"52vh",overflowY:"auto"}}>
          <pre style={{fontFamily:"'Courier New',monospace",fontSize:"0.78rem",
            lineHeight:1.7,color:"#1e293b",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
            {result}
          </pre>
        </div>
      </div>
      <p style={{textAlign:"center",fontSize:"0.67rem",color:"#94a3b8",marginTop:"0.9rem",fontFamily:"'DM Sans',sans-serif"}}>
        ⚠️ Documento de apoyo pedagógico generado con IA · Revisión y adaptación docente obligatoria · Formato SEPE USET Tlaxcala
      </p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
const MSGS=[
  "Analizando contexto pedagógico…",
  "Diseñando secuencia de sesiones…",
  "Redactando actividades con ejemplos reales…",
  "Generando preguntas detonadoras…",
  "Construyendo rúbricas de evaluación…",
  "Estructurando datos para formato SEPE…",
  "Finalizando planeación completa…",
];

export default function App(){
  const[screen, setScreen]=useState("welcome");
  const[step,   setStep]  =useState(1);
  const[form,   setForm]  =useState(INIT);
  const[errors, setErrors]=useState({});
  const[loading,setLoading]=useState(false);
  const[msg,    setMsg]   =useState("");
  const[result, setResult]=useState("");
  const[plan,   setPlan]  =useState(null);

  const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const goNext=()=>{
    const e=validate(step,form);
    if(Object.keys(e).length){setErrors(e);return;}
    setErrors({});setStep(s=>s+1);
  };
  const goBack=()=>{setErrors({});setStep(s=>s-1);};

  const generate=async()=>{
    setLoading(true);setMsg(MSGS[0]);
    let i=0;
    const iv=setInterval(()=>{i=(i+1)%MSGS.length;setMsg(MSGS[i]);},2400);
   const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
        {method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            contents:[{parts:[{text:buildPrompt(form)}]}],
            generationConfig:{temperature:0.6,maxOutputTokens:8192},
          })}
      );
      const d=await res.json();
      const raw=d.candidates?.[0]?.content?.parts?.[0]?.text||"";
      setResult(raw);
      try{
        const clean=raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
        setPlan(JSON.parse(clean));
      }catch(_){
        const m=raw.match(/\{[\s\S]*\}/);
        if(m){try{setPlan(JSON.parse(m[0]));}catch(_){setPlan(null);}}
        else setPlan(null);
      }
    }catch(e){
      setResult("❌ Error de conexión:\n"+e.message);
      setPlan(null);
    }
    clearInterval(iv);setLoading(false);setScreen("result");
  };

  const prog=((step-1)/(STEPS.length-1))*100;
  const sd=STEPS[step-1];

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#f0f4ff 0%,#e8f3fd 45%,#f0fdf4 100%)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        *{-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes bar{0%,100%{transform:translateX(-100%)}50%{transform:translateX(100%)}}
      `}</style>

      {/* Navbar */}
      <nav style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(226,232,240,0.9)",
        padding:"0.85rem 1.5rem",display:"flex",alignItems:"center",gap:"0.9rem",
        position:"sticky",top:0,zIndex:100}}>
        <div style={{width:"2.1rem",height:"2.1rem",borderRadius:"0.5rem",
          background:"linear-gradient(135deg,#1d4ed8,#0369a1)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",
          boxShadow:"0 2px 8px rgba(29,78,216,0.3)"}}>📋</div>
        <div>
          <p style={{fontSize:"0.88rem",fontWeight:800,color:"#1e3a8a",lineHeight:1}}>Asistente Pedagógico NEM</p>
          <p style={{fontSize:"0.62rem",color:"#64748b",marginTop:"0.1rem"}}>PDF + Word · Formato SEPE · USET Tlaxcala · NEM 2022</p>
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

      {screen==="welcome"&&<WelcomeScreen onStart={()=>setScreen("form")}/>}

      {screen==="form"&&!loading&&(
        <div style={{maxWidth:700,margin:"0 auto",padding:"2rem 1rem"}}>
          {/* Stepper */}
          <div style={{marginBottom:"1.5rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"0.45rem"}}>
              <p style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                Paso {step} de {STEPS.length} — <span style={{color:sd.color}}>{sd.label}</span>
              </p>
              <p style={{fontSize:"0.7rem",color:sd.color,fontWeight:700}}>{Math.round(prog)}%</p>
            </div>
            <div style={{height:"0.3rem",background:"#e2e8f0",borderRadius:"9999px",overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:"9999px",
                background:`linear-gradient(90deg,${sd.color},${sd.color}99)`,
                width:`${prog}%`,transition:"width 0.4s cubic-bezier(.4,0,.2,1)"}}/>
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

          {/* Form card */}
          <div style={{background:"white",borderRadius:"1.5rem",
            boxShadow:"0 10px 40px rgba(0,0,0,0.09)",border:"1px solid #e2e8f0",overflow:"hidden"}}>
            <div style={{background:`linear-gradient(135deg,${sd.color},${sd.color}c0)`,
              padding:"1.4rem 2rem",display:"flex",alignItems:"center",gap:"1rem"}}>
              <span style={{fontSize:"2rem",filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{sd.icon}</span>
              <div>
                <p style={{color:"rgba(255,255,255,0.65)",fontSize:"0.65rem",textTransform:"uppercase",
                  letterSpacing:"0.1em",fontWeight:700,marginBottom:"0.12rem"}}>Paso {step} de {STEPS.length}</p>
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
                <button onClick={generate}
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

      {/* Loading */}
      {screen==="form"&&loading&&(
        <div style={{maxWidth:480,margin:"5rem auto",padding:"0 1rem",textAlign:"center"}}>
          <div style={{background:"white",borderRadius:"1.5rem",
            boxShadow:"0 20px 60px rgba(0,0,0,0.1)",padding:"3rem 2.5rem",border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:"3rem",marginBottom:"1.2rem",display:"inline-block",animation:"spin 3s linear infinite"}}>⚙️</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",color:"#1e3a8a",marginBottom:"0.5rem"}}>
              Generando planeación…
            </h3>
            <p style={{color:"#64748b",fontSize:"0.84rem",marginBottom:"1.8rem",minHeight:"1.3rem"}}>{msg}</p>
            <div style={{height:"0.3rem",background:"#f1f5f9",borderRadius:"9999px",overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",inset:0,
                background:"linear-gradient(90deg,transparent,#1d4ed8,#059669,transparent)",
                animation:"bar 2s ease-in-out infinite"}}/>
            </div>
            <p style={{fontSize:"0.67rem",color:"#94a3b8",marginTop:"1.1rem"}}>
              Generando sesiones ultra-detalladas con ejemplos · 30–60 seg
            </p>
          </div>
        </div>
      )}

      {screen==="result"&&(
        <ResultView result={result} planData={plan} form={form}
          onNew={()=>{setScreen("welcome");setStep(1);setForm(INIT);setResult("");setPlan(null);}}/>
      )}
    </div>
  );
}
