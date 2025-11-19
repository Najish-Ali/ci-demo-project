pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "us-east-1"
        S3_BUCKET = "ci-demo-static-site-12345"
        SQS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/711379610854/deployment-events"
        SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:711379610854:deployNotifications"
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Najish-Ali/ci-demo-project.git'
            }
        }

        stage('Build Node App') {
            steps {
                dir('node-app') {
                    sh 'npm install'
                    sh 'node build.js'
                }
            }
        }

        stage('Build Maven App') {
            steps {
                dir('maven-app') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Build Gradle App') {
            steps {
                dir('gradle-app') {
                    sh 'gradle build'
                }
            }
        }

        stage('Upload Node Site to S3') {
            steps {
                sh 'aws s3 sync node-app/dist/ s3://${S3_BUCKET}/ --delete'
            }
        }

        stage('Upload Artifacts to S3') {
            steps {
                sh """
                aws s3 cp maven-app/target/ s3://${S3_BUCKET}/artifacts/maven/ --recursive
                aws s3 cp gradle-app/build/libs/ s3://${S3_BUCKET}/artifacts/gradle/ --recursive
                """
            }
        }

        stage('Send Notification to SQS') {
            steps {
                sh """
                aws sqs send-message \
                --queue-url ${SQS_QUEUE_URL} \
                --message-body "Deployment Successful! Node site & artifacts uploaded."
                """
            }
        }
    }

    post {
        success {
            sh """
            aws sns publish \
            --topic-arn ${SNS_TOPIC_ARN} \
            --message "Deployment SUCCESS: Node site & artifacts uploaded. Check S3."
            """
        }
        failure {
            sh """
            aws sns publish \
            --topic-arn ${SNS_TOPIC_ARN} \
            --message "Deployment FAILED! Check Jenkins logs."
            """
        }
    }
}
