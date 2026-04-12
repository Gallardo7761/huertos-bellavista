package es.huertosbellavista.backend.huertos.config;

import io.jsonwebtoken.io.IOException;
import es.huertosbellavista.backend.huertos.service.CoreAuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate authRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setErrorHandler(new NoOpResponseErrorHandler());
        return restTemplate;
    }

    @Bean
    public RestTemplate secureRestTemplate(CoreAuthService coreAuthService) {
        RestTemplate restTemplate = new RestTemplate();

        restTemplate.getInterceptors().add((request, body, execution) -> {
            String token = coreAuthService.getToken();
            request.getHeaders().setBearerAuth(token);
            return execution.execute(request, body);
        });

        restTemplate.setErrorHandler(new NoOpResponseErrorHandler());

        return restTemplate;
    }

    public static class NoOpResponseErrorHandler implements ResponseErrorHandler {
        @Override
        public boolean hasError(ClientHttpResponse response) throws IOException {
            return false;
        }
    }
}

