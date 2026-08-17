package com.pms.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.pms.entity.Appointment;
import com.pms.entity.MedicalRecord;
import com.pms.entity.Prescription;
import com.pms.repository.AppointmentRepository;
import com.pms.repository.MedicalRecordRepository;
import com.pms.repository.PrescriptionRepository;
import com.pms.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public ByteArrayInputStream exportPrescriptionPdf(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id " + prescriptionId));

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.BLUE);
            Paragraph title = new Paragraph("MEDIFLOW HEALTHCARE SYSTEM", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY);
            Paragraph subtitle = new Paragraph("OFFICIAL ELECTRONIC PRESCRIPTION", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Table details
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(20);

            addTableCell(table, "Prescription Code:", prescription.getPrescriptionCode(), true);
            addTableCell(table, "Date:", prescription.getPrescriptionDate() != null ? prescription.getPrescriptionDate().toString() : "N/A", false);

            String patientName = prescription.getPatient() != null ?
                    prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName() + " (" + prescription.getPatient().getPatientCode() + ")" : "N/A";
            addTableCell(table, "Patient:", patientName, true);

            String doctorName = prescription.getDoctor() != null ?
                    "Dr. " + prescription.getDoctor().getFirstName() + " " + prescription.getDoctor().getLastName() + " (" + prescription.getDoctor().getSpecialization() + ")" : "N/A";
            addTableCell(table, "Prescribing Doctor:", doctorName, false);

            document.add(table);

            // Rx Section Header
            Font rxHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.DARK_GRAY);
            Paragraph rxHeader = new Paragraph("Medication Details (Rx)", rxHeaderFont);
            rxHeader.setSpacingBefore(10);
            rxHeader.setSpacingAfter(10);
            document.add(rxHeader);

            PdfPTable medTable = new PdfPTable(4);
            medTable.setWidthPercentage(100);

            // Header row
            addTableHeader(medTable, "Medicine");
            addTableHeader(medTable, "Dosage");
            addTableHeader(medTable, "Frequency");
            addTableHeader(medTable, "Duration");

            // Data row
            medTable.addCell(prescription.getMedicineName());
            medTable.addCell(prescription.getDosage());
            medTable.addCell(prescription.getFrequency());
            medTable.addCell(prescription.getDuration());

            document.add(medTable);

            // Special Instructions
            if (prescription.getInstructions() != null && !prescription.getInstructions().isBlank()) {
                Paragraph instructionsLabel = new Paragraph("Special Instructions:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
                instructionsLabel.setSpacingBefore(15);
                document.add(instructionsLabel);

                Paragraph instructionsText = new Paragraph(prescription.getInstructions(), FontFactory.getFont(FontFactory.HELVETICA, 11, Font.ITALIC));
                document.add(instructionsText);
            }

            // Footer / Disclaimer
            Paragraph disclaimer = new Paragraph("This is an electronically generated prescription. Valid when issued by an authorized physician.", FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY));
            disclaimer.setSpacingBefore(40);
            disclaimer.setAlignment(Element.ALIGN_CENTER);
            document.add(disclaimer);

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF for prescription", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream exportMedicalRecordPdf(Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Medical Record not found with id " + recordId));

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.BLUE);
            Paragraph title = new Paragraph("MEDIFLOW CLINICAL SUMMARY", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Electronic Medical Record - " + record.getRecordCode(), FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY));
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            String patientName = record.getPatient() != null ? record.getPatient().getFirstName() + " " + record.getPatient().getLastName() : "N/A";
            String doctorName = record.getDoctor() != null ? "Dr. " + record.getDoctor().getFirstName() + " " + record.getDoctor().getLastName() : "N/A";

            addTableCell(table, "Patient Name:", patientName, true);
            addTableCell(table, "Consulting Doctor:", doctorName, false);
            addTableCell(table, "Visit Date:", record.getVisitDate() != null ? record.getVisitDate().toString() : "N/A", true);
            addTableCell(table, "Follow-up Date:", record.getFollowUpDate() != null ? record.getFollowUpDate().toString() : "None", false);

            document.add(table);

            // Clinical Details
            addSection(document, "Symptoms Presented", record.getSymptoms());
            addSection(document, "Diagnosis", record.getDiagnosis());
            addSection(document, "Treatment Plan", record.getTreatment());

            if (record.getNotes() != null && !record.getNotes().isBlank()) {
                addSection(document, "Clinical Notes", record.getNotes());
            }

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF for medical record", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream exportAppointmentsCsv() {
        List<Appointment> appointments = appointmentRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Appointments");

            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Code", "Patient Name", "Doctor Name", "Department", "Date", "Time", "Status", "Reason"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Data Rows
            int rowIdx = 1;
            for (Appointment appt : appointments) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(appt.getId() != null ? appt.getId() : 0);
                row.createCell(1).setCellValue(appt.getAppointmentCode() != null ? appt.getAppointmentCode() : "");
                row.createCell(2).setCellValue(appt.getPatient() != null ? appt.getPatient().getFirstName() + " " + appt.getPatient().getLastName() : "");
                row.createCell(3).setCellValue(appt.getDoctor() != null ? "Dr. " + appt.getDoctor().getFirstName() + " " + appt.getDoctor().getLastName() : "");
                row.createCell(4).setCellValue(appt.getDepartment() != null ? appt.getDepartment().getName() : "");
                row.createCell(5).setCellValue(appt.getAppointmentDate() != null ? appt.getAppointmentDate().toString() : "");
                row.createCell(6).setCellValue(appt.getAppointmentTime() != null ? appt.getAppointmentTime().toString() : "");
                row.createCell(7).setCellValue(appt.getStatus() != null ? appt.getStatus() : "");
                row.createCell(8).setCellValue(appt.getReason() != null ? appt.getReason() : "");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel appointments report", e);
        }
    }

    private void addTableCell(PdfPTable table, String label, String value, boolean isGray) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        PdfPCell cellVal = new PdfPCell(new Phrase(value != null ? value : "", FontFactory.getFont(FontFactory.HELVETICA, 10)));
        if (isGray) {
            cellLabel.setBackgroundColor(Color.LIGHT_GRAY);
        }
        table.addCell(cellLabel);
        table.addCell(cellVal);
    }

    private void addTableHeader(PdfPTable table, String text) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(Color.LIGHT_GRAY);
        header.setPhrase(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        table.addCell(header);
    }

    private void addSection(Document doc, String title, String content) throws DocumentException {
        Paragraph pTitle = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY));
        pTitle.setSpacingBefore(12);
        pTitle.setSpacingAfter(4);
        doc.add(pTitle);

        Paragraph pContent = new Paragraph(content != null ? content : "None", FontFactory.getFont(FontFactory.HELVETICA, 11));
        pContent.setSpacingAfter(8);
        doc.add(pContent);
    }
}
