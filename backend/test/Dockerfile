# Build stage
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Cài Maven thủ công
RUN apt-get update && apt-get install -y maven

COPY test/pom.xml .
RUN mvn dependency:go-offline

COPY test/src ./src

RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=build /app/target/test-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]
