
---

### 📂 Project Tree

```
multithreaded-password-cracker/             # Root GitHub repo
│
├── src/main/java/com/passwordcracker/      # Java source code
│   │
│   ├── controller/                         # Handles HTTP requests
│   │   └── FileUploadController.java       # Upload file, start cracking, get results
│   │
│   ├── service/                            # Logic layer
│   │   ├── CrackingService.java            # Orchestrates cracking workflow
│   │   └── WordlistService.java            # Manages wordlist validation & selection
│   │
│   ├── cracker/                            # Cracker engine
│   │   ├── Cracker.java                    # Interface (contract for cracker engines)
│   │   ├── MultiThreadedCracker.java       # Multithreaded implementation
│   │   └── SingleThreadedCracker.java      # Fallback (optional, single-threaded)
│   │
│   ├── wordlist/                           # Wordlist processing
│   │   ├── WordlistReader.java             # Interface
│   │   └── TextFileWordlistReader.java     # Reads words from files line by line
│   │
│   ├── repository/                         # Database layer
│   │   ├── ResultRepository.java           # Interface for DB CRUD ops
│   │   └── JdbcResultRepository.java       # JDBC implementation (MySQL)
│   │
│   ├── model/                              # Entities 
│   │   ├── CrackingJob.java                # Represents one cracking attempt
│   │   └── Result.java                     # Stores result (password found, metadata)
│   │
│   ├── config/                             # Configuration files
│   │   ├── DatabaseConfig.java             # JDBC datasource setup (MySQL driver)
│   │   └── AppConfig.java                  # Thread pool + Spring bean configs
│   │
│   └── PasswordCrackerApplication.java     # Spring Boot entry point
│
├── src/main/resources/                     # Front End
│   ├── application.properties              # DB config (URL, username, password), port
│   └── static/                             # Frontend
│       ├── index.html                      # File upload page
│       ├── styles.css                      # UI styling
│       └── app.js                          # Frontend logic (AJAX/Fetch API calls)
│
├── docs/                                   # Documentation
│   ├── module-breakdown.md                 # Module descriptions
│   └── presentation.pptx                   # Project PPT
│
├── README.md                               # Project overview + setup guide
├── .gitignore                              # Ignore target/, IDE files, .env etc.
└── pom.xml                                 # Maven build file (dependencies: Spring Boot, JDBC, MySQL driver)
```

---

### 📑 What goes where:

* **`controller/`** → All REST endpoints using springboot
* **`service/`** → Core logic: starting threads, coordinating cracking
* **`cracker/`** → wordlist processing algorithms (threaded + fallback)
* **`wordlist/`** → Responsible for reading large wordlists efficiently
* **`repository/`** → Database layer via JDBC
* **`model/`** → Entities representing jobs/results
* **`config/`** → Datasource, connection pools, thread configs
* **`resources/static/`** → Frontend files served directly
* **`resources/application.properties`** → DB URL, username, password, server port
* **`docs/`** → Diagrams, PPT, design docs
* **`pom.xml`** → Dependency management

---

