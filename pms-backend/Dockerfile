# Build Stage using Eclipse Temurin Java 17 JDK
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven Wrapper if present or parent wrapper
COPY mvnw* ./
COPY .mvn ./.mvn
COPY pom.xml .
COPY src ./src

# Grant execute permission and build
RUN if [ -f "./mvnw" ]; then chmod +x ./mvnw && ./mvnw clean package -DskipTests; else apk add --no-cache maven && mvn clean package -DskipTests; fi

# Production Runtime Stage using Eclipse Temurin Java 17 JRE
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create upload directory
RUN mkdir -p uploads/lab-reports

# Copy compiled JAR
COPY --from=builder /app/target/*.jar app.jar

# Render dynamic PORT (Default 10000)
ENV PORT=10000
EXPOSE 10000

# Run Spring Boot application
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Dserver.address=0.0.0.0 -jar app.jar"]
