# Build Stage using Eclipse Temurin Java 17 JDK
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven Wrapper and configuration
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY pms-backend/pom.xml pms-backend/

# Ensure Maven Wrapper is executable
RUN chmod +x ./mvnw

# Copy source code
COPY pms-backend/src pms-backend/src

# Build production JAR skipping tests
RUN ./mvnw clean package -DskipTests -f pms-backend/pom.xml

# Production Runtime Stage using Eclipse Temurin Java 17 JRE
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create upload directory for lab reports
RUN mkdir -p uploads/lab-reports

# Copy compiled JAR from build stage
COPY --from=builder /app/pms-backend/target/*.jar app.jar

# Render dynamic PORT configuration (Default 10000)
ENV PORT=10000
EXPOSE 10000

# Run Spring Boot application bound to Render PORT and 0.0.0.0
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Dserver.address=0.0.0.0 -jar app.jar"]
