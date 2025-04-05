package com.example.test;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import com.example.test.Config.SecurityConfig;

@SpringBootTest
@Import(SecurityConfig.class)
class TestApplicationTests {

	@Test
	void contextLoads() {
	}

}
