import { useEffect, useState } from 'react';
import './App.css';
import { generatePDF as generatePDF } from './utils/pdfUtils';
import { ActivityOptions } from './utils/activityOptions';

function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState('');
  const [result, setResult] = useState({
    calories: 0,
    bmi: 0,
    minWeight: 0,
    maxWeight: 0,
  });
  const [canCalculate, setCanCalculate] = useState(false);
  const [canDownloadPDF, setCanDownloadPDF] = useState(false);

  const isEmptyResult = 
  result.calories === 0 &&
  result.bmi === 0 &&
  result.minWeight === 0 &&
  result.maxWeight === 0;

  useEffect(() => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height.replace(',', '.'));
    const ageNum = parseInt(age);
  
    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum) || !gender || !activity) {
      setCanCalculate(false);
      setCanDownloadPDF(false);
    } else {
      setCanCalculate(true);
    }
  }, [weight, height, age, gender, activity]);

  useEffect(() => {
    if (isEmptyResult) {
      setCanDownloadPDF(false);
    }else {
      setCanDownloadPDF(true);
    }
  },[result]);

  const ensureHeightHasComma = (heightString: string) =>{
    if (!heightString) return NaN;
  
    const normalizedHeight = heightString.trim().replace(',', '.');  
    const heightNum = parseFloat(normalizedHeight);
  
    if (isNaN(heightNum)) return NaN;
  
    if (heightNum > 3) {
      return heightNum / 100; 
    }
  
    return heightNum; 
  }

  const calcular = () => {
    const weightNum = parseFloat(weight);
    const heightNum = ensureHeightHasComma(height); 
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum) || !gender || !activity) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const bmi = weightNum / (heightNum * heightNum);
    const minWeight = 18.5 * (heightNum * heightNum);
    const maxHeight = 24.9 * (heightNum * heightNum);

    const activityFactor = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      ativo: 1.725,
      muitoAtivo: 1.9,
    };

    const basalMetabolicRate =
      gender === 'masculino'
        ? (10 * weightNum) + 6.25 * (heightNum * 100) - 5 * ageNum + 5
        : (10 * weightNum) + 6.25 * (heightNum * 100) - 5 * ageNum - 161;

    const calories = basalMetabolicRate * activityFactor[activity];

    setResult({
      calories: Math.round(calories),
      bmi: parseFloat(bmi.toFixed(1)),
      minWeight: parseFloat(minWeight.toFixed(1)),
      maxWeight: parseFloat(maxHeight.toFixed(1)),
    });
  };

  const handleGeneratePDF = () => {
    if (!weight || !height || !age || !gender || !activity) {
      alert('Por favor, preencha todos os campos antes de baixar o PDF.');
      return;
    }

    if (isEmptyResult) {
      alert('Por favor, calcule os resultados antes de baixar o PDF.');
      return;
    }
    generatePDF(result);
  };

  const selectedActivity = ActivityOptions.find((option) => option.value === activity);

  return (
    <div className="container">
      <h1>Calcular TMP</h1>
      <h2 id='subtittle'>(taxa metabólica basal)</h2>
      <div className="form-group">
        <label>Peso (kg):</label>
        <input
          type="number"
          placeholder="Ex: 75"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Altura (m):</label>
        <input
          type="number"
          placeholder="Ex: 1,70"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Idade (anos):</label>
        <input
          type="number"
          placeholder="Ex: 30"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label id='description'>Sexo:</label>
        <div>
          <label>
            <input
              type="radio"
              value="masculino"
              checked={gender === 'masculino'}
              onChange={(e) => setGender(e.target.value)}
            />
            Masculino
          </label>
          <label>
            <input
              type="radio"
              value="feminino"
              checked={gender === 'feminino'}
              onChange={(e) => setGender(e.target.value)}
            />
            Feminino
          </label>
        </div>
      </div>
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label id='description'>Fator de Atividade Física:</label>
        {ActivityOptions.map((opcao) => (
          <label key={opcao.value} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
            <input
              type="radio"
              name="atividade"
              value={opcao.value}
              checked={activity === opcao.value}
              onChange={(e) => setActivity(e.target.value)}
              style={{ marginTop: '3px' }}
            />
            <div>
              <span style={{ fontWeight: '700', fontSize: '0.9em', color: '#555'}}>{opcao.label}</span>
              <span style={{ fontWeight: '500', fontSize: '0.9em', color: '#555' }}> {opcao.description}</span>
            </div>
          </label>
        ))}
        {selectedActivity && (
          <div style={{ marginTop: '12px', padding: '8px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #ddd' }}>
            <strong>{selectedActivity.label}</strong> {selectedActivity.description}
          </div>
        )}
      </div>
      <button id={canCalculate ? 'button-calculo' : 'button-inativo'} onClick={calcular}>Calcular</button>
      <button id={canDownloadPDF ? 'button-pdf' : 'button-inativo'} onClick={handleGeneratePDF}>Baixar PDF</button>
      {!isEmptyResult && (
        <div className="resultado">
          <h2>Resultados:</h2>
          <p>Gasto calórico diário: {result.calories} kcal</p>
          <p>IMC: {result.bmi}</p>
          <p>Peso ideal mínimo: {result.minWeight} kg</p>
          <p>Peso ideal máximo: {result.maxWeight} kg</p>
          {result.bmi > 0 && (
              <span style={{
                color:
                result.bmi < 18.5
                ? 'rgb(255, 0, 0)' // Magreza (Vermelho - Alerta/Risco)
                : result.bmi < 25
                ? 'rgb(0, 128, 0)' // Peso normal (Verde - Saudável)
                : result.bmi < 30
                ? 'rgb(255, 255, 0)' // Sobrepeso (Amarelo - Atenção)
                : result.bmi < 35
                ? 'rgb(255, 140, 0)' // Obesidade Grau 1 (Laranja Escuro - Atenção)
                : 'rgb(255, 0, 0)', // Magreza (Vermelho - Alerta/Risco),
                fontWeight: 'bold',
                backgroundColor: 'black',
              }}>
                (
                {result.bmi < 18.5
                  ? 'Magreza'
                  : result.bmi < 25
                  ? 'Peso normal'
                  : result.bmi < 30
                  ? 'Sobrepeso'
                  : result.bmi < 35
                  ? 'Obesidade grau 1'
                  : result.bmi < 40
                  ? 'Obesidade grau 2'
                  : 'Obesidade grau 3'}
                )
              </span>
            )}
        </div>
      )}
    </div>
  );
}

export default App;