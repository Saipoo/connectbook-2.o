import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate a professional course completion certificate
 */
async function generateCertificate(certificateData) {
  const {
    studentName,
    courseName,
    teacherName,
    completionDate,
    certificateId,
    quizScore,
    totalQuizMarks
  } = certificateData;

  return new Promise((resolve, reject) => {
    try {
      // Create certificates directory if it doesn't exist
      const certificatesDir = path.join(process.cwd(), 'uploads', 'courses', 'certificates');
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      const filename = `certificate-${certificateId}.pdf`;
      const filepath = path.join(certificatesDir, filename);
      
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50
      });

      // Pipe the PDF to a file
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Background color
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fill('#f8f9fa');

      // Border
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .lineWidth(3)
         .stroke('#2563eb');

      doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
         .lineWidth(1)
         .stroke('#93c5fd');

      // Header - Certificate Title
      doc.fontSize(48)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('CERTIFICATE', 0, 80, {
           align: 'center',
           width: doc.page.width
         });

      doc.fontSize(20)
         .fillColor('#64748b')
         .font('Helvetica')
         .text('OF COMPLETION', 0, 140, {
           align: 'center',
           width: doc.page.width
         });

      // Award statement
      doc.fontSize(16)
         .fillColor('#334155')
         .font('Helvetica')
         .text('This is to certify that', 0, 200, {
           align: 'center',
           width: doc.page.width
         });

      // Student Name
      doc.fontSize(36)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text(studentName, 0, 240, {
           align: 'center',
           width: doc.page.width
         });

      // Line under name
      const nameLineY = 285;
      doc.moveTo(doc.page.width / 2 - 200, nameLineY)
         .lineTo(doc.page.width / 2 + 200, nameLineY)
         .lineWidth(1)
         .stroke('#cbd5e1');

      // Completion statement
      doc.fontSize(16)
         .fillColor('#334155')
         .font('Helvetica')
         .text('has successfully completed the course', 0, 310, {
           align: 'center',
           width: doc.page.width
         });

      // Course Name
      doc.fontSize(24)
         .fillColor('#2563eb')
         .font('Helvetica-Bold')
         .text(courseName, 0, 350, {
           align: 'center',
           width: doc.page.width
         });

      // Score (if available)
      if (quizScore !== undefined && totalQuizMarks !== undefined && totalQuizMarks > 0) {
        const percentage = ((quizScore / totalQuizMarks) * 100).toFixed(1);
        doc.fontSize(14)
           .fillColor('#059669')
           .font('Helvetica')
           .text(`Quiz Score: ${quizScore}/${totalQuizMarks} (${percentage}%)`, 0, 395, {
             align: 'center',
             width: doc.page.width
           });
      }

      // Footer section
      const footerY = 450;

      // Date
      doc.fontSize(12)
         .fillColor('#64748b')
         .font('Helvetica')
         .text('Date of Completion', 100, footerY, {
           align: 'center',
           width: 200
         });

      doc.fontSize(14)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text(new Date(completionDate).toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric'
         }), 100, footerY + 25, {
           align: 'center',
           width: 200
         });

      // Line
      doc.moveTo(130, footerY + 50)
         .lineTo(270, footerY + 50)
         .lineWidth(1)
         .stroke('#cbd5e1');

      // Instructor
      doc.fontSize(12)
         .fillColor('#64748b')
         .font('Helvetica')
         .text('Instructor', doc.page.width - 300, footerY, {
           align: 'center',
           width: 200
         });

      doc.fontSize(14)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text(teacherName, doc.page.width - 300, footerY + 25, {
           align: 'center',
           width: 200
         });

      // Line
      doc.moveTo(doc.page.width - 270, footerY + 50)
         .lineTo(doc.page.width - 130, footerY + 50)
         .lineWidth(1)
         .stroke('#cbd5e1');

      // Certificate ID at the bottom
      doc.fontSize(10)
         .fillColor('#94a3b8')
         .font('Helvetica')
         .text(`Certificate ID: ${certificateId}`, 0, doc.page.height - 80, {
           align: 'center',
           width: doc.page.width
         });

      // ConnectBook branding
      doc.fontSize(10)
         .fillColor('#2563eb')
         .font('Helvetica-Bold')
         .text('ConnectBook - CourseMaster', 0, doc.page.height - 60, {
           align: 'center',
           width: doc.page.width
         });

      // Finalize the PDF
      doc.end();

      stream.on('finish', () => {
        const relativePath = path.join('uploads', 'courses', 'certificates', filename);
        resolve({
          filename,
          filepath,
          relativePath: relativePath.replace(/\\/g, '/')
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      console.error('Error generating certificate:', error);
      reject(error);
    }
  });
}

/**
 * Generate a unique certificate ID
 */
function generateCertificateId() {
  const uuid = uuidv4().split('-')[0].toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `CERT-${timestamp}-${uuid}`;
}

export { generateCertificate, generateCertificateId };
