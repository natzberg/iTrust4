pipeline {
   agent any
   environment {
        MYSQL_PASSWORD = 'blah'
        MAIL_USER = 'team4.devops.s19'
        MAIL_PASSWORD = 'W0lfw@re'
        MAIL_SMTP = 'smtp.gmail.com'
   }
   stages {
      stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/natzberg/iTrust4.git']]])
            }
        }
      stage('setup') {
         steps {
            echo 'Setting up...'
            writeFile file: "iTrust2/src/main/java/db.properties", text: "url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true\nusername root\npassword $MYSQL_PASSWORD"
            writeFile file: "iTrust2/src/main/java/email.properties", text: "from $MAIL_USER\nusername $MAIL_USER\npassword $MAIL_PASSWORD\nhost $MAIL_SMTP"
            sh 'cd iTrust2 && mvn -f pom-data.xml process-test-classes'
         }
      }
      stage('build') {
         steps {
           echo 'Building..'
           sh 'cd iTrust2 && mvn clean test verify checkstyle:checkstyle'
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
         }
      }
      stage ('Analysis') {
         steps {
             sh '${M2_HOME}/bin/mvn --batch-mode -V -U -e checkstyle:checkstyle pmd:pmd pmd:cpd findbugs:findbugs spotbugs:spotbugs'
             recordIssues enabledForFailure: true, tool: checkStyle()
            }
      }
      
   }
}
