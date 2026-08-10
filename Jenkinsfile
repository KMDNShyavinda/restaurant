// Jenkins Pipeline එක ආරම්භ කිරීම
pipeline {
    // ඕනෑම Jenkins Agent (සර්වර්) එකක මේක රන් වෙන්න පුළුවන් බව කියයි
    agent any
    
    // Pipeline එකේ තියෙන ප්‍රධාන පියවරවල් (Stages)
    stages {
        
        // 1 වෙනි පියවර: GitHub එකෙන් කෝඩ් එක ඩවුන්ලෝඩ් කරගැනීම
        stage('කෝඩ් එක GitHub එකෙන් ගැනීම (Checkout)') {
            steps {
                // Source Control Management (SCM) - Git repository එකෙන් කෝඩ් එක ගනී
                checkout scm
            }
        }
        
        // 2 වෙනි පියවර: Java Backend එක Test කරලා Build කිරීම
        stage('Backend එක Build කිරීම') {
            steps {
                dir('backend') {
                    // Maven හරහා Java කෝඩ් එක test කරලා compile කරයි
                    sh './mvnw clean package'
                }
            }
        }
        
        // 3 වෙනි පියවර: React Frontend එක Test කරලා බිල්ඩ් කිරීම
        stage('Frontend එක Build කිරීම') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    // Frontend Tests රන් කරයි
                    sh 'npm run test'
                    sh 'npm run build'
                }
            }
        }
        
        // 4 වෙනි පියවර: Docker Images බිල්ඩ් කිරීම සහ Registry එකට Push කිරීම
        stage('Docker Images සෑදීම සහ Push කිරීම') {
            steps {
                // Docker Hub/Registry Credentials පාවිච්චි කරලා ලොග් වෙනවා
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    
                    // Images බිල්ඩ් කරනවා
                    sh 'docker build -t restaurant-pos-backend:latest ./backend'
                    sh 'docker build -t restaurant-pos-frontend:latest ./frontend'
                    
                    // (Optional) Docker Hub එකට push කරන කමාන්ඩ් මෙතන දාන්න පුළුවන්
                    // sh 'docker push restaurant-pos-backend:latest'
                    // sh 'docker push restaurant-pos-frontend:latest'
                }
            }
        }
        
        // 5 වෙනි පියවර: Kubernetes වලට Deploy කිරීම
        stage('Kubernetes වලට Deploy කිරීම') {
            steps {
                // K8s Cluster එකට අලුත් configuration එක Apply කරනවා
                sh 'kubectl apply -f k8s/'
                
                // Deploy වුනාට පස්සේ Pods restart කරලා අලුත් image එක ගන්න කියනවා
                sh 'kubectl rollout restart deployment/pos-backend'
                sh 'kubectl rollout restart deployment/pos-frontend'
            }
        }
    }
}