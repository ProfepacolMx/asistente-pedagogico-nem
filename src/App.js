import { useState, useCallback } from "react";

// ─────────────────────────────────────────────
//  PALETA Y UTILIDADES
// ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Datos Generales",   icon: "👤" },
  { id: 2, label: "Contexto",          icon: "🏫" },
  { id: 3, label: "Currícula",         icon: "📚" },
  { id: 4, label: "Estrategia",        icon: "🎯" },
  { id: 5, label: "Extras",            icon: "✨" },
];

const CAMPOS = [
  "Lenguajes",
  "Saberes y Pensamiento Científico",
  "Ética, Naturaleza y Sociedades",
  "De lo Humano y lo Comunitario",
];

const METODOLOGIAS = [
  "Proyecto de Aula",
  "Aprendizaje Basado en Problemas (ABP)",
  "Aprendizaje Basado en Indagación",
  "Aula Invertida",
  "Aprendizaje Cooperativo",
  "Aprendizaje Basado en el Servicio",
];

const initialForm = {
  // Paso 1
  docente: "", escuela: "", cct: "", municipio: "", estado: "",
  // Paso 2
  grado: "", nivel: "", disciplina: "", grupoAlumnos: "", problematica: "",
  // Paso 3
  campo: "", eje: "", contenido: "", pda: "",
  // Paso 4
  metodologia: "", sesiones: "3", duracion: "50", materiales: "",
  // Paso 5
  gamificacion: false, reciclaje: false, notasExtra: "",
};

// ─────────────────────────────────────────────
//  MOCK DE PLANEACIÓN
// ─────────────────────────────────────────────
function generarMockPlaneacion(form) {
  return `
╔══════════════════════════════════════════════════════════════════════╗
║          PLANEACIÓN DIDÁCTICA – NUEVA ESCUELA MEXICANA (NEM)         ║
╚══════════════════════════════════════════════════════════════════════╝

📋 DATOS GENERALES
──────────────────
• Docente      : ${form.docente || "Dr. Francisco De Jesús Luna Benítez"}
• Escuela      : ${form.escuela || "N/A"}  |  CCT: ${form.cct || "—"}
• Municipio    : ${form.municipio || "—"}, ${form.estado || "—"}
• Grado/Nivel  : ${form.grado || "—"} – ${form.nivel || "—"}
• Disciplina   : ${form.disciplina || "—"}
• Grupo        : ${form.grupoAlumnos || "—"} alumnos

🔍 PROBLEMÁTICA CONTEXTUAL
──────────────────────────
${form.problematica || "Se parte de la realidad del estudiante como eje articulador del aprendizaje."}

📚 REFERENTES CURRICULARES
──────────────────────────
• Campo Formativo : ${form.campo || "—"}
• Eje             : ${form.eje || "—"}
• Contenido       : ${form.contenido || "—"}
• Proceso de Desarrollo del Aprendizaje (PDA):
  "${form.pda || "Desarrolla habilidades cognitivas y socioemocionales a través de situaciones auténticas."}"

🎯 INTENCIÓN DIDÁCTICA
──────────────────────
Que el estudiantado sea capaz de comprender y analizar la problemática planteada,
desarrollando pensamiento crítico, habilidades colaborativas y compromiso comunitario
en el marco del ${form.campo || "campo formativo correspondiente"}.

📅 SECUENCIA DE ACTIVIDADES (${form.sesiones || "3"} sesiones de ${form.duracion || "50"} min)
─────────────────────────────────────────────────────
📌 Sesión 1 – Activación y Diagnóstico
   • Lluvia de ideas sobre la problemática central.
   • Preguntas detonadoras para activar conocimientos previos.
   • Registro colaborativo en pizarrón participativo.
   • Cierre: acuerdo grupal sobre rutas de indagación.

📌 Sesión 2 – Desarrollo y Construcción
   • Trabajo en equipos con roles definidos (${form.metodologia || "Aprendizaje Basado en Proyectos"}).
   • Análisis de fuentes primarias y secundarias.
   • Elaboración de producto parcial (infografía / mapa conceptual / experimento).
   • Socialización entre equipos y retroalimentación formativa.

📌 Sesión ${form.sesiones > 2 ? "3" : "Final"} – Cierre, Evaluación y Transferencia
   • Presentación del producto final al grupo.
   • Reflexión metacognitiva: ¿Qué aprendí? ¿Cómo lo aplico?
   • Evaluación formativa mediante rúbrica de desempeño.
   • Vinculación con el entorno comunitario.

🧰 MATERIALES Y RECURSOS
─────────────────────────
${form.materiales ? form.materiales : "• Cartulinas, marcadores, tijeras\n• Dispositivos con acceso a internet\n• Libros de texto SEP gratuitos\n• Material reciclado del entorno"}${form.reciclaje ? "\n• ♻️  Se priorizan materiales reciclados y de bajo costo" : ""}

${form.gamificacion ? `🎮 ESTRATEGIA DE GAMIFICACIÓN
──────────────────────────────
• Sistema de puntos por participación y colaboración.
• Insignias digitales para reconocimiento de logros.
• Tablero de progreso visible para el grupo.
• Retos opcionales para profundización voluntaria.

` : ""}📊 EVALUACIÓN
─────────────
• Diagnóstica  : Exploración inicial de saberes previos.
• Formativa    : Observación, diálogo docente-alumno, autoevaluación.
• Sumativa     : Rúbrica holística de producto y proceso (Co-evaluación).
• Criterios    : Participación, pensamiento crítico, colaboración, producto final.

🌱 NOTAS ADICIONALES / ADECUACIONES
─────────────────────────────────────
${form.notasExtra || "Sin notas adicionales. El docente puede adaptar esta planeación según las necesidades específicas del grupo y del contexto escolar."}

══════════════════════════════════════════════════════════════════════
⚠️  Este documento fue generado con apoyo de IA como herramienta de
    apoyo pedagógico. El docente es responsable de su revisión y ajuste.
══════════════════════════════════════════════════════════════════════
`.trim();
}

// ─────────────────────────────────────────────
//  COMPONENTES AUXILIARES
// ─────────────────────────────────────────────
function Input({ label, required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-blue-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className="rounded-lg border border-blue-200 bg-white/70 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
      />
    </div>
  );
}

function Textarea({ label, required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-blue-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...props}
        rows={3}
        className="rounded-lg border border-blue-200 bg-white/70 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none"
      />
    </div>
  );
}

function Select({ label, required, options, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-blue-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className="rounded-lg border border-blue-200 bg-white/70 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
      >
        <option value="">— Seleccionar —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 w-full ${
        checked
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-blue-100 bg-white/60 hover:border-blue-300"
      }`}
    >
      <div className={`mt-0.5 h-5 w-10 flex-shrink-0 rounded-full transition-colors duration-200 relative ${checked ? "bg-blue-600" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <div>
        <p className="font-semibold text-slate-800 text-sm">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
//  PANTALLAS DE PASOS
// ─────────────────────────────────────────────
function Step1({ form, setForm, errors }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Input label="Nombre del Docente" required value={form.docente} onChange={f("docente")}
          placeholder="Dr. Francisco De Jesús Luna Benítez" />
        {errors.docente && <p className="text-red-500 text-xs mt-1">{errors.docente}</p>}
      </div>
      <div>
        <Input label="Nombre de la Escuela" required value={form.escuela} onChange={f("escuela")}
          placeholder="Ej. Primaria 'Benito Juárez'" />
        {errors.escuela && <p className="text-red-500 text-xs mt-1">{errors.escuela}</p>}
      </div>
      <Input label="CCT" value={form.cct} onChange={f("cct")} placeholder="Ej. 13EPR0001A" />
      <Input label="Municipio" required value={form.municipio} onChange={f("municipio")}
        placeholder="Ej. Pachuca de Soto" />
      {errors.municipio && <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>}
      <Input label="Estado" required value={form.estado} onChange={f("estado")}
        placeholder="Ej. Hidalgo" />
      {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
    </div>
  );
}

function Step2({ form, setForm, errors }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Select label="Nivel Educativo" required options={["Preescolar","Primaria","Secundaria","Media Superior"]}
        value={form.nivel} onChange={f("nivel")} />
      {errors.nivel && <p className="text-red-500 text-xs mt-1">{errors.nivel}</p>}
      <Select label="Grado" required
        options={["1°","2°","3°","4°","5°","6°"]}
        value={form.grado} onChange={f("grado")} />
      {errors.grado && <p className="text-red-500 text-xs mt-1">{errors.grado}</p>}
      <Input label="Disciplina / Asignatura" required value={form.disciplina} onChange={f("disciplina")}
        placeholder="Ej. Matemáticas, Español, Ciencias..." />
      {errors.disciplina && <p className="text-red-500 text-xs mt-1">{errors.disciplina}</p>}
      <Input label="No. de Alumnos en el Grupo" value={form.grupoAlumnos} onChange={f("grupoAlumnos")}
        type="number" min="1" placeholder="30" />
      <div className="sm:col-span-2">
        <Textarea label="Problemática o Situación del Contexto" required
          value={form.problematica} onChange={f("problematica")}
          placeholder="Describe la problemática real o situación del entorno que motivará el aprendizaje..." />
        {errors.problematica && <p className="text-red-500 text-xs mt-1">{errors.problematica}</p>}
      </div>
    </div>
  );
}

function Step3({ form, setForm, errors }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="flex flex-col gap-4">
      <Select label="Campo Formativo" required options={CAMPOS}
        value={form.campo} onChange={f("campo")} />
      {errors.campo && <p className="text-red-500 text-xs mt-1">{errors.campo}</p>}
      <Input label="Eje Articulador" required value={form.eje} onChange={f("eje")}
        placeholder="Ej. Pensamiento crítico, Interculturalidad crítica..." />
      {errors.eje && <p className="text-red-500 text-xs mt-1">{errors.eje}</p>}
      <Textarea label="Contenido" required value={form.contenido} onChange={f("contenido")}
        placeholder="Describe el contenido temático a abordar..." />
      {errors.contenido && <p className="text-red-500 text-xs mt-1">{errors.contenido}</p>}
      <Textarea label="Proceso de Desarrollo del Aprendizaje (PDA)" required value={form.pda} onChange={f("pda")}
        placeholder="Ej. Reconoce y aplica fracciones en situaciones de la vida cotidiana..." />
      {errors.pda && <p className="text-red-500 text-xs mt-1">{errors.pda}</p>}
    </div>
  );
}

function Step4({ form, setForm, errors }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="flex flex-col gap-4">
      <Select label="Metodología Didáctica" required options={METODOLOGIAS}
        value={form.metodologia} onChange={f("metodologia")} />
      {errors.metodologia && <p className="text-red-500 text-xs mt-1">{errors.metodologia}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            Número de Sesiones <span className="text-red-500">*</span>
          </label>
          <input type="number" min="1" max="20" value={form.sesiones} onChange={f("sesiones")}
            className="rounded-lg border border-blue-200 bg-white/70 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-blue-700">Duración (min/sesión)</label>
          <input type="number" min="20" max="120" step="5" value={form.duracion} onChange={f("duracion")}
            className="rounded-lg border border-blue-200 bg-white/70 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
        </div>
      </div>
      <Textarea label="Materiales y Recursos" required value={form.materiales} onChange={f("materiales")}
        placeholder="Lista los materiales, libros, herramientas digitales o recursos que se utilizarán..." />
      {errors.materiales && <p className="text-red-500 text-xs mt-1">{errors.materiales}</p>}
    </div>
  );
}

function Step5({ form, setForm }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const toggle = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="flex flex-col gap-4">
      <Toggle
        label="🎮 Incorporar Gamificación"
        description="Añade puntos, insignias y retos para aumentar la motivación del alumnado."
        checked={form.gamificacion}
        onChange={toggle("gamificacion")}
      />
      <Toggle
        label="♻️ Enfoque de Sustentabilidad / Reciclaje"
        description="Usa materiales reciclados y vincula la actividad con la educación ambiental."
        checked={form.reciclaje}
        onChange={toggle("reciclaje")}
      />
      <Textarea label="Notas adicionales / Adecuaciones curriculares"
        value={form.notasExtra} onChange={f("notasExtra")}
        placeholder="Alumnos con NEE, adecuaciones de acceso o curriculares, contexto especial..." />
    </div>
  );
}

// ─────────────────────────────────────────────
//  VALIDACIÓN POR PASO
// ─────────────────────────────────────────────
function validateStep(step, form) {
  const err = {};
  if (step === 1) {
    if (!form.docente.trim())   err.docente   = "El nombre del docente es obligatorio.";
    if (!form.escuela.trim())   err.escuela   = "El nombre de la escuela es obligatorio.";
    if (!form.municipio.trim()) err.municipio = "El municipio es obligatorio.";
    if (!form.estado.trim())    err.estado    = "El estado es obligatorio.";
  }
  if (step === 2) {
    if (!form.nivel)             err.nivel      = "Selecciona el nivel educativo.";
    if (!form.grado)             err.grado      = "Selecciona el grado.";
    if (!form.disciplina.trim()) err.disciplina = "La disciplina es obligatoria.";
    if (!form.problematica.trim()) err.problematica = "Describe la problemática del contexto.";
  }
  if (step === 3) {
    if (!form.campo)            err.campo    = "Selecciona el campo formativo.";
    if (!form.eje.trim())       err.eje      = "El eje articulador es obligatorio.";
    if (!form.contenido.trim()) err.contenido = "El contenido es obligatorio.";
    if (!form.pda.trim())       err.pda      = "El PDA es obligatorio.";
  }
  if (step === 4) {
    if (!form.metodologia)       err.metodologia = "Selecciona una metodología.";
    if (!form.materiales.trim()) err.materiales  = "Lista los materiales y recursos.";
  }
  return err;
}

// ─────────────────────────────────────────────
//  APP PRINCIPAL
// ─────────────────────────────────────────────
export default function AsistenteNEM() {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState(initialForm);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState("");
  const [copied, setCopied]       = useState(false);

  const goNext = () => {
    const err = validateStep(step, form);
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const goBack = () => { setErrors({}); setStep(s => s - 1); };

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");

    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

    const prompt = `
Eres un experto en diseño curricular de la Nueva Escuela Mexicana (NEM) de México.
Genera una planeación didáctica completa, coherente y lista para usar en el aula, con base en los siguientes datos:

DOCENTE: ${form.docente}
ESCUELA: ${form.escuela} | CCT: ${form.cct}
UBICACIÓN: ${form.municipio}, ${form.estado}
NIVEL: ${form.nivel} | GRADO: ${form.grado}
DISCIPLINA: ${form.disciplina}
ALUMNOS EN EL GRUPO: ${form.grupoAlumnos || "No especificado"}

PROBLEMÁTICA CONTEXTUAL:
${form.problematica}

CAMPO FORMATIVO: ${form.campo}
EJE ARTICULADOR: ${form.eje}
CONTENIDO: ${form.contenido}
PDA (Proceso de Desarrollo del Aprendizaje): ${form.pda}

METODOLOGÍA: ${form.metodologia}
NÚMERO DE SESIONES: ${form.sesiones}
DURACIÓN POR SESIÓN: ${form.duracion} minutos
MATERIALES: ${form.materiales}

GAMIFICACIÓN: ${form.gamificacion ? "Sí, incluir estrategia de gamificación (puntos, insignias, retos)" : "No"}
SUSTENTABILIDAD/RECICLAJE: ${form.reciclaje ? "Sí, incorporar enfoque de reciclaje y materiales sustentables" : "No"}
NOTAS ADICIONALES: ${form.notasExtra || "Ninguna"}

Genera la planeación con las siguientes secciones claramente diferenciadas:
1. Encabezado con todos los datos institucionales
2. Intención didáctica
3. Aprendizajes esperados (basados en el PDA)
4. Secuencia didáctica detallada (inicio, desarrollo y cierre) para CADA sesión
5. Materiales y recursos
6. Estrategia de evaluación (diagnóstica, formativa y sumativa) con criterios
7. Adecuaciones curriculares si aplica
${form.gamificacion ? "8. Estrategia de gamificación detallada" : ""}
${form.reciclaje ? "9. Vinculación con educación ambiental y uso de materiales reciclados" : ""}

Usa lenguaje pedagógico profesional, alineado al enfoque humanista y comunitario de la NEM.
Estructura la respuesta con encabezados claros usando ═, ─ y • para que sea fácil de leer.
    `.trim();

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
          })
        }
      );
      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (output) {
        setResult(output);
      } else {
        setResult("⚠️ No se recibió respuesta de Gemini. Verifica tu API Key o intenta de nuevo.\n\nDetalle: " + JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setResult("❌ Error al conectar con Gemini:\n" + err.message);
    }

    setLoading(false);
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [result]);

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-4">
          <div className="flex-shrink-0 bg-white/20 rounded-xl p-2.5">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="white" fillOpacity="0.15"/>
              <path d="M8 22 L16 8 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 18 h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-tight tracking-tight">
              Asistente Pedagógico NEM
            </h1>
            <p className="text-blue-200 text-xs mt-0.5">
              Dr. Francisco De Jesús Luna Benítez • Nueva Escuela Mexicana
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
            <span className="text-blue-200 text-xs">SEP</span>
            <span className="text-white/40 text-xs">·</span>
            <span className="text-blue-200 text-xs">NEM 2025</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Stepper */}
        {!result && (
          <div className="mb-8">
            {/* Barra de progreso */}
            <div className="relative h-1.5 bg-blue-100 rounded-full mb-5 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Pasos */}
            <div className="flex justify-between">
              {STEPS.map(s => (
                <div key={s.id} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => s.id < step && setStep(s.id)}
                    className={`w-9 h-9 rounded-full border-2 text-sm flex items-center justify-center transition-all duration-200 font-bold
                      ${step === s.id
                        ? "bg-blue-700 border-blue-700 text-white shadow-lg scale-110"
                        : s.id < step
                        ? "bg-blue-100 border-blue-500 text-blue-700 cursor-pointer hover:scale-105"
                        : "bg-white border-blue-100 text-slate-300 cursor-default"
                      }`}
                  >
                    {s.id < step ? "✓" : s.icon}
                  </button>
                  <span className={`text-xs text-center leading-tight max-w-[60px] hidden sm:block
                    ${step === s.id ? "text-blue-700 font-semibold" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tarjeta del formulario */}
        {!result ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">{STEPS[step-1].icon}</span>
              <div>
                <p className="text-blue-200 text-xs uppercase tracking-widest">Paso {step} de {STEPS.length}</p>
                <h2 className="text-white font-bold text-lg leading-tight">{STEPS[step-1].label}</h2>
              </div>
            </div>

            <div className="p-6">
              {step === 1 && <Step1 form={form} setForm={setForm} errors={errors} />}
              {step === 2 && <Step2 form={form} setForm={setForm} errors={errors} />}
              {step === 3 && <Step3 form={form} setForm={setForm} errors={errors} />}
              {step === 4 && <Step4 form={form} setForm={setForm} errors={errors} />}
              {step === 5 && <Step5 form={form} setForm={setForm} />}
            </div>

            {/* Navegación */}
            <div className="px-6 pb-6 flex justify-between items-center gap-3">
              <button
                onClick={goBack}
                disabled={step === 1}
                className="px-5 py-2.5 rounded-xl border-2 border-blue-200 text-blue-700 text-sm font-semibold disabled:opacity-30 hover:bg-blue-50 transition-all"
              >
                ← Anterior
              </button>

              {step < 5 ? (
                <button
                  onClick={goNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-sky-500 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Generando planeación…
                    </>
                  ) : (
                    <>✨ Generar Planeación con IA</>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── RESULTADO ── */
          <div className="flex flex-col gap-4">
            {/* Encabezado resultado */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📄</span>
                <div>
                  <p className="text-emerald-100 text-xs uppercase tracking-widest">Listo</p>
                  <h2 className="text-white font-bold text-lg">Planeación Generada</h2>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    copied
                      ? "bg-white text-emerald-700"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {copied ? "✓ Copiado" : "📋 Copiar"}
                </button>
                <button
                  onClick={() => { setResult(""); setStep(1); setForm(initialForm); }}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-all"
                >
                  Nueva
                </button>
              </div>
            </div>

            {/* Texto de la planeación */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"/>
                <span className="w-3 h-3 rounded-full bg-yellow-400"/>
                <span className="w-3 h-3 rounded-full bg-green-400"/>
                <span className="text-slate-400 text-xs ml-2 font-mono">planeacion_nem.txt</span>
              </div>
              <pre className="p-6 text-sm text-slate-800 font-mono leading-relaxed whitespace-pre-wrap overflow-auto max-h-[65vh]">
                {result}
              </pre>
            </div>

            <p className="text-center text-xs text-slate-400">
              ⚠️ Este documento es un apoyo pedagógico generado con IA. Revísalo y adáptalo antes de aplicarlo.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
