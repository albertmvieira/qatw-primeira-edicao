pipeline {
    agent any

    stages {
        stage('Node.js Deps') {
            steps {
                echo 'Baixando e instalando dependências do Projeto'
                sh 'npm install'
            }
        }
        stage('E2E Tests') {
            steps {
                echo 'Executando os testes de ponta a ponta'
                sh 'npx playwright test'
            }
        }
    }
}
