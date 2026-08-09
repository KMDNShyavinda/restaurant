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
        
        // 2 වෙනි පියවර: Java Backend එක බිල්ඩ් කිරීම
        stage('Backend එක Build කිරීම') {
            steps {
                // 'backend' ෆෝල්ඩරය ඇතුළට යයි
                dir('backend') {
                    // Maven හරහා Java කෝඩ් එක compile කරලා JAR ෆයිල් එකක් සාදයි (Tests skip කර ඇත)
                    sh './mvnw clean package -DskipTests'
                }
            }
        }
        
        // 3 වෙනි පියවර: React Frontend එක බිල්ඩ් කිරීම
        stage('Frontend එක Build කිරීම') {
            steps {
                // 'frontend' ෆෝල්ඩරය ඇතුළට යයි
                dir('frontend') {
                    // Node packages ටික ඩවුන්ලෝඩ් කරගනී
                    sh 'npm install'
                    // අන්තර්ජාලයට දාන්න පුළුවන් විදිහට (Production) React කෝඩ් එක බිල්ඩ් කරයි
                    sh 'npm run build'
                }
            }
        }
        
        // 4 වෙනි පියවර: කෝඩ් එකෙන් අලුත් Docker Images සෑදීම
        stage('Docker Images සෑදීම') {
            steps {
                // docker-compose.yml ෆයිල් එකේ තියෙන විදිහට images ටික බිල්ඩ් කරයි
                sh 'docker compose build'
            }
        }
    }
}