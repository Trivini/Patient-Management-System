package com.pms.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    // Forward non-API, non-static routes to index.html for React Router SPA navigation
    @GetMapping(value = {
        "/",
        "/login",
        "/register",
        "/forgot-password",
        "/admin/**",
        "/doctor/**",
        "/receptionist/**",
        "/patient/**",
        "/unauthorized"
    })
    public String forwardToReactSpa() {
        return "forward:/index.html";
    }
}
