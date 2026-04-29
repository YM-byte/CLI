package {{javaPackage}}.dto;

public record HealthResponse(
        String framework,
        String project,
        String status,
        String timestamp
) {
}
