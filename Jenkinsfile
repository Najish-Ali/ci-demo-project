pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "us-east-1"
        S3_BUCKET = "ci-demo-build "
        BACKEND_PRIVATE_KEY = credentials('ec2-ssh-key')
        BACKEND_SERVER_USER = "ubuntu"
        BACKEND_SERVER_IP = "10.0.2.46"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Najish-Ali/ci-demo-project.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') { sh 'npm install' }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') { sh 'npm install' }
            }
        }

        stage('Build Maven') {
            steps {
                dir('maven-app') { sh 'mvn clean package' }
            }
        }

        stage('Build Gradle') {
            steps {
                dir('gradle-app') { sh './gradlew build' }
            }
        }

        stage('Upload Artifacts to S3') {
            steps {
                sh """
                aws s3 cp maven-app/target/ s3://${S3_BUCKET}/maven/ --recursive
                aws s3 cp gradle-app/build/ s3://${S3_BUCKET}/gradle/ --recursive
                """
            }
        }

        stage('Deploy Frontend to Tomcat') {
            steps {
                sh """
                rm -rf /var/lib/tomcat9/webapps/frontend
                mkdir -p /var/lib/tomcat9/webapps/frontend
                cp -r frontend/* /var/lib/tomcat9/webapps/frontend/
                systemctl restart tomcat9
                """
            }
        }

        stage('Deploy Backend to EC2 Using PM2') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no -i ${BACKEND_PRIVATE_KEY} ${BACKEND_SERVER_USER}@${BACKEND_SERVER_IP} '
                    sudo mkdir -p /opt/backend &&
                    sudo rm -rf /opt/backend/* &&
                    sudo npm install pm2 -g &&
                    sudo cp -r ~/workspace/ci-demo-project/backend/* /opt/backend &&
                    cd /opt/backend &&
                    pm2 delete backend || true &&
                    pm2 start server.js --name backend &&
                    pm2 save
                '
                """
            }
        }

        stage('Publish SNS Event') {
            steps {
                sh 'aws sns publish --topic-arn arn:aws:sns:us-east-1:ACCOUNT:ci-demo-events --message "Jenkins pipeline completed"'
            }
        }

    }

}
