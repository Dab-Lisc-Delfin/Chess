package com.dld.chess.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class HomeController {

    @ResponseBody
    @GetMapping("/home")
    public String getHome() {
        return "home";
    }

    @PostMapping("/api/home")
    public ResponseEntity<Map<String, String>> getHomeJSON() {
        System.out.println("JSON was called");
        Map<String, String> map = new HashMap<>();
        map.put("hello", "test");
        return ResponseEntity.ok(map);
    }
}
