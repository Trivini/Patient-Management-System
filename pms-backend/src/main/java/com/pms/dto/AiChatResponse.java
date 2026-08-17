package com.pms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatResponse {
    private Long conversationId;
    private String response;
    private String intent; // GENERAL, BOOKING, COPILOT, SUMMARY
    private String disclaimer;
}
