# Multithreaded Password Cracker

A Java Spring Boot service to attempt recovering passwords from password-protected archives using wordlists. Supports single-threaded, multi-threaded, and GPU-accelerated cracking (Hashcat integration).

---

## Features

- Upload password-protected archives via web UI.
- Select or specify a wordlist for brute-force attempts.
- Backend job management and status polling.
- Multi-threaded CPU cracker.
- Wordlist storage in MySQL (configurable).

---

## Quick start (Windows)

Prerequisites:
- Java 17+ (OpenJDK)
- Maven wrapper (project includes `mvnw.cmd`)
- MySQL server if you use DB-backed wordlists

1. Build the project:

```powershell
# Clean and build
.\mvnw.cmd clean install
```

2. Configure the application (edit `src/main/resources/application.properties` or set env vars):

```properties
# Example properties
spring.datasource.url=jdbc:mysql://localhost:3306/passwordcracker?allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=youruser
spring.datasource.password=yourpassword
```

3. Run the app:

```powershell
# Run via Spring Boot plugin
.\mvnw.cmd spring-boot:run

# Or run the packaged jar
java -jar target\multithreaded-password-cracker-<version>.jar
```

4. Open the UI in your browser (default):

```
http://localhost:8080/
```

---

## Development notes

- Frontend static files are served from `src/main/resources/static`. After edits, run a clean build to copy them into `target/classes/static`
- If Spring DevTools causes stale classloading, disable restart in `application.properties`:

```properties
spring.devtools.restart.enabled=false
```

---

## Troubleshooting

- Old static files still appear after rebuild:
  - Manually delete `target` and run `mvnw.cmd clean install`.
  - Ensure no other instance of the app (or an older JAR) is running.

- MySQL `Public Key Retrieval is not allowed` error:
  - Add `allowPublicKeyRetrieval=true` to your JDBC URL and `useSSL=false` if appropriate.
  - Example: `jdbc:mysql://host:3306/db?allowPublicKeyRetrieval=true&useSSL=false`

---

## License

This project is released under the MIT License. See `LICENSE` for details.
