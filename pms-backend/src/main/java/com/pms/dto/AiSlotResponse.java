package com.pms.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSlotResponse {
    private String parsedDepartment;
    private String parsedSpecialization;
    private String parsedDate;
    private String parsedTimeRange;
    private List<AvailableSlotDto> availableSlots;
    private String summaryText;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AvailableSlotDto {
        private Long doctorId;
        private String doctorName;
        private String doctorCode;
        private String specialization;
        private Long departmentId;
        private String departmentName;
        private String date; // YYYY-MM-DD
        private String time; // HH:mm (e.g. 10:00)
    }
}
