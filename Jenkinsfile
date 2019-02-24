node {
    stages {
        stage('build') {
            steps {
                sh 'mvn -f pom-data.xml process-test-classes'
                sh 'mv jetty:run'
            }
        }
        stage('test') {
            steps {
                'mvn clean test verify checkstyle:checkstyle'
            }
        }
    }
}
