package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "CICD!<br>" +
               "<a href='http://localhost:8000'>React 프론트엔드로 이동</a><br>" +
               "<a href='/h2-console'>H2 데이터베이스 콘솔</a><br>" +
               "<a href='/api/v1/test/public'>공개 API 테스트</a>";
    }
} 