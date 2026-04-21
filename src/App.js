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
  docente: "", escuela: "", cct: "", municipio: "", estado: "",
  grado: "", nivel: "", disciplina: "", grupoAlumnos: "", problematica: "",
  campo: "", eje: "", contenido: "", pda: "",
  metodologia: "", sesiones: "3", duracion: "50", materiales: "",
  gamificacion: false, reciclaje: false, notasExtra: "",
};

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
        checked ? "border-blue-500 bg-blue-50 shadow-md" : "border-blue-100 bg-white/60 hover:border-blue-300"
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
      <div className="sm:col-span-2"><Input label="Nombre del Docente" required value={form.docente} onChange={f("docente")} /></div>
      <div><Input label="Nombre de la Escuela" required value={form.escuela} onChange={f("escuela")} /></div>
      <Input label="CCT" value={form.cct} onChange={f("cct")} />
      <Input label="Municipio" required value={form.municipio} onChange={f("municipio")} />
      <Input label="Estado" required value={form.estado} onChange={f("estado")} />
    </div>
  );
}

function Step2({ form, setForm, errors }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Select label="Nivel" required options={["Preescolar","Primaria","Secundaria"]} value={form.nivel} onChange={f("nivel")} />
      <Select label="Grado" required options={["1°","2°","3°","4°","5°","6°"]} value={form.grado} onChange={f("grado")} />
      <Input label="Asignatura" required value={form.disciplina} onChange={f("disciplina")} />
      <Input label="Alumnos" type="number" value={form.grupoAlumnos} onChange={f("grupoAlumnos")} />
      <div className="sm:col-span-2"><Textarea label="Problemática" required value={form.problematica} onChange={f("problematica")} /></div>
    </div>
  );
}

function Step3({ form, setForm, errors }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="flex flex-col gap-4">
      <Select label="Campo Formativo" required options={CAMPOS} value={form.campo} onChange={f("campo")} />
      <Input label="Eje Articulador" required value={form.eje} onChange={f("eje")} />
      <Textarea label="Contenido" required value={form.contenido} onChange={f("contenido")} />
      <Textarea label="PDA" required value={form.pda} onChange={f("pda")} />
    </div>
  );
}

function Step4({ form, setForm, errors }) {
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="flex flex-col gap-4">
      <Select label="Metodología" required options={METODOLOGIAS} value={form.metodologia} onChange={f("metodologia")} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Sesiones" type="number" value={form.sesiones} onChange={f("sesiones")} />
        <Input label="Minutos" type="number" value={form.duracion} onChange={f("duracion")} />
      </div>
      <Textarea label="Materiales" required value={form.materiales} onChange={f("materiales")} />
    </div>
  );
}

function Step5({ form, setForm }) {
  const toggle = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="flex flex-col gap-4">
      <Toggle label="🎮 Gamificación" checked={form.gamificacion} onChange={toggle("gamificacion")} />
      <Toggle label="♻️ Reciclaje" checked={form.reciclaje} onChange={toggle("reciclaje")} />
      <Textarea label="Notas" value={form.notasExtra} onChange={f("notasExtra")} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP PRINCIPAL
// ─────────────────────────────────────────────
export default function AsistenteNEM() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");

    // CAMBIO CLAVE: Usar la variable de entorno
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

    const prompt = `Actúa como asesor NEM. Genera planeación detallada para:
    Docente: ${form.docente}, Escuela: ${form.escuela}, Problematica: ${form.problematica}, 
    PDA: ${form.pda}, Metodología: ${form.metodologia}.
    Incluye Inicio, Desarrollo y Cierre por cada sesión. Estructura con tablas y negritas.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: prompt }] 
            }]
          })
        }
      );
      const data = await res.json();
      if (data.error) {
        setResult(`⚠️ Error de Google: ${data.error.message}`);
      } else {
        setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "No se generó respuesta.");
      }
    } catch (err) {
      setResult("❌ Error de conexión: " + err.message);
    }
    setLoading(false);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-blue-800 p-5 shadow-lg text-white text-center">
        <h1 className="font-bold text-xl">Asistente Pedagógico NEM</h1>
        <p className="text-xs">Dr. Francisco De Jesús Luna Benítez</p>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        {!result ? (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
            <div className="h-1.5 bg-blue-100 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            
            {step === 1 && <Step1 form={form} setForm={setForm} />}
            {step === 2 && <Step2 form={form} setForm={setForm} />}
            {step === 3 && <Step3 form={form} setForm={setForm} />}
            {step === 4 && <Step4 form={form} setForm={setForm} />}
            {step === 5 && <Step5 form={form} setForm={setForm} />}

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="px-4 py-2 border rounded-lg disabled:opacity-30">Anterior</button>
              {step < 5 ? (
                <button onClick={() => setStep(s => s + 1)} className="bg-blue-700 text-white px-6 py-2 rounded-lg">Siguiente</button>
              ) : (
                <button onClick={handleGenerate} disabled={loading} className="bg-emerald-600 text-white px-6 py-2 rounded-lg">
                  {loading ? "Generando..." : "Generar Planeación"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-lg whitespace-pre-wrap font-mono text-sm border border-slate-200">
            <div className="flex justify-between mb-4">
               <h2 className="font-bold">Resultado:</h2>
               <button onClick={() => setResult("")} className="text-blue-600 text-xs underline">Nueva planeación</button>
            </div>
            {result}
          </div>
        )}
      </main>
    </div>
  );
}
