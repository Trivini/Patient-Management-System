# Stage 1: Build React Frontend using Node.js 18
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

COPY pms-frontend/package*.json ./
RUN npm install

COPY pms-frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend using Eclipse Temurin Java 17 JDK
FROM eclipse-temurin:17-jdk-alpine AS backend-builder

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY pms-backend/pom.xml pms-backend/

RUN chmod +x ./mvnw

COPY pms-backend/src pms-backend/src

# Copy built React production assets into Spring Boot static resources folder
COPY --from=frontend-builder /app/frontend/dist /app/pms-backend/src/main/resources/static

# Build unified production JAR skipping tests
RUN ./mvnw clean package -DskipTests -f pms-backend/pom.xml

# Stage 3: Unified Production Runtime Stage using Eclipse Temurin Java 17 JRE
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN mkdir -p uploads/lab-reports

COPY --from=backend-builder /app/pms-backend/target/*.jar app.jar

ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Dserver.address=0.0.0.0 -jar app.jar"]
