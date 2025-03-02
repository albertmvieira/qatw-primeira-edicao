pipeline {
    agent {
        docker {
            // image 'mcr.microsoft.com/playwright:v1.50.1-noble' // imagem oficial do Playwright
            image 'albertmvieira/playwright-nj-v1.50.1-noble' // imagem customizada do Playwright com java incluído para execução do server do allure. Esta na minha conta do DockerHub
            args '--network qatw-primeira-edicao_skynet'
        }
    }

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
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }
}
