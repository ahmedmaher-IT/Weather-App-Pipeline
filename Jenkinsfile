pipeline {
    agent any

    environment {
        DOCKER_HUB_CRED = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies & Run Tests') {
            steps {
                dir('BACK') {
                    sh '''
                        tar -cf - . | docker run --rm -i \
                        -e OPENWEATHER_API_KEY=dummy_test_key \
                        -e JWT_SECRET=test_jwt_secret \
                        -w /app node:20-alpine sh -c "
                            tar -xf - -C /app && \
                            mkdir -p logs && \
                            npm install && \
                            chmod -R +x node_modules/.bin && \
                            npm test
                        "
                    '''
                }
            }
        }

        stage('Deploy (Docker Compose)') {
            steps {
                sh '''
                    rm -rf prometheus prometheus.yml prometheus_config
                    docker volume prune -f || true
                    mkdir -p prometheus_config
                '''

                writeFile file: 'prometheus_config/prometheus.yml', text: '''global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'weather-backend'
    static_configs:
      - targets: ['backend:5000']
'''

                sh '''
                    chmod -R 777 prometheus_config
                    docker rm -f weather-backend weather-grafana weather-prometheus || true
                    docker compose up -d --build --remove-orphans backend grafana prometheus
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Deployment Succeeded successfully!'
        }
        failure {
            echo 'Pipeline failed! Check console output.'
        }
    }
}