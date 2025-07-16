package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "씨아이씨디 테스트<br>" +
               "<a href='http://localhost:8000'></a><br>" +
               "<a href='/h2-console'</a><br>" +
               "<a href='/api/v1/test/public'></a>";
    }
} 