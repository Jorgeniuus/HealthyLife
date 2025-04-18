import { useEffect, useState } from 'react';
import './App.css';
import { gerarPDF } from './utils/pdfUtils';
import { opcoesAtividade } from './utils/opcoesAtividade';

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
  const [podeCalcular, setPodeCalcular] = useState(false);
  const [podeBaixarPDF, setPodeBaixarPDF] = useState(false);

  useEffect(() => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura.replace(',', '.'));
    const idadeNum = parseInt(idade);
  
    if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(idadeNum) || !sexo || !atividade) {
      setPodeCalcular(false);
      setPodeBaixarPDF(false);
    } else {
      setPodeCalcular(true);
    }
  }, [peso, altura, idade, sexo, atividade]);

  useEffect(() => {
    if (
      resultado.calorias === 0 &&
      resultado.imc === 0 &&
      resultado.pesoMinimo === 0 &&
      resultado.pesoMaximo === 0
    ) {
      setPodeBaixarPDF(false);
    }else {
      setPodeBaixarPDF(true);
    }
  },[resultado]);

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

  const handleGerarPDF = () => {
    if (!peso || !altura || !idade || !sexo || !atividade) {
      alert('Por favor, preencha todos os campos antes de baixar o PDF.');
      return;
    }

    if (
      resultado.calorias === 0 &&
      resultado.imc === 0 &&
      resultado.pesoMinimo === 0 &&
      resultado.pesoMaximo === 0
    ) {
      alert('Por favor, calcule os resultados antes de baixar o PDF.');
      return;
    }
    gerarPDF(resultado);
  };

  const atividadeSelecionada = opcoesAtividade.find((opcao) => opcao.value === atividade);

  return (
    <div className="container">
      <h1>Calcular TMP</h1>
      <h2 id='subtittle'>(taxa metabólica basal)</h2>
      <div className="form-group">
        <label>Peso (kg):</label>
        <input
          type="number"
          placeholder="Ex: 75"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Altura (m):</label>
        <input
          type="number"
          placeholder="Ex: 1,70"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Idade (anos):</label>
        <input
          type="number"
          placeholder="Ex: 30"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label id='description'>Sexo:</label>
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
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label id='description'>Fator de Atividade Física:</label>
        {opcoesAtividade.map((opcao) => (
          <label key={opcao.value} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
            <input
              type="radio"
              name="atividade"
              value={opcao.value}
              checked={atividade === opcao.value}
              onChange={(e) => setAtividade(e.target.value)}
              style={{ marginTop: '3px' }}
            />
            <div>
              <span style={{ fontWeight: '700', fontSize: '0.9em', color: '#555'}}>{opcao.label}</span>
              <span style={{ fontWeight: '500', fontSize: '0.9em', color: '#555' }}> {opcao.descricao}</span>
            </div>
          </label>
        ))}
        {atividadeSelecionada && (
          <div style={{ marginTop: '12px', padding: '8px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #ddd' }}>
            <strong>{atividadeSelecionada.label}</strong> {atividadeSelecionada.descricao}
          </div>
        )}
      </div>
      <button id={podeCalcular ? 'button-calculo' : 'button-inativo'} onClick={calcular}>Calcular</button>
      <button id={podeBaixarPDF ? 'button-pdf' : 'button-inativo'} onClick={handleGerarPDF}>Baixar PDF</button>
      <div className="resultado">
        <h2>Resultados:</h2>
        <p>Gasto calórico diário: {resultado.calorias} kcal</p>
        <p>IMC: {resultado.imc}</p>
        <p>Peso ideal mínimo: {resultado.pesoMinimo} kg</p>
        <p>Peso ideal máximo: {resultado.pesoMaximo} kg</p>
        {resultado.imc > 0 && (
            <span style={{
              color:
              resultado.imc < 18.5
              ? 'rgb(255, 0, 0)' // Magreza (Vermelho - Alerta/Risco)
              : resultado.imc < 25
              ? 'rgb(0, 128, 0)' // Peso normal (Verde - Saudável)
              : resultado.imc < 30
              ? 'rgb(255, 255, 0)' // Sobrepeso (Amarelo - Atenção)
              : resultado.imc < 35
              ? 'rgb(255, 140, 0)' // Obesidade Grau 1 (Laranja Escuro - Atenção)
              : 'rgb(255, 0, 0)', // Magreza (Vermelho - Alerta/Risco),
              fontWeight: 'bold',
              backgroundColor: 'black',
            }}>
              (
              {resultado.imc < 18.5
                ? 'Magreza'
                : resultado.imc < 25
                ? 'Peso normal'
                : resultado.imc < 30
                ? 'Sobrepeso'
                : resultado.imc < 35
                ? 'Obesidade grau 1'
                : resultado.imc < 40
                ? 'Obesidade grau 2'
                : 'Obesidade grau 3'}
              )
            </span>
          )}
      </div>
    </div>
  );
}

export default App;