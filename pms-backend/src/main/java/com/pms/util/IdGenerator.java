package com.pms.util;

import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    
    public static String generatePatientCode(Long id) {
        return String.format("PAT%03d", id != null ? id : System.currentTimeMillis() % 1000);
    }

    public static String generateDoctorCode(Long id) {
        return String.format("DOC%03d", id != null ? id : System.currentTimeMillis() % 1000);
    }

    public static String generateDepartmentCode(Long id) {
        return String.format("DEP%03d", id != null ? id : System.currentTimeMillis() % 1000);
    }

    public static String generateAppointmentCode(Long id) {
        return String.format("APT%03d", id != null ? id : System.currentTimeMillis() % 1000);
    }

    public static String generateRecordCode(Long id) {
        return String.format("REC%03d", id != null ? id : System.currentTimeMillis() % 1000);
    }

    public static String generatePrescriptionCode(Long id) {
        return String.format("PRE%03d", id != null ? id : System.currentTimeMillis() % 1000);
    }
}
