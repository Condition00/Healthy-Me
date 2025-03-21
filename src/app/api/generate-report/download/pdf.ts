import PDFDocument from 'pdfkit';
import { PreDiagnosisSummary } from '@/app/interfaces/report';
import { Readable } from 'stream';

async function generatePreDiagnosisReport(data: PreDiagnosisSummary): Promise<Blob> {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];

  return new Promise((resolve, reject) => {
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(new Blob([pdfData], { type: 'application/pdf' }));
    });

    // Header Section - Hospital Info
    doc.fontSize(26).font('Helvetica-Bold').text('Healthy Me', { align: 'center' });
    doc.moveDown(1);

    // Title Section
    doc.fontSize(22).font('Helvetica-Bold').text('Patient Pre-Diagnosis Report', { align: 'center' });
    doc.moveDown(1);

    // Patient Information
    doc.fontSize(14).font('Helvetica-Bold').text('Patient Information');
    doc.moveDown(0.5);
    doc.font('Helvetica').text(`Name: ${data.name}`);
    doc.text(`Age: ${data.age}`);
    doc.text(`Gender: ${data.gender}`);
    doc.moveDown(2);

    // Symptoms Section
    doc.fontSize(14).font('Helvetica-Bold').text('Symptoms');
    doc.moveDown(0.5);
    data.symptoms.forEach((symptom, index) => {
      doc.font('Helvetica').text(`${index + 1}. ${symptom.name} (Duration: ${symptom.duration})`);
    });
    doc.moveDown(2);

    // Possible Diseases Section
    doc.fontSize(14).font('Helvetica-Bold').text('Possible Diseases');
    doc.moveDown(0.5);
    data.possible_diseases.forEach((disease, index) => {
      doc.font('Helvetica').text(`${index + 1}. ${disease.name} (Probability: ${(disease.probability * 100).toFixed(2)}%)`);
      doc.fontSize(10).font('Helvetica-Oblique').text(`Description: ${disease.description}`);
      doc.fontSize(12).font('Helvetica');
      doc.moveDown(1);
    });

    // Recommended Medications Section
    doc.fontSize(14).font('Helvetica-Bold').text('Recommended Medications');
    doc.moveDown(0.5);
    data.recommended_medications.forEach((medication, index) => {
      doc.font('Helvetica').text(`${index + 1}. ${medication.name}, Dosage: ${medication.dosage}`);
    });
    doc.moveDown(2);

    // Recommended Tests Section (Optional)
    if (data.recommended_tests?.length) {
      doc.fontSize(14).font('Helvetica-Bold').text('Recommended Tests');
      doc.moveDown(0.5);
      data.recommended_tests.forEach((test, index) => {
        doc.font('Helvetica').text(`${index + 1}. ${test.name}, Check For: ${test.check_for}`);
      });
      doc.moveDown(2);
    }

    // Additional Notes (Optional)
    if (data.additional_notes) {
      doc.fontSize(14).font('Helvetica-Bold').text('Additional Notes');
      doc.moveDown(0.5);
      doc.font('Helvetica').text(data.additional_notes);
      doc.moveDown(2);
    }
    doc.end();

    doc.on('error', (error) => {
      reject(error);
    });
  });
}

export default generatePreDiagnosisReport;
