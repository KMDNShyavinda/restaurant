package com.restaurant.pos_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PosBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PosBackendApplication.class, args);
	}

}
