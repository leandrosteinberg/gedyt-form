import React, { useState } from 'react';
import { FileText, ChevronRight, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function GedytHealthForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombreApellido: '', dni: '', edad: '', peso: '', altura: '', email: '', telefono: '',
    codigoPostal: '', coberturaSalud: '', numeroAfiliado: '', estudio: '', medicoDeriva: '',
    alergiaLatex: '', alergiaMedicamentos: '', medicamentosAlergia: '', diabetes: '', insulina: '',
    fuma: '', cigarrillosDia: '', desdeCuando: '', alcohol: '', vasosPorComida: '',
    enfermedadTransmisible: '', cualTransmisible: '', epilepsia: '', hepatitis: '', tipoHepatitis: '',
    medicamentosObesidad: '', enfermedadCardiaca: '', marcapasos: '', hipertension: '',
    accidenteCerebrovascular: '', dialisis: '', epoc: '', anticoagulado: '', problemaAnestesia: '',
    otraEnfermedad: '', cualEnfermedad: '', discapacidad: '', cualDiscapacidad: '', embarazada: '',
    ansiedadNivel: '5', medicamentosHabituales: '', operacionesAnio: '', fechaOperacion: ''
  });

  const totalSteps = 4;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getProgress = () => {
    const fields = Object.values(formData).filter(val => val !== '').length;
    const total = Object.keys(formData).length;
    return Math.round((fields / total) * 100);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Formulario enviado:', formData);
    alert('Declaración jurada enviada correctamente. Recibirás una confirmación por email.');
  };

  const YesNoSelect = ({ field, label }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-4">
        {['SI', 'NO', 'NO SABE'].map(option => (
          <label key={option} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={field}
              value={option}
              checked={formData[field] === option}
              onChange={(e) => updateField(field, e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">GEDYT</h1>
              <p className="text-sm text-gray-600">Gastroenterología Diagnóstica y Terapéutica</p>
            </div>
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Declaración Jurada de Salud</h2>
          <p className="text-sm text-gray-600 mt-1">Versión: 02.10.2025</p>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso del formulario</span>
              <span className="text-sm font-medium text-blue-600">{getProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s === step ? 'bg-blue-600 text-white' : 
                  s < step ? 'bg-green-500 text-white' : 
                  'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {s === 1 ? 'Datos' : s === 2 ? 'Alergias' : s === 3 ? 'Historial' : 'Revisión'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg p-6">
          
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                Datos Personales
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido *</label>
                  <input
                    type="text"
                    value={formData.nombreApellido}
                    onChange={(e) => updateField('nombreApellido', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">D.N.I *</label>
                  <input
                    type="text"
                    value={formData.dni}
                    onChange={(e) => updateField('dni', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => updateField('edad', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg) *</label>
                  <input
                    type="number"
                    value={formData.peso}
                    onChange={(e) => updateField('peso', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm) *</label>
                  <input
                    type="number"
                    value={formData.altura}
                    onChange={(e) => updateField('altura', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => updateField('telefono', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={formData.codigoPostal}
                    onChange={(e) => updateField('codigoPostal', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cobertura de Salud</label>
                  <input
                    type="text"
                    value={formData.coberturaSalud}
                    onChange={(e) => updateField('coberturaSalud', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° de Afiliado</label>
                  <input
                    type="text"
                    value={formData.numeroAfiliado}
                    onChange={(e) => updateField('numeroAfiliado', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estudio a Efectuar</label>
                  <input
                    type="text"
                    value={formData.estudio}
                    onChange={(e) => updateField('estudio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Médico que lo deriva</label>
                  <input
                    type="text"
                    value={formData.medicoDeriva}
                    onChange={(e) => updateField('medicoDeriva', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                Alergias y Hábitos
              </h3>

              <YesNoSelect field="alergiaLatex" label="¿Sos alérgico al látex?" />
              
              <YesNoSelect field="alergiaMedicamentos" label="¿Sos alérgico a algún medicamento?" />
              
              {formData.alergiaMedicamentos === 'SI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enumerar a cuál/es:</label>
                  <textarea
                    value={formData.medicamentosAlergia}
                    onChange={(e) => updateField('medicamentosAlergia', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                  />
                </div>
              )}

              <YesNoSelect field="diabetes" label="¿Sufrís de diabetes?" />
              
              {formData.diabetes === 'SI' && (
                <YesNoSelect field="insulina" label="¿Requerís insulina?" />
              )}

              <YesNoSelect field="fuma" label="¿Fumás?" />
              
              {formData.fuma === 'SI' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuántos cigarrillos por día?</label>
                    <input
                      type="number"
                      value={formData.cigarrillosDia}
                      onChange={(e) => updateField('cigarrillosDia', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">¿Desde cuándo?</label>
                    <input
                      type="text"
                      value={formData.desdeCuando}
                      onChange={(e) => updateField('desdeCuando', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 5 años"
                    />
                  </div>
                </div>
              )}

              <YesNoSelect field="alcohol" label="¿Consumís alcohol?" />
              
              {formData.alcohol === 'SI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuántos vasos por comida?</label>
                  <input
                    type="number"
                    value={formData.vasosPorComida}
                    onChange={(e) => updateField('vasosPorComida', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <YesNoSelect field="enfermedadTransmisible" label="¿Padecés alguna enfermedad transmisible?" />
              
              {formData.enfermedadTransmisible === 'SI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuál?</label>
                  <input
                    type="text"
                    value={formData.cualTransmisible}
                    onChange={(e) => updateField('cualTransmisible', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                Historial Médico
              </h3>

              <YesNoSelect 
                field="enfermedadCardiaca" 
                label="¿Fuiste tratado o sufriste alguna enfermedad cardíaca como arritmia, infarto o insuficiencia cardíaca?" 
              />

              <YesNoSelect 
                field="marcapasos" 
                label="¿Tenés colocado un marcapasos o un cardiodesfibrilador?" 
              />

              <YesNoSelect 
                field="hipertension" 
                label="¿Tenés antecedentes de enfermedad de hipertensión arterial?" 
              />

              <YesNoSelect 
                field="accidenteCerebrovascular" 
                label="¿Fuiste tratado o en alguna oportunidad sufriste un accidente cerebrovascular?" 
              />

              <YesNoSelect 
                field="dialisis" 
                label="¿Estás realizando diálisis? ¿Tenés insuficiencia renal crónica?" 
              />

              <YesNoSelect 
                field="epoc" 
                label="¿Sufrís EPOC, asma, alguna otra enfermedad pulmonar o usás oxígeno domiciliario o CPAP?" 
              />

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Importante sobre anticoagulación</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Si la respuesta es SI, deberá consultar con el médico que maneja la anticoagulación para suspender la medicación previamente al estudio y enviar una nota escrita y firmada.
                    </p>
                  </div>
                </div>
              </div>

              <YesNoSelect 
                field="anticoagulado" 
                label="¿Estás anticoagulado o tenés doble antiagregación plaquetaria?" 
              />

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Medicamentos para obesidad o diabetes</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Si la respuesta es SI, consulte con su médico para suspender la medicación. Formas orales: suspender 3 días antes. Aplicaciones semanales: suspender 1 semana antes o más.
                    </p>
                  </div>
                </div>
              </div>

              <YesNoSelect 
                field="medicamentosObesidad" 
                label="¿Recibís medicamentos para la obesidad o diabetes tipo Semaglutide, Liraglutide, Dilaglutide, Tirzepatide u otros similares?" 
              />

              <YesNoSelect field="epilepsia" label="¿Sufrís o sufriste de epilepsia y/o convulsiones?" />

              <YesNoSelect field="hepatitis" label="¿Tuviste hepatitis?" />
              
              {formData.hepatitis === 'SI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Recordás de qué tipo?</label>
                  <input
                    type="text"
                    value={formData.tipoHepatitis}
                    onChange={(e) => updateField('tipoHepatitis', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Tipo A, B, C"
                  />
                </div>
              )}

              <YesNoSelect field="problemaAnestesia" label="¿Tuviste algún problema con la anestesia alguna vez?" />

              <YesNoSelect field="otraEnfermedad" label="¿Sufrís de alguna otra enfermedad?" />
              
              {formData.otraEnfermedad === 'SI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuál?</label>
                  <textarea
                    value={formData.cualEnfermedad}
                    onChange={(e) => updateField('cualEnfermedad', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                  />
                </div>
              )}

              <YesNoSelect field="discapacidad" label="¿Tenés alguna discapacidad motora, visual o auditiva significativa?" />
              
              {formData.discapacidad === 'SI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuál?</label>
                  <textarea
                    value={formData.cualDiscapacidad}
                    onChange={(e) => updateField('cualDiscapacidad', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                  />
                </div>
              )}

              <YesNoSelect field="embarazada" label="¿Estás embarazada o creés estarlo?" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                Información Adicional
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificar el grado de ansiedad por el procedimiento (1 a 10):
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.ansiedadNivel}
                    onChange={(e) => updateField('ansiedadNivel', e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                    {formData.ansiedadNivel}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Sin ansiedad</span>
                  <span>Muy ansioso</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enumerar qué medicamentos o drogas tomás en forma habitual:
                </label>
                <textarea
                  value={formData.medicamentosHabituales}
                  onChange={(e) => updateField('medicamentosHabituales', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Ej: Aspirina 100mg, Enalapril 10mg..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enumerar de qué lo operaron este año (si corresponde):
                </label>
                <textarea
                  value={formData.operacionesAnio}
                  onChange={(e) => updateField('operacionesAnio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
              </div>

              {formData.operacionesAnio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de la operación:</label>
                  <input
                    type="date"
                    value={formData.fechaOperacion}
                    onChange={(e) => updateField('fechaOperacion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">Recordatorios importantes:</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• El acompañante debe ser mayor de edad</li>
                  <li>• Es indispensable enviar el Riesgo Quirúrgico antes del quinto día hábil del estudio</li>
                  <li>• Recibirás una confirmación por email una vez procesada tu declaración</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="text-xs text-gray-600 italic">
                  En caso en que el paciente no se encuentre en condiciones de comprender la información suministrada, 
                  el consentimiento será firmado por el pariente más cercano o allegado que se ocupe de su asistencia. 
                  Si el paciente tiene entre 16 y 18 años y lo deciden ellos mismos, sugerimos que uno de los padres firme también.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Anterior
              </button>
            )}
            
            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
              >
                Siguiente
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-auto"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Enviar Declaración
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>011 5288 6100 | www.gedyt.com.ar</p>
        </div>
      </div>
    </div>
  );
}