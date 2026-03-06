package es.huertosbellavista.backend.huertos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication(scanBasePackages = {
	"es.huertosbellavista.backend.huertos",
	"net.miarma.backlib"
})
public class HuertosApplication {
	public static void main(String[] args) {
		SpringApplication.run(HuertosApplication.class, args);
	}
}
