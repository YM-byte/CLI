package {{javaPackage}};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class {{projectClassName}}Application {

    public static void main(String[] args) {
        SpringApplication.run({{projectClassName}}Application.class, args);
    }
}
