def loadProperties() {
    node {
        File dbPropertiesFile = new File("iTrust2/src/main/java/db.properties")
        dbPropertiesFile.write("url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true\n"
        dbPropertiesFile.write("username root\n")
        dbPropertiesFile.write("password blah\n")
    File emailPropertiesFile = new File("iTrust2/src/main/java/email.properties")
    emailPropertiesFile.write("from ncsudevops.s19\n"
    emailPropertiesFile.write("username ncsudevops.s19\n")
    emailPropertiesFile.write("password Zorro1997\n")
    emailPropertiesFile.write("host smtp.gmail.com"\n)
}
}
pipeline {
   agent any
   environment {
        MYSQL_PASSWORD = 'blah'
        MAIL_USER = 'ncsudevops.s19'
        MAIL_PASSWORD = 'Zorro1997'
        MAIL_SMTP = 'smtp.gmail.com'
   }
   stages {
      stage('build') {
         steps {
               echo 'Building..'
               script{
                  loadProperties()
               }
               sh 'mvn -f pom-data.xml process-test-classes'
               sh 'mvn jetty:run'
               sh 'mvn clean test verify checkstyle:checkstyle'
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
