pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.59.1-noble'
      reuseNode true
    }
  }

  parameters {
    choice(name: 'TARGET_ENV', choices: ['staging', 'production', 'local'], description: 'Test environment passed to Playwright')
    choice(name: 'BROWSER_PROJECT', choices: ['chromium', 'firefox', 'webkit'], description: 'Playwright browser project')
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build Validation') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        sh 'npm test -- --env ${TARGET_ENV} --project=${BROWSER_PROJECT}'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
      junit testResults: 'test-results/**/*.xml', allowEmptyResults: true
    }
  }
}
