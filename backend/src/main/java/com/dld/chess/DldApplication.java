package com.dld.chess;

import com.dld.chess.model.GameManage;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DldApplication {

    public static void main(String[] args) {
        SpringApplication.run(DldApplication.class, args);
//        GameManage gameManage = GameManage.getInstance();

    }

}
