import { useState } from 'react';
import './App.css';

function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [atividade, setAtividade] = useState('');
  const [resultado, setResultado] = useState({
    calorias: 0,
    imc: 0,
    pesoMinimo: 0,
    pesoMaximo: 0,
  });

  const interpretarAltura = (alturaStr: string) =>{
    if (!alturaStr) return NaN;
  
    const alturaNormalizada = alturaStr.trim().replace(',', '.');  
    const alturaNum = parseFloat(alturaNormalizada);
  
    if (isNaN(alturaNum)) return NaN;
  
    if (alturaNum > 3) {
      return alturaNum / 100; 
    }
  
    return alturaNum; 
  }

  const calcular = () => {
    const pesoNum = parseFloat(peso);
    const alturaNum = interpretarAltura(altura); 
    const idadeNum = parseInt(idade);

    if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(idadeNum) || !sexo || !atividade) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // Fórmulas de exemplo
    const imc = pesoNum / (alturaNum * alturaNum);
    const pesoMinimo = 18.5 * (alturaNum * alturaNum);
    const pesoMaximo = 24.9 * (alturaNum * alturaNum);

    const fatorAtividade = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      ativo: 1.725,
      muitoAtivo: 1.9,
    };

    const taxaMetabolicaBasal =
      sexo === 'masculino'
        ? (10 * pesoNum) + 6.25 * (alturaNum * 100) - 5 * idadeNum + 5
        : (10 * pesoNum) + 6.25 * (alturaNum * 100) - 5 * idadeNum - 161;

    const calorias = taxaMetabolicaBasal * fatorAtividade[atividade];

    setResultado({
      calorias: Math.round(calorias),
      imc: parseFloat(imc.toFixed(1)),
      pesoMinimo: parseFloat(pesoMinimo.toFixed(1)),
      pesoMaximo: parseFloat(pesoMaximo.toFixed(1)),
    });
  };

  return (
    <div className="container">
      <h1>Calcular TMP</h1>
      <div className="form-group">
        <label>Peso (kg):</label>
        <input
          type="number"
          placeholder="75"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Altura (m):</label>
        <input
          type="number"
          placeholder="1,70"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Idade (anos):</label>
        <input
          type="number"
          placeholder="30"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Sexo:</label>
        <div>
          <label>
            <input
              type="radio"
              value="masculino"
              checked={sexo === 'masculino'}
              onChange={(e) => setSexo(e.target.value)}
            />
            Masculino
          </label>
          <label>
            <input
              type="radio"
              value="feminino"
              checked={sexo === 'feminino'}
              onChange={(e) => setSexo(e.target.value)}
            />
            Feminino
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>Fator de Atividade Física:</label>
        <select
          value={atividade}
          onChange={(e) => setAtividade(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="sedentario">Sedentário</option>
          <option value="leve">Levemente ativo</option>
          <option value="moderado">Moderadamente ativo</option>
          <option value="ativo">Muito ativo</option>
          <option value="muitoAtivo">Extremamente ativo</option>
        </select>
      </div>
      <button onClick={calcular}>Calcular</button>
      <div className="resultado">
        <h2>Resultados:</h2>
        <p>Gasto calórico diário: {resultado.calorias} kcal</p>
        <p>IMC: {resultado.imc}</p>
        <p>Peso ideal mínimo: {resultado.pesoMinimo} kg</p>
        <p>Peso ideal máximo: {resultado.pesoMaximo} kg</p>
      </div>
    </div>
  );
}

export default App;