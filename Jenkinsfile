pipeline {
    agent any
    
    stages {
        stage('කෝඩ් එක GitHub එකෙන් ගැනීම (Checkout)') {
            steps {
                checkout scm
            }
        }
        
        stage('Backend එක Build කිරීම') {
            steps {
                dir('backend') {
                    // Java code build 
                    sh './mvnw clean package -DskipTests'
                }
            }
        }
        
        stage('Frontend එක Build කිරීම') {
            steps {
                dir('frontend') {
                    // React code build 
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Docker Images සෑදීම') {
            steps {
                // අර අපි කලින් හදපු Dockerfiles පාවිච්චි කරලා images හදනවා
                sh 'docker compose build'
            }
        }
    }
}