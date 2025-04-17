import jsPDF from 'jspdf';

export const gerarPDF = (resultado: {
    calorias: number;
    imc: number;
    pesoMinimo: number;
    pesoMaximo: number;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Resultados do Cálculo TMP', pageWidth / 2, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Gasto calórico diário: ${resultado.calorias} kcal`, pageWidth / 2, 40, { align: 'center' });
  doc.text(`IMC: ${resultado.imc}`, pageWidth / 2, 50, { align: 'center' });
  doc.text(`Peso ideal mínimo: ${resultado.pesoMinimo} kg`, pageWidth / 2, 60, { align: 'center' });
  doc.text(`Peso ideal máximo: ${resultado.pesoMaximo} kg`, pageWidth / 2, 70, { align: 'center' });

  doc.save('resultado-tmp.pdf');
};