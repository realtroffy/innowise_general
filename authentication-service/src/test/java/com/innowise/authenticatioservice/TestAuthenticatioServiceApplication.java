package com.innowise.authenticatioservice;

import org.springframework.boot.SpringApplication;

public class TestAuthenticatioServiceApplication {

    public static void main(String[] args) {
        SpringApplication.from(AuthenticationServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
