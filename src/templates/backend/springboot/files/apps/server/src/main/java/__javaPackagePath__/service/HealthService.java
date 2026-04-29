package {{javaPackage}}.service;

import {{javaPackage}}.dto.HealthResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class HealthService {

    public HealthResponse getHealth() {
        return new HealthResponse(
                "springboot",
                "{{projectName}}",
                "ok",
                Instant.now().toString()
        );
    }
}
