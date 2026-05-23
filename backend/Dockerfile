FROM maven:4.0.0-rc-5-eclipse-temurin-26-alpine

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY . .
CMD ["mvn", "spring-boot:run"]