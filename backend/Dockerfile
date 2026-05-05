FROM eclipse-temurin:25-jdk AS builder
WORKDIR /workspace

# Copy only what is needed to build backend + OpenAPI generation input
COPY backend ./backend
COPY documentation ./documentation

WORKDIR /workspace/backend
RUN chmod +x mvnw && ./mvnw -DskipTests package

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=builder /workspace/backend/target/fantasy-world-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
