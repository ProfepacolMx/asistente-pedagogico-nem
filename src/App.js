// npm install docx  (necesario en el proyecto React)
import { useState, useCallback } from "react";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageBreak,
} from "docx";

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
  const numParciales = Math.floor(parseInt(f.sesiones) / 5);
  const parcialEjemplos = Array.from({length: numParciales}, (_,i) =>
    `"Producto entregable parcial ${i+1} (sesiones ${i*5+1}–${(i+1)*5}): descripción del producto que los alumnos entregarán"`
  ).join(",\n    ");

  return `
Eres especialista en diseño curricular de la Nueva Escuela Mexicana (NEM).
Genera una planeación didáctica en formato JSON puro.

DATOS:
- Docente: ${f.docente} | Escuela: ${f.escuela} | CCT: ${f.cct||"N/A"} | Zona: ${f.zonaEscolar||"N/A"} | Turno: ${f.turno}
- Ubicación: ${f.municipio}, ${f.estado} | Nivel: ${f.nivel} | Grado: ${f.grado} | Alumnos: ${f.grupoAlumnos||"N/A"}
- Disciplina: ${f.disciplina} | Campo: ${f.campo} | Eje: ${f.eje}
- Contenido (NO generar, se usa tal cual): "${f.contenido}"
- PDA (NO generar, se usa tal cual): "${f.pda}"
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
  "nombreProyecto": "Nombre creativo del proyecto vinculado al contenido '${f.contenido}'",
  "producto": "Producto FINAL concreto que entregarán los alumnos al concluir todas las sesiones",
  "ejesSeleccionados": [1, 3],
  "productosParciales": [
    ${parcialEjemplos || `"Sin bloques completos de 5 sesiones en esta planeación"`}
  ],
  "sesiones": [
    {
      "numero": 1,
      "tipo": "F1",
      "descripcion": "INICIO: [Actividad de apertura real + pregunta detonadora concreta sobre '${f.contenido}', organización del grupo, mínimo 3 oraciones]. DESARROLLO: [Actividad principal paso a paso con ejemplo numérico o situacional real del tema, roles de alumnos, mínimo 4 oraciones]. CIERRE: [Síntesis colectiva + pregunta metacognitiva, mínimo 2 oraciones].",
      "evaluacionFormativa": "MO, ES",
      "formaTrabajo": "Equipos de 3",
      "materiales": "Libro SEP p.XX, cartulinas"
    }
  ],
  "evaluacion": {
    "diagnostica": "Instrumento diagnóstico con 2-3 preguntas o actividad clave sobre saberes previos",
    "formativa": "2 instrumentos formativos con criterios básicos de observación continua",
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
        "criterio": "Calidad del producto entregable",
        "excelente": "Producto completo, claro y con argumentación sólida",
        "satisfactorio": "Producto completo con pequeños errores",
        "enDesarrollo": "Producto incompleto o con errores relevantes",
        "insuficiente": "No entrega o el producto no cumple los criterios"
      }
    ]
  },
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
- Sesiones con formato INICIO/DESARROLLO/CIERRE y ejemplos REALES del tema
- Rúbrica: adapta el contenido de los 3 criterios al tema, descriptores breves (1 oración)
- "productosParciales": ${numParciales} elemento(s) — uno por cada bloque de 5 sesiones
`.trim();
}

// ── Word Document Generator (SEPE Tlaxcala Format) ──────────────────────────────
async function generateWordDoc(form, plan) {

  // ── Medidas A4 ────────────────────────────────────────────────────────────
  const PW = 11906;               // A4 ancho DXA
  const MG = 1134;                // 2 cm en DXA
  const TW = PW - 2 * MG;        // 9638 — ancho útil de tabla

  // ── Paleta de colores ─────────────────────────────────────────────────────
  const C = {
    green:   "5A9E44", blue:    "4472C4", purple:  "7030A0", gold: "C9A820",
    amber:   "F59E0B", lPurple: "F8F4FF", lGreen:  "E8F5E9",
    lYellow: "FFF9C4", lOrange: "FFF3E0", lRed:    "FCE4EC",
    lAmber:  "FEF3C7", white:   "FFFFFF", dark:    "1A1A1A",
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const br  = (c = C.blue) => ({ style: BorderStyle.SINGLE, size: 4, color: c });
  const brs = (c = C.blue) => ({ top: br(c), bottom: br(c), left: br(c), right: br(c) });
  const CM  = { top: 60, bottom: 60, left: 120, right: 120 };

  const run = (text = "", opts = {}) => new TextRun({
    text, font: "Arial", size: opts.size || 18,
    bold: opts.bold || false, color: opts.color || C.dark,
    italics: opts.italic || false,
  });

  const para = (children, align = AlignmentType.LEFT) =>
    new Paragraph({ alignment: align, spacing: { before: 0, after: 0 }, children });

  const mkCell = (childrenOrText, opts = {}) => {
    const children = typeof childrenOrText === "string"
      ? [para([run(childrenOrText, { size: opts.size||17, bold: opts.bold, color: opts.color })])]
      : childrenOrText;
    return new TableCell({
      borders: brs(opts.bc || C.blue),
      shading: { fill: opts.bg || C.white, type: ShadingType.CLEAR },
      margins: CM,
      width: { size: opts.w || 1000, type: WidthType.DXA },
      columnSpan: opts.span || 1,
      verticalAlign: opts.vAlign || VerticalAlign.TOP,
      children,
    });
  };

  const lbl = (text, w) => mkCell(text, { w, bg: C.lPurple, bold: true, color: C.purple, size: 17 });
  const val = (text, w, span = 1) => mkCell(text || "", { w, span, size: 17 });

  const bannerRow = (text, color, span = 1, w = TW) => new TableRow({ children: [
    new TableCell({
      borders: brs(color), shading: { fill: color, type: ShadingType.CLEAR },
      margins: CM, width: { size: w, type: WidthType.DXA }, columnSpan: span,
      children: [para([run(text, { bold: true, color: C.white, size: 20 })], AlignmentType.CENTER)],
    })
  ]});

  const tbl = (widths, rows) => new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths, rows,
  });

  const pg = () => new Paragraph({ children: [new PageBreak()] });
  const sp = () => new Paragraph({ spacing: { before: 0, after: 120 }, children: [] });

  // ── Ejes ──────────────────────────────────────────────────────────────────
  const EJES_LIST = [
    "Inclusión", "Pensamiento crítico", "Interculturalidad crítica",
    "Igualdad de género", "Vida saludable",
    "Apropiación de las culturas a través de la lectura y la escritura",
    "Artes y experiencias estéticas",
  ];
  const ejSel = plan.ejesSeleccionados || [];

  // ── Acumular contenido ────────────────────────────────────────────────────
  const kids = [];

  // ════════════════════ PÁGINA 1 – Datos Generales ══════════════════════════
  kids.push(tbl([TW], [
    new TableRow({ children: [new TableCell({
      borders: brs(C.gold), shading: { fill: "FFFFF5", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      width: { size: TW, type: WidthType.DXA },
      children: [
        para([run("DEPARTAMENTO DE EDUCACIÓN SECUNDARIA GENERAL", { bold: true, size: 22 })], AlignmentType.CENTER),
        para([run("JEFATURAS DE ENSEÑANZA", { bold: true, size: 20 })], AlignmentType.CENTER),
      ],
    })] }),
  ]));
  kids.push(sp());

  kids.push(tbl([TW], [
    bannerRow(`Plano Didáctico de ${form.disciplina} — Ciclo Escolar 2025 – 2026`, C.green)
  ]));
  kids.push(sp());

  // Datos del plantel
  const C3 = Math.floor(TW / 3);
  const C3r = TW - C3 * 2;
  kids.push(tbl([C3, C3, C3r], [
    new TableRow({ children: [
      lbl(`Escuela: ${form.escuela}`, C3),
      mkCell(`CCT: ${form.cct || ""}`, { w: C3 + C3r, span: 2, size: 17 }),
    ]}),
    new TableRow({ children: [
      lbl(`Zona Escolar: ${form.zonaEscolar || ""}`, C3),
      lbl(`Turno: ${form.turno}`, C3),
      lbl(`Localidad: ${form.municipio}, ${form.estado}`, C3r),
    ]}),
    new TableRow({ children: [
      lbl(`Grado: ${form.grado}${form.grupoAlumnos ? " — " + form.grupoAlumnos + " alumnos" : ""}`, C3),
      mkCell(`Docente: ${form.docente}`, { w: C3 + C3r, span: 2, bg: C.lPurple, bold: true, color: C.purple, size: 17 }),
    ]}),
  ]));
  kids.push(sp());

  const LPer = Math.floor(TW * 0.26);
  kids.push(tbl([LPer, TW - LPer], [
    new TableRow({ children: [
      lbl("Periodo de Aplicación:", LPer),
      val(plan.periodoAplicacion || "Ciclo Escolar 2025-2026", TW - LPer),
    ]})
  ]));

  // ════════════════════ PÁGINA 2 – Generalidades + Ejes ════════════════════
  kids.push(pg());

  kids.push(tbl([TW], [bannerRow("Generalidades (Estructura General del Proyecto)", C.green)]));

  const GL = Math.floor(TW * 0.22);
  const GV = TW - GL;
  kids.push(tbl([GL, GV], [
    new TableRow({ children: [lbl("Situación-Problema", GL), val(plan.situacionProblema || form.problematica, GV)] }),
    new TableRow({ children: [
      lbl("Escenario", GL),
      mkCell([para([
        run(`(${plan.escenario === "Aula" ? "✓" : " "}) Aula   `, { size: 17 }),
        run(`(  ) Escolar   (  ) Comunitario`, { size: 17 }),
      ])], { w: GV }),
    ]}),
    new TableRow({ children: [lbl("Nombre del Proyecto", GL), val(plan.nombreProyecto || "", GV)] }),
    new TableRow({ children: [lbl("Metodología", GL), val(form.metodologia, GV)] }),
    new TableRow({ children: [lbl("Producto Final", GL), val(plan.producto || "", GV)] }),
  ]));
  kids.push(sp());

  // Ejes articuladores
  const EW = Math.floor(TW * 0.52);
  const EM = 700, EN = 500, EName = EW - EM - EN;
  kids.push(tbl([EM, EN, EName], [
    new TableRow({ children: [
      mkCell("Marcar", { w: EM, bg: C.blue, bc: C.blue, bold: true, color: C.white, size: 16, vAlign: VerticalAlign.CENTER }),
      mkCell("Ejes Articuladores", { w: EN + EName, span: 2, bg: C.blue, bc: C.blue, bold: true, color: C.white, size: 16 }),
    ]}),
    ...EJES_LIST.map((eje, i) => new TableRow({ children: [
      mkCell(ejSel.includes(i + 1) ? "(✓)" : "(   )", { w: EM, bg: C.lPurple, bold: true, color: C.purple, size: 17, vAlign: VerticalAlign.CENTER }),
      mkCell(`${i + 1}.`, { w: EN, bold: true, color: C.purple, size: 17 }),
      mkCell(eje, { w: EName, size: 16 }),
    ]})),
  ]));

  // ════════════════════ PÁGINA 3 – Contenido + PDA (del formulario) ═════════
  kids.push(pg());

  kids.push(tbl([TW], [
    bannerRow("Contenido", C.green),
    new TableRow({ children: [new TableCell({
      borders: brs(), margins: { top: 120, bottom: 120, left: 160, right: 160 },
      width: { size: TW, type: WidthType.DXA },
      children: [para([run(form.contenido || "", { size: 17 })])],
    })] }),
    bannerRow("Proceso de Desarrollo de Aprendizaje (PDA)", C.green),
    new TableRow({ children: [new TableCell({
      borders: brs(), margins: { top: 120, bottom: 120, left: 160, right: 160 },
      width: { size: TW, type: WidthType.DXA },
      children: [para([run(form.pda || "", { size: 17 })])],
    })] }),
  ]));
  kids.push(sp());

  kids.push(tbl([TW], [
    bannerRow(`Campo Formativo: ${form.campo}   |   Eje Articulador: ${form.eje}`, C.green)
  ]));

  // ════════════════════ PÁGINA 4 – Nomenclatura + Sesiones ═════════════════
  kids.push(pg());

  const makeNomTbl = (title, items) => {
    const n = items.length;
    const colW = Math.floor(TW / n);
    const lastW = TW - colW * (n - 1);
    return tbl([...Array(n - 1).fill(colW), lastW], [
      new TableRow({ children: [mkCell(title, { w: TW, span: n, bg: C.blue, bc: C.blue, bold: true, color: C.white, size: 16 })] }),
      new TableRow({ children: items.map((txt, i) => mkCell(txt, { w: i === n - 1 ? lastW : colW, size: 15 })) }),
    ]);
  };

  kids.push(makeNomTbl("Nomenclatura del tipo de Actividades",
    ["C – Contenido", "EV – Evaluación", "F1 – Fase 1", "F2 – Fase 2", "F3 – Fase 3", "F4 – Fase 4", "F5 – Fase 5"]));
  kids.push(sp());
  kids.push(makeNomTbl("Nomenclatura del Proceso de Evaluación Formativa",
    ["MO – Motivar y Orientar", "ES – Establecer y Socializar", "E – Explorar", "M – Monitoreo",
     "C – Control", "RL – Resaltar Logros", "PA – Autoevaluación", "PC – Coevaluación", "R – Retroalimentación"]));
  kids.push(sp());

  // Tabla de sesiones — columnas
  const SN = 580, ST = 580, SD = 5000, SE = 980, SF = 980, SM = TW - SN - ST - SD - SE - SF;

  const sesHeaderRow = new TableRow({ children: [
    mkCell("Sesión",      { w: SN, bg: C.green, bc: C.green, bold: true, color: C.white, size: 16, vAlign: VerticalAlign.CENTER }),
    mkCell("Tipo",        { w: ST, bg: C.green, bc: C.green, bold: true, color: C.white, size: 16, vAlign: VerticalAlign.CENTER }),
    mkCell("Descripción de la Actividad (INICIO / DESARROLLO / CIERRE)",
                          { w: SD, bg: C.green, bc: C.green, bold: true, color: C.white, size: 16 }),
    mkCell("Proceso Evaluación Formativa",
                          { w: SE, bg: C.green, bc: C.green, bold: true, color: C.white, size: 15 }),
    mkCell("Forma de Trabajo",
                          { w: SF, bg: C.green, bc: C.green, bold: true, color: C.white, size: 15 }),
    mkCell("Materiales",  { w: SM, bg: C.green, bc: C.green, bold: true, color: C.white, size: 15 }),
  ]});

  const sesDataRows = [];
  (plan.sesiones || []).forEach((s, idx) => {
    const isEven = idx % 2 === 1;
    const bg = isEven ? "F7F7FF" : C.white;

    // Formatear descripción con INICIO/DESARROLLO/CIERRE en negrita
    const rawDesc = s.descripcion || "";
    const parts = rawDesc.split(/(INICIO:|DESARROLLO:|CIERRE:)/);
    const descParas = [];
    let i = 0;
    while (i < parts.length) {
      if (["INICIO:", "DESARROLLO:", "CIERRE:"].includes(parts[i])) {
        descParas.push(new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [
            run(parts[i] + " ", { bold: true, color: C.green, size: 15 }),
            run((parts[i + 1] || "").trim(), { size: 15 }),
          ],
        }));
        i += 2;
      } else {
        if (parts[i].trim()) descParas.push(para([run(parts[i].trim(), { size: 15 })]));
        i++;
      }
    }
    if (!descParas.length) descParas.push(para([run(rawDesc, { size: 15 })]));

    sesDataRows.push(new TableRow({ children: [
      mkCell(String(s.numero), { w: SN, bg, bold: true, color: C.purple, size: 17, vAlign: VerticalAlign.CENTER }),
      mkCell(s.tipo || "F1",   { w: ST, bg, size: 17, vAlign: VerticalAlign.CENTER }),
      mkCell(descParas,        { w: SD, bg }),
      mkCell(s.evaluacionFormativa || "", { w: SE, bg, size: 15 }),
      mkCell(s.formaTrabajo || "",        { w: SF, bg, size: 15 }),
      mkCell(s.materiales || "",          { w: SM, bg, size: 15 }),
    ]}));

    // Producto entregable cada 5 sesiones
    if ((idx + 1) % 5 === 0) {
      const pIdx = Math.floor(idx / 5);
      const pText = (plan.productosParciales || [])[pIdx]
        || `Producto Entregable Parcial – Sesiones ${idx - 3} a ${idx + 1}`;
      const amberBr = { style: BorderStyle.SINGLE, size: 8, color: "F59E0B" };
      sesDataRows.push(new TableRow({ children: [
        new TableCell({
          borders: { top: amberBr, bottom: amberBr, left: amberBr, right: amberBr },
          shading: { fill: C.lAmber, type: ShadingType.CLEAR },
          margins: CM,
          width: { size: TW, type: WidthType.DXA },
          columnSpan: 6,
          children: [para([
            run("PRODUCTO ENTREGABLE: ", { bold: true, color: "B45309", size: 18 }),
            run(pText, { size: 17, color: "78350F" }),
          ])],
        })
      ]}));
    }
  });

  kids.push(tbl([SN, ST, SD, SE, SF, SM], [sesHeaderRow, ...sesDataRows]));

  // ════════════════════ PÁGINA 5 – Evaluación + Rúbrica ════════════════════
  kids.push(pg());

  kids.push(tbl([TW], [bannerRow("Estrategia de Evaluación Integral", C.purple)]));
  kids.push(sp());

  const evalBox = (label, text) => tbl([TW], [
    new TableRow({ children: [new TableCell({
      borders: brs(C.purple), shading: { fill: C.lPurple, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 4, left: 140, right: 140 },
      width: { size: TW, type: WidthType.DXA },
      children: [para([run(label, { bold: true, color: C.purple, size: 19 })])],
    })] }),
    new TableRow({ children: [new TableCell({
      borders: brs(C.purple), margins: { top: 4, bottom: 80, left: 140, right: 140 },
      width: { size: TW, type: WidthType.DXA },
      children: [para([run(text || "", { size: 17 })])],
    })] }),
  ]);

  kids.push(evalBox("📋 Evaluación Diagnóstica", plan.evaluacion?.diagnostica || ""));
  kids.push(sp());
  kids.push(evalBox("📊 Evaluación Formativa",   plan.evaluacion?.formativa   || ""));
  kids.push(sp());

  // Rúbrica
  kids.push(tbl([TW], [bannerRow("Rúbrica de Evaluación Sumativa", C.green)]));
  const R0 = 1800, R1 = 1960, R2 = 1960, R3 = 1960, R4 = TW - R0 - R1 - R2 - R3;
  kids.push(tbl([R0, R1, R2, R3, R4], [
    new TableRow({ children: [
      mkCell("Criterio",          { w: R0, bg: C.purple,  bc: C.purple,  bold: true, color: C.white, size: 16 }),
      mkCell("Excelente (4)",     { w: R1, bg: "2E7D32",  bc: "2E7D32",  bold: true, color: C.white, size: 16 }),
      mkCell("Satisfactorio (3)", { w: R2, bg: "F9A825",  bc: "F9A825",  bold: true, color: C.white, size: 16 }),
      mkCell("En desarrollo (2)", { w: R3, bg: "E65100",  bc: "E65100",  bold: true, color: C.white, size: 16 }),
      mkCell("Insuficiente (1)",  { w: R4, bg: "C62828",  bc: "C62828",  bold: true, color: C.white, size: 16 }),
    ]}),
    ...(plan.evaluacion?.rubrica || []).map(r => new TableRow({ children: [
      mkCell(r.criterio,       { w: R0, bg: C.lPurple, bold: true, color: C.purple, size: 16 }),
      mkCell(r.excelente,      { w: R1, bg: C.lGreen,  size: 16 }),
      mkCell(r.satisfactorio,  { w: R2, bg: C.lYellow, size: 16 }),
      mkCell(r.enDesarrollo,   { w: R3, bg: C.lOrange, size: 16 }),
      mkCell(r.insuficiente,   { w: R4, bg: C.lRed,    size: 16 }),
    ]})),
  ]));

  // ════════════════════ PÁGINA 6 – Extras (opcionales) ═════════════════════
  if (plan.gamificacion || plan.sustentabilidad || form.notasExtra) {
    kids.push(pg());

    if (plan.gamificacion) {
      kids.push(tbl([TW], [bannerRow("🎮 Estrategia de Gamificación", C.blue)]));
      kids.push(tbl([TW], [
        new TableRow({ children: [new TableCell({
          borders: brs(C.blue), shading: { fill: "EFF6FF", type: ShadingType.CLEAR },
          margins: CM, width: { size: TW, type: WidthType.DXA },
          children: [
            para([run("Sistema de puntos: ", { bold: true, color: C.blue, size: 17 }),
                  run(plan.gamificacion.sistema || "", { size: 17 })]),
            para([run("Insignias:", { bold: true, color: C.blue, size: 17 })]),
            ...(plan.gamificacion.insignias || []).map(ins => para([run("  🏅 " + ins, { size: 17 })])),
            para([run("Retos:", { bold: true, color: C.blue, size: 17 })]),
            ...(plan.gamificacion.retos || []).map(r => para([run("  ⚡ " + r, { size: 17 })])),
          ],
        })] }),
      ]));
      kids.push(sp());
    }

    if (plan.sustentabilidad) {
      kids.push(tbl([TW], [bannerRow("♻️ Educación Ambiental y Sustentabilidad", C.green)]));
      kids.push(tbl([TW], [
        new TableRow({ children: [new TableCell({
          borders: brs(C.green), shading: { fill: "F0FDF4", type: ShadingType.CLEAR },
          margins: CM, width: { size: TW, type: WidthType.DXA },
          children: [
            para([run("Materiales reciclados: ",  { bold: true, color: C.green, size: 17 }), run(plan.sustentabilidad.materiales || "", { size: 17 })]),
            para([run("Actividad ambiental: ",    { bold: true, color: C.green, size: 17 }), run(plan.sustentabilidad.actividad  || "", { size: 17 })]),
            para([run("Vinculación con ODS: ",    { bold: true, color: C.green, size: 17 }), run(plan.sustentabilidad.ods        || "", { size: 17 })]),
          ],
        })] }),
      ]));
      kids.push(sp());
    }

    if (form.notasExtra) {
      kids.push(tbl([TW], [bannerRow("Notas Adicionales / Adecuaciones Curriculares", C.green)]));
      kids.push(tbl([TW], [
        new TableRow({ children: [new TableCell({
          borders: brs(), margins: CM, width: { size: TW, type: WidthType.DXA },
          children: [para([run(form.notasExtra, { size: 17 })])],
        })] }),
      ]));
      kids.push(sp());
    }
  }

  // Pie
  kids.push(sp());
  kids.push(para([run(
    `Documento generado con apoyo de IA como herramienta pedagógica. El docente es responsable de su revisión y aplicación. · Prof. ${form.docente} · SEPE · USET Tlaxcala · NEM 2022`,
    { size: 14, color: "888888", italic: true }
  )], AlignmentType.CENTER));

  // ── Compilar y descargar ──────────────────────────────────────────────────
  const wordDoc = new Document({
    creator: form.docente,
    title: `Plano Didáctico – ${form.disciplina} – ${form.escuela}`,
    sections: [{
      properties: {
        page: {
          size: { width: PW, height: 16838 },
          margin: { top: MG, right: MG, bottom: MG, left: MG },
        },
      },
      children: kids,
    }],
  });

  const blob = await Packer.toBlob(wordDoc);
  const url  = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `PlanoDidactico_${form.disciplina}_${(form.escuela || "NEM").replace(/\s+/g, "_")}.docx`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


// ── Welcome Screen ─────────────────────────────────────────────────────────────
function WelcomeScreen({onStart}) {
  const [hover, setHover] = useState(false);
  const features = [
    {icon:"🎓",text:"Plan de Estudios NEM 2022"},
    {icon:"🤖",text:"IA Gemini 1.5 Flash"},
    {icon:"📝",text:"Word con formato SEPE Tlaxcala"},
    {icon:"📦",text:"Producto entregable cada 5 sesiones"},
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

  const [downloading, setDownloading] = useState(false);

  const handleDownloadWord = async () => {
    if (!planData) return;
    setDownloading(true);
    try {
      await generateWordDoc(form, planData);
    } catch(e) {
      alert("Error al generar el Word: " + e.message);
    }
    setDownloading(false);
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
          <button onClick={handleDownloadWord} disabled={downloading} style={{
            padding:"0.65rem 1.4rem",borderRadius:"0.625rem",cursor:downloading?"wait":"pointer",
            background:"white",border:"none",color:"#065f46",
            fontWeight:700,fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif",
            boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
            opacity: downloading ? 0.7 : 1,
          }}>
            {downloading ? "⏳ Generando Word…" : "📝 Descargar Word (Formato SEPE)"}
          </button>
          <button onClick={handleCopy} style={{
            padding:"0.65rem 1.2rem",borderRadius:"0.625rem",cursor:"pointer",
            background:copied?"white":"rgba(255,255,255,0.2)",border:"none",
            color:copied?"#059669":"white",fontWeight:700,fontSize:"0.82rem",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            {copied?"✓ Copiado":"📋 Copiar JSON"}
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
        <span style={{fontSize:"1.4rem"}}>📝</span>
        <div>
          <p style={{fontSize:"0.8rem",fontWeight:700,color:"#1d4ed8",fontFamily:"'DM Sans',sans-serif"}}>Word con Formato Oficial SEPE – USET Tlaxcala</p>
          <p style={{fontSize:"0.72rem",color:"#475569",fontFamily:"'DM Sans',sans-serif"}}>
            Incluye: encabezado institucional, datos del plantel, generalidades, ejes articuladores, contenido y PDA (tal como los escribiste), tabla de sesiones con producto entregable cada 5 sesiones, rúbrica de evaluación.
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
            planeacion_{(form.disciplina||"nem").toLowerCase().replace(/\s+/g,"_")}.json → .docx
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
