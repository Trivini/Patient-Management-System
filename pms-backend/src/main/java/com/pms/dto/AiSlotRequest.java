package com.pms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiSlotRequest {
    private String query; // e.g., "I need to see a dermatologist next Monday afternoon"
    private Long departmentId;
    private Long doctorId;
    private String preferredDate; // YYYY-MM-DD
}
