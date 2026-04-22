import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN Y CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Docente", icon: "👤" },
  { id: 2, label: "Contexto", icon: "🏫" },
  { id: 3, label: "Currícula", icon: "📚" },
  { id: 4, label: "Metodología", icon: "🎯" },
  { id: 5, label: "Plus", icon: "✨" },
];

const CAMPOS = [
  "Lenguajes",
  "Saberes y Pensamiento Científico",
  "Ética, Naturaleza y Sociedades",
  "De lo Humano y lo Comunitario",
];

const METODOLOGIAS = [
  "Proyecto de Aula (NEM)",
  "Aprendizaje Basado en Problemas (ABP)",
  "Aprendizaje Basado en Indagación (STEAM)",
  "Aula Invertida",
  "Aprendizaje Basado en el Servicio",
];

const initialForm = {
  docente: "Dr. Francisco De Jesús Luna Benítez", escuela: "", cct: "", municipio: "", estado: "Tlaxcala",
  grado: "", nivel: "", disciplina: "", problematica: "",
  campo: "", eje: "", contenido: "", pda: "",
  metodologia: "", sesiones: "3", duracion: "50", materiales: "",
  gamificacion: false, reciclaje: false, notasExtra: "",
};

// ─────────────────────────────────────────────────────────────────────────────
//  COMPONENTES DE APOYO
// ─────────────────────────────────────────────────────────────────────────────
const InputGroup = ({ label, help, children }) => (
  <div className="flex flex-col gap-1 mb-5">
    <label className="text-sm font-bold text-slate-700 flex justify-between">
      {label}
      {help && <span className="text-[10px] text-blue-500 font-medium italic">{help}</span>}
    </label>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  APLICACIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function AsistenteNEM() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

    const prompt = `
      Eres un experto en la Nueva Escuela Mexicana (NEM). Genera una planeación didáctica de alto nivel.
      DATOS: Docente: ${form.docente} | Escuela: ${form.escuela} | CCT: ${form.cct}
      Nivel: ${form.nivel} | Grado: ${form.grado} | Disciplina: ${form.disciplina}
      Problemática: ${form.problematica} | Campo: ${form.campo} | Eje: ${form.eje}
      Contenido: ${form.contenido} | PDA: ${form.pda} | Metodología: ${form.metodologia}
      Sesiones: ${form.sesiones} | Gamificación: ${form.gamificacion ? "SÍ" : "NO"} | Reciclaje: ${form.reciclaje ? "SÍ" : "NO"}

      INSTRUCCIONES: 
      - Usa tablas Markdown para el encabezado y la secuencia.
      - Detalla Inicio, Desarrollo y Cierre por cada sesión.
      - Incluye rúbrica de evaluación formativa.
    `;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await res.json();
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "Error al generar contenido.");
    } catch (e) {
      setResult("Error de conexión con la API.");
    }
    setLoading(false);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20">
      
      {/* ESTILOS DE IMPRESIÓN DINÁMICOS */}
      <style>{`
        @media print {
          .no-print, header, button, .stepper { display: none !important; }
          .print-area { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100% !important;
          }
          body { background: white !important; }
          .content-text { font-size: 11pt !important; color: black !important; }
        }
      `}</style>

      {/* HEADER */}
      <header className="bg-[#0f172a] p-10 text-white shadow-xl mb-8 no-print">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg rotate-3"><span className="text-3xl">👨‍🏫</span></div>
          <div>
            <h1 className="text-3xl font-black">Asistente <span className="text-blue-400">NEM</span> v3.0</h1>
            <p className="text-slate-400 text-sm">Innovación Educativa: {form.docente}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {!result ? (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            
            {/* STEPPER */}
            <div className="bg-slate-50 p-8 border-b border-slate-100 stepper">
              <div className="flex justify-between relative">
                <div className="absolute top-1/2 w-full h-1 bg-slate-200 -translate-y-1/2"></div>
                <div className="absolute top-1/2 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                {STEPS.map(s => (
                  <div key={s.id} className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${step >= s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-300'}`}>
                    <span className="text-sm font-bold">{s.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {step === 1 && (
                  <>
                    <InputGroup label="Nombre del Docente"><input className="input-style" value={form.docente} onChange={e => updateForm("docente", e.target.value)} /></InputGroup>
                    <InputGroup label="Nombre de la Escuela"><input className="input-style" value={form.escuela} placeholder="Ej. Secundaria General..." onChange={e => updateForm("escuela", e.target.value)} /></InputGroup>
                    <InputGroup label="CCT"><input className="input-style" value={form.cct} placeholder="Ej. 29DST..." onChange={e => updateForm("cct", e.target.value)} /></InputGroup>
                    <InputGroup label="Municipio"><input className="input-style" value={form.municipio} onChange={e => updateForm("municipio", e.target.value)} /></InputGroup>
                  </>
                )}

                {step === 2 && (
                  <>
                    <InputGroup label="Nivel Educativo">
                      <select className="input-style" onChange={e => updateForm("nivel", e.target.value)}>
                        <option value="">Seleccionar...</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Disciplina"><input className="input-style" placeholder="Ej. Informática" onChange={e => updateForm("disciplina", e.target.value)} /></InputGroup>
                    <div className="md:col-span-2">
                      <InputGroup label="Problemática Social/Escolar"><textarea className="input-style h-24" placeholder="Ej. Falta de cultura digital..." onChange={e => updateForm("problematica", e.target.value)} /></InputGroup>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <InputGroup label="Campo Formativo">
                      <select className="input-style" onChange={e => updateForm("campo", e.target.value)}>
                        <option value="">Seleccionar...</option>
                        {CAMPOS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </InputGroup>
                    <InputGroup label="Eje Articulador"><input className="input-style" placeholder="Ej. Pensamiento Crítico" onChange={e => updateForm("eje", e.target.value)} /></InputGroup>
                    <div className="md:col-span-2">
                      <InputGroup label="PDA (Proceso de Desarrollo)"><textarea className="input-style h-24" onChange={e => updateForm("pda", e.target.value)} /></InputGroup>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <InputGroup label="Metodología Sugerida">
                      <select className="input-style" onChange={e => updateForm("metodologia", e.target.value)}>
                        <option value="">Seleccionar...</option>
                        {METODOLOGIAS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </InputGroup>
                    <InputGroup label="Número de Sesiones"><input type="number" className="input-style" value={form.sesiones} onChange={e => updateForm("sesiones", e.target.value)} /></InputGroup>
                  </>
                )}

                {step === 5 && (
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className={`p-6 rounded-3xl border-4 cursor-pointer transition-all ${form.gamificacion ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50'}`} onClick={() => updateForm("gamificacion", !form.gamificacion)}>
                      <span className="text-2xl block mb-2">🎮</span>
                      <p className="font-bold">¿Gamificar?</p>
                    </div>
                    <div className={`p-6 rounded-3xl border-4 cursor-pointer transition-all ${form.reciclaje ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`} onClick={() => updateForm("reciclaje", !form.reciclaje)}>
                      <span className="text-2xl block mb-2">♻️</span>
                      <p className="font-bold">¿Reciclaje?</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-10 flex justify-between">
                <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="px-6 py-3 font-bold text-slate-400 disabled:opacity-0">Atrás</button>
                {step < 5 ? (
                  <button onClick={() => setStep(s => s + 1)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200">Continuar</button>
                ) : (
                  <button onClick={handleGenerate} disabled={loading} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl">
                    {loading ? "Generando..." : "🚀 Crear Planeación"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* RESULTADO */
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 print-area animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-8 no-print">
              <h2 className="text-2xl font-black">Planeación Generada</h2>
              <button onClick={() => setResult("")} className="text-blue-600 font-bold">Nueva</button>
            </div>
            
            <div className="content-text font-serif bg-slate-50 p-8 rounded-3xl border border-slate-100 whitespace-pre-wrap leading-relaxed shadow-inner overflow-auto max-h-[60vh]">
              {result}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
              <button onClick={() => window.print()} className="bg-slate-900 text-white py-5 rounded-2xl font-bold hover:scale-[1.02] transition-transform">🖨️ Guardar en PDF</button>
              <button onClick={() => {navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="bg-blue-600 text-white py-5 rounded-2xl font-bold">
                {copied ? "✅ Copiado" : "📋 Copiar Texto"}
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .input-style {
          width: 100%;
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
        }
        .input-style:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px #dbeafe;
        }
      `}</style>
    </div>
  );
}
