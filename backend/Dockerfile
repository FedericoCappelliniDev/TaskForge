# ── Stage 1: build ───────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Install Maven 3.9
ARG MAVEN_VERSION=3.9.9
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
       | tar -xz -C /opt \
    && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/local/bin/mvn

# Cache dependencies first
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre
WORKDIR /app

# Non-root user for security
RUN groupadd -r taskforge && useradd -r -g taskforge taskforge
USER taskforge

COPY --from=build /app/target/taskforge-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
