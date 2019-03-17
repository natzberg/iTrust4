pipeline {
   agent any
   environment {
        MYSQL_PASSWORD = 'blah'
        MAIL_USER = 'team4.devops.s19'
        MAIL_PASSWORD = 'W0lfw@re'
        MAIL_SMTP = 'smtp.gmail.com'
   }
   stages {
      stage('setup') {
         steps {
            echo 'Setting up...'
            writeFile file: "iTrust2/src/main/java/db.properties", text: "url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true\nusername root\npassword $MYSQL_PASSWORD"
            writeFile file: "iTrust2/src/main/java/email.properties", text: "from $MAIL_USER\nusername $MAIL_USER\npassword $MAIL_PASSWORD\nhost $MAIL_SMTP"
            sh 'cd iTrust2 && mvn -f pom-data.xml process-test-classes'
         }
      }
      stage('build and test') {
         steps {
            echo 'Building..'
            sh 'cd iTrust2 && mvn clean test verify checkstyle:checkstyle'
            
            echo 'JUnit, Jacoco, and Checkstyle'
            junit 'iTrust2/target/surefire-reports/**/*.xml'
             jacoco(
                 execPattern: 'iTrust2/target/coverage-reports/*.exec',
                 classPattern: 'iTrust2/target/classes',
                 sourcePattern: 'iTrust2/src/main/java',
                 exclusionPattern: 'iTrust2/src/test*',
                 changeBuildStatus: true,
                 minimumInstructionCoverage: '50'
             )
             checkstyle(
                 pattern: 'iTrust2/target/checkstyle-result.xml',
                 failedTotalAll: '0'
             )
             pmd (
                canRunOnFailed: true, 
                pattern: 'build/logs/pmd.xml'
             )
         }
      }
      stage ('Analysis') {
        steps {
          echo 'Maybe put analysis?'
        }
      }
      
   }
}
