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
      stage('build') {
         steps {
           writeFile file: "iTrust2/src/main/java/db.properties", text: "url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true\nusername root\npassword $MYSQL_PASSWORD"
           writeFile file: "iTrust2/src/main/java/email.properties", text: "from $MAIL_USER\nusername $MAIL_USER\npassword $MAIL_PASSWORD\nhost $MAIL_SMTP"
           echo 'Building..'
           sh 'cd iTrust2 && mvn -f pom-data.xml process-test-classes'
            waitUntil {
               script{
                  def get_status = sh script: 'curl http://ec2-3-83-205-182.compute-1.amazonaws.com:8080/iTrust2', returnStatus: true
                  def start_server = sh script: 'cd iTrust2 && mvn jetty:run', returnStdout: true
                  return (get_status == 0);
               }
            }    
           sh 'cd iTrust2 && mvn clean test verify checkstyle:checkstyle'
         }
      }
      stage('test') {
         steps {
           echo 'Testing..'
         }
      }
     stage('deploy') {
      steps {
           echo 'Deploying....'
      }
     }
   }
}
