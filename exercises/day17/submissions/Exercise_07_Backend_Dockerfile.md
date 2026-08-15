# D17 Exercise 07 - Backend Dockerfile (Submission)

> Project: **Asset Tracker** (Spring Boot 4.1, Java 21, Maven). Image tag used:
> `asset-tracker-api:day17`.

## Files

- `Dockerfile` — multi-stage build.
- `.dockerignore` — keeps the context small and excludes `.env`, keys and build
  output so no secret enters the image.

## Requirements met

| # | Requirement | How |
|---|---|---|
| 1 | Build stage | `FROM maven:3.9-eclipse-temurin-21 AS build` |
| 2 | Runtime stage | `FROM eclipse-temurin:21-jre AS runtime` |
| 3 | Build the JAR inside Docker | `mvn -B -q clean package -DskipTests` in the build stage |
| 4 | Copy only the final JAR | `COPY --from=build /app/target/AssetTracker-0.0.1-SNAPSHOT.jar app.jar` |
| 5 | Expose 8080 | `EXPOSE 8080` |
| 6 | No secrets | none baked in; creds supplied at runtime via `--env-file .env`; `.dockerignore` excludes `.env`/`*.pem`/`*.key` |

Extras: dependencies pre-fetched (`dependency:go-offline`) for cache-friendly
rebuilds, and the app runs as a **non-root** `spring` user.

## Build output (real run)

```bash
$ docker build -t asset-tracker-api:day17 .
...
 => [build 4/6] RUN mvn -B -q dependency:go-offline        37.7s
 => [build 6/6] RUN mvn -B -q clean package -DskipTests
 => [runtime 4/4] COPY --from=build /app/target/AssetTracker-0.0.1-SNAPSHOT.jar app.jar
 => exporting to image
 => naming to docker.io/library/asset-tracker-api:day17
BUILD EXIT=0
```

Image + contents:

```bash
$ docker images asset-tracker-api:day17
asset-tracker-api:day17   588MB

$ docker run --rm --entrypoint sh asset-tracker-api:day17 -c "ls -la /app && whoami"
-rw-r--r-- 1 root root 36512428  app.jar     # only the jar, no source/build tools
spring                                       # runs as non-root
# java -version -> openjdk 21.0.11 LTS
```

## Run command

```bash
docker run --rm --name asset-tracker-api-day17 \
  --env-file .env \
  -e SPRING_PROFILES_ACTIVE=docker \
  -p 8080:8080 \
  asset-tracker-api:day17
```

> Note: the container needs `JWT_SECRET` (non-demo, ≥32 chars) and MongoDB
> settings via `--env-file .env`. To reach a MongoDB running on the host,
> use `MONGODB_HOST=host.docker.internal` (Docker Compose service names come on
> Day 18).
