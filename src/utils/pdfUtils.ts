import jsPDF from 'jspdf'; 

export const generatePDF = (result: {
  calories: number;
  bmi: number;
  minWeight: number;
  maxWeight: number;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 15;
  let currentY = 20;

  const addParagraph = (
    text: string,
    options: { bold?: boolean; spacing?: number } = {}
  ) => {
    const { bold = false, spacing = 8 } = options;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, pageWidth - 2 * marginLeft);
    doc.text(lines, marginLeft, currentY);
    currentY += lines.length * 6 + spacing;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Resultados do Cálculo TMB', pageWidth / 2, currentY, { align: 'center' });
  currentY += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Gasto calórico diário: ${result.calories} kcal`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  doc.text(`IMC: ${result.bmi}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  doc.text(`Peso ideal mínimo: ${result.minWeight} kg`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  doc.text(`Peso ideal máximo: ${result.maxWeight} kg`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Magreza', color: [255, 0, 0] }; 
    if (bmi < 25) return { status: 'Peso normal', color: [0, 128, 0] }; 
    if (bmi < 30) return { status: 'Sobrepeso', color: [255, 255, 0] }; 
    if (bmi < 35) return { status: 'Obesidade Grau 1', color: [255, 140, 0] }; 
    if (bmi < 40) return { status: 'Obesidade Grau 2', color: [255, 0, 0] }; 
    return { status: 'Obesidade Grau 3', color: [255, 0, 0] }; 
  };

  const { status, color } = getBMIStatus(result.bmi);
  const textoStatus = `Você está em ${status}`;
  const textWidth = doc.getTextWidth(textoStatus);
  const boxPadding = 4;
  const boxWidth = textWidth + boxPadding * 2;
  const boxX = (pageWidth - boxWidth) / 2;
  const boxY = currentY;
  const boxHeight = 10;

  doc.setFillColor(0, 0, 0);
  doc.rect(boxX, boxY, boxWidth, boxHeight, 'F');

  doc.setTextColor(...color);
  doc.text(textoStatus, pageWidth / 2, boxY + 7, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  currentY += 20;

  addParagraph('Considerações:', { bold: true });

  addParagraph('=> A Taxa de Metabolismo Basal (TMB) representa a quantidade de calorias que o corpo gasta em repouso para manter funções vitais, como respirar e bombear o coração.', { spacing: 6 });

  addParagraph('=> Para atingir seus objetivos, como perda de peso, ganho de peso e ganho de massa muscular, utilize a TMB como base para calcular sua ingestão calórica.', { spacing: 6 });

  addParagraph('=> O IMC (Índice de Massa Corporal) é uma forma simples de avaliar se uma pessoa está com o peso adequado em relação à altura. Os valores são interpretados da seguinte forma:', { spacing: 6 });

  addParagraph(`- IMC abaixo de 18,5: magreza.
- IMC entre 18,5 e 24,9: peso ideal.
- IMC entre 25 e 29,9: sobrepeso.
- IMC entre 30 e 34,9: obesidade grau 1.
- IMC entre 35 e 39,9: obesidade grau 2 (severa).
- IMC de 40 ou mais: obesidade grau 3 (mórbida).`, { spacing: 6 });

  addParagraph('=> Esses resultados são estimativas aproximadas. Para um resultado mais preciso e confiável, consulte um nutricionista — profissional capacitado para avaliar seu metabolismo e elaborar um plano alimentar individualizado, adequado às suas necessidades.', { spacing: 6 });

  doc.save('resultado-tmb.pdf');
};

