  import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle, FileText, User, CreditCard, QrCode, Download, Mail } from 'lucide-react';

const CheckinOnline = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Datos personales
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    cp: '',
    edad: '',
    peso: '',
    altura: '',
    fechaNacimiento: '',
    cobertura: '', // Particular / Nombre de obra social
    nroAfiliado: '',
    estudio: '',
    
    // Paso 2: Médico derivante
    medicoNombre: '',
    medicoMatricula: '',
    medicoTipoMatricula: 'MN',
    medicoTelefono: '',
    medicoEmail: '',
    
    // Paso 3: Documentación
    ordenMedica: null,
    autorizacion: null,
    requiereAutorizacion: false, // Se calcula según cobertura
    
    // Paso 4: DJS
    alergiaLatex: '',
    alergiaMedicamentos: '',
    medicamentosAlergicos: '',
    diabetes: '',
    insulina: '',
    fuma: '',
    cigarrillosDia: '',
    desdeQuando: '',
    alcohol: '',
    vasosComida: '',
    enfermedadTransmisible: '',
    cualEnfermedad: '',
    epilepsia: '',
    hepatitis: '',
    tipoHepatitis: '',
    medicamentosObesidad: '',
    enfermedadCardiaca: '',
    marcapasos: '',
    hipertension: '',
    accidenteCerebrovascular: '',
    dialisis: '',
    epoc: '',
    anticoagulado: '',
    notaMedicoAnticoagulacion: null,
    problemaAnestesia: '',
    otraEnfermedad: '',
    cualOtraEnfermedad: '',
    discapacidad: '',
    cualDiscapacidad: '',
    embarazada: '',
    medicamentosHabituales: '',
    operacionesAnio: '',
    nivelAnsiedad: 5,
    
    // Paso 5: Consentimiento
    leyoConsentimiento: false,
    aceptaConsentimiento: false,
    
    // Paso 6: Pago (solo si es particular)
    condicionIVA: '',
    metodoPago: '',
    pagoCompletado: false,
    
    // QR final
    qrData: null
  });

  const [warnings, setWarnings] = useState([]);
  const [showConsentimiento, setShowConsentimiento] = useState(false);
  const qrRef = useRef(null);

  const updateField = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Lógica automática: si cobertura es "Particular", no requiere autorización
      if (field === 'cobertura') {
        newData.requiereAutorizacion = value !== 'Particular' && value !== '';
      }
      
      return newData;
    });
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    const newWarnings = [];
    
    if (step === 1) {
      if (!formData.nombre) newWarnings.push('Debe ingresar nombre y apellido');
      if (!formData.dni) newWarnings.push('Debe ingresar DNI');
      if (!formData.email) newWarnings.push('Debe ingresar email');
      if (!formData.telefono) newWarnings.push('Debe ingresar teléfono');
      if (!formData.edad) newWarnings.push('Debe ingresar edad');
      if (!formData.peso) newWarnings.push('Debe ingresar peso');
      if (!formData.altura) newWarnings.push('Debe ingresar altura');
      if (!formData.cobertura) newWarnings.push('Debe seleccionar cobertura de salud');
      if (formData.cobertura !== 'Particular' && !formData.nroAfiliado) {
        newWarnings.push('Debe ingresar número de afiliado');
      }
    }
    
    if (step === 2) {
      if (!formData.medicoNombre) newWarnings.push('Debe ingresar el nombre del médico derivante');
      if (!formData.medicoMatricula) newWarnings.push('Debe ingresar la matrícula del médico');
    }
    
    if (step === 3) {
      if (!formData.ordenMedica) newWarnings.push('Debe cargar la orden médica');
      if (formData.requiereAutorizacion && !formData.autorizacion) {
        newWarnings.push('Autorización pendiente. Deberá llevarla e SEDE o cambiar a Particular.');
      }
    }
    
    if (step === 4) {
      if (formData.anticoagulado === 'SI' && !formData.notaMedicoAnticoagulacion) {
        newWarnings.push('Requiere nota médica para suspensión de anticoagulación');
      }
      if (formData.medicamentosObesidad === 'SI') {
        newWarnings.push('Debe suspender medicación según indicaciones (3-7 días antes)');
      }
    }
    
    if (step === 5) {
      if (!formData.leyoConsentimiento) {
        newWarnings.push('Debe leer el consentimiento informado completo');
      }
      if (!formData.aceptaConsentimiento) {
        newWarnings.push('Debe aceptar el consentimiento informado');
      }
    }
    
    if (step === 6 && formData.cobertura === 'Particular') {
      if (!formData.condicionIVA) {
        newWarnings.push('Debe seleccionar su condición de IVA');
      }
      if (!formData.metodoPago && !formData.pagoCompletado) {
        newWarnings.push('Debe seleccionar un método de pago o pagar en sede');
      }
    }
    
    setWarnings(newWarnings);
    return newWarnings.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Si es Paso 5 (Consentimiento) y cobertura NO es Particular, saltar directo al QR
      if (currentStep === 5 && formData.cobertura !== 'Particular') {
        generateQR();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const generateQR = () => {
    const qrData = {
      dni: formData.dni,
      nombre: formData.nombre,
      turno: `TURNO-${Date.now()}`,
      timestamp: new Date().toISOString(),
      hash: `HASH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    updateField('qrData', qrData);
    setCurrentStep(formData.cobertura === 'Particular' ? 7 : 6);
  };

  const totalSteps = formData.cobertura === 'Particular' ? 7 : 6;

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" />
              <h2 className="text-2xl font-bold">Datos Personales</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">DNI *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.dni}
                  onChange={(e) => updateField('dni', e.target.value)}
                  placeholder="12345678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">E-mail *</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="email@ejemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono *</label>
                <input
                  type="tel"
                  className="w-full border rounded px-3 py-2"
                  value={formData.telefono}
                  onChange={(e) => updateField('telefono', e.target.value)}
                  placeholder="11 1234-5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Código Postal</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.cp}
                  onChange={(e) => updateField('cp', e.target.value)}
                  placeholder="1636"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Edad *</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={formData.edad}
                  onChange={(e) => updateField('edad', e.target.value)}
                  placeholder="45"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Peso (kg) *</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={formData.peso}
                  onChange={(e) => updateField('peso', e.target.value)}
                  placeholder="70"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Altura (cm) *</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={formData.altura}
                  onChange={(e) => updateField('altura', e.target.value)}
                  placeholder="170"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Cobertura de Salud *</h3>
              <div>
                <select
                  className="w-full border rounded px-3 py-2 mb-3"
                  value={formData.cobertura}
                  onChange={(e) => updateField('cobertura', e.target.value)}
                >
                  <option value="">Seleccione su cobertura...</option>
                  <option value="Particular">Particular (sin cobertura)</option>
                  <option value="OSDE">OSDE</option>
                  <option value="Swiss Medical">Swiss Medical</option>
                  <option value="Galeno">Galeno</option>
                  <option value="IOMA">IOMA</option>
                  <option value="PAMI">PAMI</option>
                  <option value="Otra">Otra obra social</option>
                </select>

                {formData.cobertura && formData.cobertura !== 'Particular' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de Afiliado *</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={formData.nroAfiliado}
                      onChange={(e) => updateField('nroAfiliado', e.target.value)}
                      placeholder="123456/00"
                    />
                  </div>
                )}

                {formData.cobertura === 'Particular' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                    ℹ️ Como paciente particular, deberá abonar el estudio. El pago puede realizarse online o en sede.
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estudio a Efectuar</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.estudio}
                onChange={(e) => updateField('estudio', e.target.value)}
                placeholder="Videoendoscopía digestiva alta"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" />
              <h2 className="text-2xl font-bold">Médico Derivante</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.medicoNombre}
                  onChange={(e) => updateField('medicoNombre', e.target.value)}
                  placeholder="Dr. Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Matrícula *</label>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-3 py-2"
                    value={formData.medicoTipoMatricula}
                    onChange={(e) => updateField('medicoTipoMatricula', e.target.value)}
                  >
                    <option>MN</option>
                    <option>MP</option>
                  </select>
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={formData.medicoMatricula}
                    onChange={(e) => updateField('medicoMatricula', e.target.value)}
                    placeholder="123456"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  type="tel"
                  className="w-full border rounded px-3 py-2"
                  value={formData.medicoTelefono}
                  onChange={(e) => updateField('medicoTelefono', e.target.value)}
                  placeholder="11 1234-5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={formData.medicoEmail}
                  onChange={(e) => updateField('medicoEmail', e.target.value)}
                  placeholder="medico@ejemplo.com"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-blue-600" />
              <h2 className="text-2xl font-bold">Documentación</h2>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <label className="block text-center cursor-pointer">
                <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                <span className="text-sm font-medium">Orden Médica *</span>
                <p className="text-xs text-gray-500 mt-1">Cargue foto o PDF de la orden médica</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload('ordenMedica', e.target.files[0])}
                />
                {formData.ordenMedica && (
                  <div className="mt-2 text-green-600 flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    <span>Orden médica cargada</span>
                  </div>
                )}
              </label>
            </div>

            {formData.requiereAutorizacion && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <label className="block text-center cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                  <span className="text-sm font-medium">Autorización de Cobertura</span>
                  <p className="text-xs text-gray-500 mt-1">Su cobertura requiere autorización previa</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload('autorizacion', e.target.files[0])}
                  />
                  {formData.autorizacion && (
                    <div className="mt-2 text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle size={20} />
                      <span>Autorización cargada</span>
                    </div>
                  )}
                </label>
                {!formData.autorizacion && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-600 mb-2">¿No tiene la autorización aún?</p>
                    <button className="text-sm text-blue-600 underline">
                      Cargaré más adelante (antes de D-1)
                    </button>
                  </div>
                )}
              </div>
            )}

            {!formData.requiereAutorizacion && formData.cobertura !== 'Particular' && (
              <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
                <p className="font-medium">Su cobertura no requiere autorización previa</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-blue-600" />
              <h2 className="text-2xl font-bold">Declaración Jurada de Salud</h2>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
              {[
                { field: 'alergiaLatex', label: '¿Sos alérgico al látex?' },
                { field: 'alergiaMedicamentos', label: '¿Sos alérgico a algún medicamento?', extraField: 'medicamentosAlergicos', extraLabel: 'Enumerar a cuál/es' },
                { field: 'diabetes', label: '¿Sufrís de diabetes?', extraField: 'insulina', extraLabel: '¿Requerís insulina?' },
                { field: 'fuma', label: '¿Fumás?', extraFields: [{ field: 'cigarrillosDia', label: '¿Cuántos por día?' }, { field: 'desdeQuando', label: '¿Desde cuándo?' }] },
                { field: 'alcohol', label: '¿Consumís alcohol?', extraField: 'vasosComida', extraLabel: '¿Cuántos vasos por comida?' },
                { field: 'enfermedadTransmisible', label: '¿Padecés alguna enfermedad transmisible?', extraField: 'cualEnfermedad', extraLabel: '¿Cuál?' },
                { field: 'epilepsia', label: '¿Sufrís o sufriste de epilepsia y/o convulsiones?' },
                { field: 'hepatitis', label: '¿Tuviste hepatitis?', extraField: 'tipoHepatitis', extraLabel: '¿Recordás de qué tipo?' },
                { field: 'medicamentosObesidad', label: '¿Recibís medicamentos para obesidad/diabetes tipo Ozempic, Saxenda, Trulicity, Mounjaro u otros similares?' },
                { field: 'enfermedadCardiaca', label: '¿Fuiste tratado o sufriste alguna enfermedad cardíaca como arritmia, infarto o insuficiencia cardíaca?' },
                { field: 'marcapasos', label: '¿Tenés colocado un marcapasos o cardiodesfibrilador?' },
                { field: 'hipertension', label: '¿Tenés antecedentes de hipertensión arterial?' },
                { field: 'accidenteCerebrovascular', label: '¿Fuiste tratado o sufriste un accidente cerebrovascular?' },
                { field: 'dialisis', label: '¿Estás realizando diálisis? ¿Tenés insuficiencia renal crónica?' },
                { field: 'epoc', label: '¿Sufrís EPOC, asma, alguna otra enfermedad pulmonar o usás oxígeno domiciliario o CPAP?' },
                { field: 'anticoagulado', label: '¿Estás anticoagulado o tenés doble antiagregación plaquetaria?' },
                { field: 'problemaAnestesia', label: '¿Tuviste algún problema con la anestesia alguna vez?' },
                { field: 'otraEnfermedad', label: '¿Sufrís de alguna otra enfermedad?', extraField: 'cualOtraEnfermedad', extraLabel: '¿Cuál?' },
                { field: 'discapacidad', label: '¿Tenés alguna discapacidad motora, visual o auditiva significativa?', extraField: 'cualDiscapacidad', extraLabel: '¿Cuál?' },
                { field: 'embarazada', label: '¿Estás embarazada o creés estarlo?' }
              ].map(({ field, label, extraField, extraLabel, extraFields }) => (
                <div key={field} className="border-b pb-3">
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <div className="flex gap-4">
                    {['SI', 'NO', 'NO SABE'].map(option => (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={field}
                          value={option}
                          checked={formData[field] === option}
                          onChange={(e) => updateField(field, e.target.value)}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  
                  {formData[field] === 'SI' && extraField && (
                    <div className="mt-2">
                      <label className="block text-xs text-gray-600 mb-1">{extraLabel}</label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-sm"
                        value={formData[extraField] || ''}
                        onChange={(e) => updateField(extraField, e.target.value)}
                      />
                    </div>
                  )}

                  {formData[field] === 'SI' && extraFields && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {extraFields.map(({ field: ef, label: el }) => (
                        <div key={ef}>
                          <label className="block text-xs text-gray-600 mb-1">{el}</label>
                          <input
                            type="text"
                            className="w-full border rounded px-2 py-1 text-sm"
                            value={formData[ef] || ''}
                            onChange={(e) => updateField(ef, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData[field] === 'SI' && field === 'anticoagulado' && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <AlertCircle className="inline mr-2" size={16} />
                      Deberá presentar nota médica autorizando suspensión de anticoagulación
                      <label className="mt-2 flex items-center gap-2 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="text-xs"
                          onChange={(e) => handleFileUpload('notaMedicoAnticoagulacion', e.target.files[0])}
                        />
                        {formData.notaMedicoAnticoagulacion && <CheckCircle size={16} className="text-green-600" />}
                      </label>
                    </div>
                  )}
                  
                  {formData[field] === 'SI' && field === 'medicamentosObesidad' && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <AlertCircle className="inline mr-2" size={16} />
                      Suspender: formas orales 3 días antes / aplicaciones semanales 7 días antes del estudio
                    </div>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-2">Enumerar qué medicamentos o drogas tomás en forma habitual</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                  value={formData.medicamentosHabituales}
                  onChange={(e) => updateField('medicamentosHabituales', e.target.value)}
                  placeholder="Ej: Enalapril 10mg (1 por día), Aspirina 100mg..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enumerar de qué lo operaron este año en caso que corresponda</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={2}
                  value={formData.operacionesAnio}
                  onChange={(e) => updateField('operacionesAnio', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Calificar el grado de ansiedad por el procedimiento (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.nivelAnsiedad}
                  onChange={(e) => updateField('nivelAnsiedad', e.target.value)}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-600">{formData.nivelAnsiedad}</span>
                  <span className="text-sm text-gray-600 ml-2">/ 10</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              ℹ️ Recordá que el acompañante debe ser mayor de edad y tener la capacidad suficiente para estar con vos en la recuperación.
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-blue-600" />
              <h2 className="text-2xl font-bold">Consentimiento Informado</h2>
            </div>
            
            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-700 mb-3">
                A continuación encontrará el consentimiento informado para el procedimiento endoscópico. 
                Le pedimos que lo lea con atención antes de continuar.
              </p>
              
              <button
                onClick={() => setShowConsentimiento(!showConsentimiento)}
                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 mb-3"
              >
                {showConsentimiento ? 'Ocultar' : 'Leer'} Consentimiento Completo
              </button>

              {showConsentimiento && (
                <div className="border rounded p-4 max-h-80 overflow-y-auto bg-white text-sm">
                  <h3 className="font-bold mb-3 text-center">CONSENTIMIENTO INFORMADO PARA PROCEDIMIENTO ENDOSCÓPICO</h3>
                  
                  <p className="mb-3">
                    <strong>Paciente: {formData.nombre}</strong> | DNI: {formData.dni}
                  </p>
                  
                  <p className="mb-3">
                    Por medio del presente documento, declaro haber sido informado/a de manera clara y suficiente sobre:
                  </p>
                  
                  <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>El procedimiento endoscópico a realizar: <strong>{formData.estudio || 'videoendoscopía'}</strong></li>
                    <li>Los beneficios esperados del estudio y sus alternativas diagnósticas</li>
                    <li>Los riesgos asociados al procedimiento, incluyendo pero no limitándose a: perforación, sangrado, reacciones adversas a la sedación, infección</li>
                    <li>La necesidad de sedación o anestesia y sus riesgos particulares</li>
                    <li>Los cuidados previos necesarios (preparación intestinal, ayuno)</li>
                    <li>Los cuidados posteriores y posibles complicaciones post-procedimiento</li>
                    <li>La posibilidad de que durante el procedimiento se detecten hallazgos que requieran procedimientos adicionales (biopsias, polipectomías)</li>
                  </ul>
                  
                  <p className="mb-3">
                    He tenido oportunidad de realizar preguntas sobre el procedimiento y las mismas han sido respondidas 
                    satisfactoriamente por el equipo médico.
                  </p>
                  
                  <p className="mb-3">
                    Comprendo que el procedimiento será realizado por profesionales calificados en GEDyT, y que si bien 
                    se tomarán todas las precauciones necesarias, ningún procedimiento médico está exento de riesgos.
                  </p>
                  
                  <p className="mb-3">
                    <strong>Protección de datos:</strong> Autorizo a GEDyT Salud a utilizar mis datos personales y de salud 
                    conforme a la Ley 25.326 de Protección de Datos Personales, únicamente con fines médicos, administrativos 
                    y de facturación.
                  </p>
                  
                  <p className="mb-3">
                    <strong>Importante:</strong> La firma presencial de este consentimiento se realizará el día del estudio 
                    en presencia del médico que realizará el procedimiento, quien responderá cualquier consulta adicional.
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mt-4">
                    <p className="text-sm">
                      <strong>Nota:</strong> Este documento digital constituye una pre-aceptación. El consentimiento 
                      definitivo será co-firmado por usted y el médico tratante el día del procedimiento.
                    </p>
                  </div>
                </div>
              )}

              <label className="flex items-start gap-3 p-4 border rounded mt-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.leyoConsentimiento}
                  onChange={(e) => updateField('leyoConsentimiento', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  Confirmo que he leído el consentimiento informado completo
                </span>
              </label>

              <label className="flex items-start gap-3 p-4 border rounded mt-2 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.aceptaConsentimiento}
                  onChange={(e) => updateField('aceptaConsentimiento', e.target.checked)}
                  className="mt-1"
                  disabled={!formData.leyoConsentimiento}
                />
                <span className="text-sm">
                  Acepto la realización del procedimiento bajo las condiciones expresadas. 
                  Comprendo que firmaré el consentimiento definitivo el día del estudio.
                </span>
              </label>
            </div>
          </div>
        );

      case 6:
        // Paso de pago (solo si es Particular)
        if (formData.cobertura === 'Particular') {
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-blue-600" />
                <h2 className="text-2xl font-bold">Pago y Facturación</h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Condición de IVA *</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formData.condicionIVA}
                  onChange={(e) => updateField('condicionIVA', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option>Consumidor Final</option>
                  <option>Responsable Inscripto</option>
                  <option>Monotributista</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-medium mb-2">Presupuesto del Estudio</h3>
                <div className="text-3xl font-bold text-blue-600">$85.000</div>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.condicionIVA === 'Consumidor Final' && '(IVA incluido)'}
                  {formData.condicionIVA === 'Responsable Inscripto' && '+ IVA 21%'}
                  {formData.condicionIVA === 'Monotributista' && '(IVA no discriminado)'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Método de Pago</label>
                <div className="space-y-2">
                  {['Tarjeta de Crédito/Débito', 'Mercado Pago', 'Transferencia Bancaria'].map(metodo => (
                    <label key={metodo} className="flex items-center gap-3 border rounded p-3 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="metodoPago"
                        value={metodo}
                        checked={formData.metodoPago === metodo}
                        onChange={(e) => updateField('metodoPago', e.target.value)}
                      />
                      <span>{metodo}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.metodoPago && !formData.pagoCompletado && (
                <button
                  onClick={() => {
                    updateField('pagoCompletado', true);
                    setTimeout(() => generateQR(), 500);
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700"
                >
                  Procesar Pago de ${formData.condicionIVA === 'Responsable Inscripto' ? '102,850' : '85,000'}
                </button>
              )}

              {formData.pagoCompletado && (
                <div className="bg-green-50 border border-green-200 rounded p-4 flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={32} />
                  <div>
                    <p className="font-medium text-green-800">Pago acreditado correctamente</p>
                    <p className="text-sm text-green-600">Comprobante enviado a {formData.email}</p>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    updateField('pagoCompletado', 'pendiente');
                    generateQR();
                  }}
                  className="text-blue-600 underline text-sm"
                >
                  Prefiero pagar en sede el día del estudio
                </button>
              </div>
            </div>
          );
        }
        // Si no es Particular, este paso es el QR
        return renderQR();

      case 7:
        // Paso 7: QR (solo para Particulares después del pago)
        return renderQR();

      default:
        return null;
    }
  };

  const renderQR = () => {
    return (
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <QrCode className="text-green-600" size={40} />
          <h2 className="text-2xl font-bold">Check-in Completado</h2>
        </div>

        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
          <div className="w-64 h-64 bg-white border-4 border-gray-800 mx-auto mb-4 flex items-center justify-center relative">
            <QrCode size={180} className="text-gray-800" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white px-2 py-1 text-xs font-mono border border-gray-300">
                {formData.qrData?.hash}
              </div>
            </div>
          </div>
          <p className="font-medium text-lg mb-2">Tu código QR está listo</p>
          <p className="text-sm text-gray-600">
            Presentá este código al llegar a GEDyT
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ID Turno: {formData.qrData?.turno}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-left">
          <h3 className="font-medium mb-3 text-center">Resumen de tu Check-in</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span><strong>Paciente:</strong> {formData.nombre} | DNI: {formData.dni}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span><strong>Médico derivante:</strong> {formData.medicoNombre} ({formData.medicoTipoMatricula} {formData.medicoMatricula})</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span><strong>Cobertura:</strong> {formData.cobertura}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span>Orden médica cargada</span>
            </div>
            {formData.requiereAutorizacion && (
              <div className="flex items-center gap-2">
                {formData.autorizacion ? (
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0" />
                )}
                <span>Autorización {formData.autorizacion ? 'cargada' : 'pendiente (cargar antes de D-1)'}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span>Declaración jurada completada</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span>Consentimiento aceptado (firma presencial en sede)</span>
            </div>
            {formData.cobertura === 'Particular' && (
              <div className="flex items-center gap-2">
                {formData.pagoCompletado === true ? (
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0" />
                )}
                <span>Pago {formData.pagoCompletado === true ? 'acreditado' : 'pendiente en sede'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700">
            <Download size={20} />
            Descargar QR
          </button>
          <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700">
            <Mail size={20} />
            Enviar por Email
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mt-4">
          <p className="text-sm font-medium">📋 Recordatorios importantes:</p>
          <ul className="text-xs text-left mt-2 space-y-1">
            <li>• Llegar 15 minutos antes de tu turno</li>
            <li>• Traer DNI original</li>
            <li>• Venir acompañado por un adulto responsable</li>
            <li>• Cumplir con la preparación intestinal indicada</li>
            <li>• Ayuno completo según instrucciones</li>
          </ul>
        </div>

        <p className="text-xs text-gray-500">
          Ante cualquier duda, comunicate al 011 5288 6100 o escribinos a turnos@gedyt.com.ar
        </p>
      </div>
    );
  };

  const getStepLabel = (step) => {
    const labels = ['Datos', 'Médico', 'Docs', 'DJS', 'Consentimiento'];
    if (formData.cobertura === 'Particular') {
      labels.push('Pago', 'QR');
    } else {
      labels.push('QR');
    }
    return labels[step - 1] || '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Check in Online GEDyT</h1>
          <p className="text-gray-600">Check-in Online - Estudios Endoscópicos</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === currentStep
                      ? 'bg-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                <span className="text-xs mt-1 text-gray-600">{getStepLabel(step)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-red-800">Atención:</p>
                <ul className="list-disc ml-5 text-sm text-red-700">
                  {warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step content */}
        {renderStep()}

        {/* Navigation buttons */}
        {currentStep < totalSteps && (
          <div className="mt-6 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-400"
              >
                ← Anterior
              </button>
            )}
            <button
              onClick={nextStep}
              className="flex-1 bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700"
            >
              {currentStep === 5 && formData.cobertura !== 'Particular' ? 'Generar QR' : 'Siguiente →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckinOnline;
