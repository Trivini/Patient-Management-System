package com.pms.service;

import java.io.ByteArrayInputStream;

public interface ExportService {
    ByteArrayInputStream exportPrescriptionPdf(Long prescriptionId);
    ByteArrayInputStream exportMedicalRecordPdf(Long recordId);
    ByteArrayInputStream exportAppointmentsCsv();
}
