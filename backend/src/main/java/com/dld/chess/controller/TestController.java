package com.dld.chess.controller;

import com.dld.chess.service.GameService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TestController {
    GameService chessboardService;

    public TestController(GameService chessboardService){
        this.chessboardService = chessboardService;
    }

    @GetMapping("/test")
    @ResponseBody
    public String getTest(){
        chessboardService.createNewGame();
        return "test";
    }

}
