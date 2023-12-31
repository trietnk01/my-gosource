pipeline {
    agent any
    stages{
        stage('Clone stage'){
            steps{
                git 'https://github.com/trietnk01/my-gosource.git'
            }
        }
        stage('Build stage'){
            steps{
                withDockerRegistry(credentialsId: 'docker-hub-3', url: 'https://index.docker.io/v1/') {
                   sh label:'', script: 'docker build -t nguyenkimdien/my-gosource .'
                   sh label:'', script: 'docker push nguyenkimdien/my-gosource'                   
                }
            }
        }
    }    
}
