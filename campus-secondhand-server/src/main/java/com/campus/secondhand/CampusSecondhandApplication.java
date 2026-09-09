package com.campus.secondhand;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.campus.secondhand.mapper")
@EnableScheduling
public class CampusSecondhandApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusSecondhandApplication.class, args);
        System.out.println("========================================");
        System.out.println("  校园二手交易平台后端启动成功！");
        System.out.println("  http://localhost:8080");
        System.out.println("========================================");
    }
}
