pipeline {
    agent any
    stages{
        stage('Clone'){
            steps{
                git 'https://github.com/trietnk01/my-gosource.git'
            }
        }
        stage('Clone stage'){
            steps{
                withDockerRegistry(credentialsId: 'docker-hubv2', url: 'https://index.docker.io/v1/') {
                   sh label:'', script: 'docker build -t nguyenkimdien/my-gosource .'
                   sh label:'', script: 'docker push nguyenkimdien/my-gosource'                   
                }
            }
        }
    }    
}
