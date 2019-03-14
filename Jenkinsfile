pipeline {
   agent any
   environment {
        MYSQL_PASSWORD = 'blah'
        MAIL_USER = 'ncsudevops.s19'
        MAIL_PASSWORD = 'Zorro1997'
        MAIL_SMTP = 'smtp.gmail.com'
   }
   stages {
      stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/natzberg/iTrust4.git']]])
            }
        }
      stage('setup') {
         echo 'Setting up...'
         writeFile file: "iTrust2/src/main/java/db.properties", text: "url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true\nusername root\npassword $MYSQL_PASSWORD"
         writeFile file: "iTrust2/src/main/java/email.properties", text: "from $MAIL_USER\nusername $MAIL_USER\npassword $MAIL_PASSWORD\nhost $MAIL_SMTP"
         sh 'cd iTrust2 && mvn -f pom-data.xml process-test-classes'
      }
      stage('build') {
         steps {
           echo 'Building..'
           sh 'cd iTrust2 && mvn clean test verify checkstyle:checkstyle'
         }
      }
   }
}
