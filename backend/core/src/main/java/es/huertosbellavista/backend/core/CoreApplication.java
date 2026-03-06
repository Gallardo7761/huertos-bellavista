package es.huertosbellavista.backend.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
	"es.huertosbellavista.backend.core",
	"net.miarma.backlib"
})
public class CoreApplication {
	public static void main(String[] args) {
		SpringApplication.run(CoreApplication.class, args);
	}
}
