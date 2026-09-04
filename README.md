# Automated CI/CD & Monitoring Pipeline for Weather Application

A full-stack DevOps project demonstrating automated building, containerization, deployment, and monitoring of a Weather Web Application using Jenkins, Docker, Prometheus, and Grafana.

---

## 📐 System Architecture

```text
[ Developer ] ───( git push )───► [ GitHub Repo ]
                                        │
                                 (Webhook / Trigger)
                                        ▼
┌────────────────────────────────────────────────────────┐
│                   Jenkins CI/CD Pipeline               │
│                                                        │
│ ┌──────────────┐    ┌──────────────┐    ┌──────────┐   │
│ │ 1. Checkout  │ ──►│ 2. Run Tests │ ──►│ 3. Build │   │
│ └──────────────┘    └──────────────┘    └────┬─────┘   │
└──────────────────────────────────────────────┼─────────┘
                                               │
                                         (Push Image)
                                               ▼
                                   ┌──────────────────────┐
                                   │      Docker Hub      │
                                   └───────────┬──────────┘
                                               │
                                         (Pull & Deploy)
                                               ▼
┌────────────────────────────────────────────────────────┐
│                   Deployment Server                    │
│                                                        │
│ ┌─────────────────┐           ┌──────────────────┐     │
│ │   Weather App   │◄──────────┤ Prometheus Engine│     │
│ │(Docker Container)           │ (Scrapes Metrics)│     │
│ └─────────────────┘           └────────┬─────────┘     │
│                                        │               │
│                                   (Visualizes)         │
│                                        ▼               │
│                               ┌──────────────────┐     │
│                               │ Grafana Dashboard│     │
│                               └──────────────────┘     │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Tools

* **CI/CD Automation:** Jenkins
* **Containerization:** Docker, Docker Compose
* **Artifact Registry:** Docker Hub
* **Monitoring & Observability:** Prometheus, Grafana
* **Version Control:** Git, GitHub

---

## 🚀 Key Features

* **Automated Pipeline:** Triggers automatically on code pushes to test, build, and publish container images.
* **Registry Integration:** Pushes versioned tags (`latest`, `build-id`) directly to Docker Hub repository (`ahmedmaher5/weather-backend`).
* **Environment Provisioning:** Deploys application and monitoring services seamlessly using Docker Compose.
* **Real-time Observability:** Prometheus scrapes application metrics, visualized through customized Grafana dashboards.

---

## 📸 Screenshots & Proof of Work

### 1. Jenkins CI/CD Pipeline
<img width="1916" height="788" alt="Screenshot 2026-09-04 210103" src="https://github.com/user-attachments/assets/31f69726-1518-4a36-8707-f20fad476779" />

### 2. Docker Hub Registry
<img width="1913" height="902" alt="Screenshot 2026-09-04 210150" src="https://github.com/user-attachments/assets/e4b52424-55e6-4fb2-afda-fce8c9363bdb" />

### 3. Deployed Weather Application
<img width="1918" height="902" alt="Screenshot 2026-09-04 210304" src="https://github.com/user-attachments/assets/966aa27d-b22f-4835-bd4b-d357b2d0dbd0" />

---

## 🔧 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ahmedmaher-IT/Weather-App-Pipeline.git](https://github.com/ahmedmaher-IT/Weather-App-Pipeline.git)
   cd Weather-App-Pipeline
   ```

2. **Start services with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

3. **Access Services:**
   * **Weather App:** `http://localhost:3000`
   * **Prometheus:** `http://localhost:9090`
   * **Grafana:** `http://localhost:3001`
