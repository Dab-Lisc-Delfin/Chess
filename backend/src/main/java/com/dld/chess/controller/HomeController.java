package com.dld.chess.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
public class HomeController {

    @ResponseBody
    @GetMapping("/home")
    public String getHome() {
        return "home";
    }
}
