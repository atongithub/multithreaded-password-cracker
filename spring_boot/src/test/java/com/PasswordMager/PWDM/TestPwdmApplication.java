package com.PasswordMager.PWDM;

import org.springframework.boot.SpringApplication;

public class TestPwdmApplication {

	public static void main(String[] args) {
		SpringApplication.from(PwdmApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
