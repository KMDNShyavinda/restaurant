# --- Stage 1: Build the application ---
# Java 21 JDK එක තියෙන Alpine image එකක් ගනී, මේකට 'build' කියලා නම දෙනවා
FROM eclipse-temurin:21-jdk-alpine AS build

# වැඩ කරන ෆෝල්ඩරය '/app' විදිහට සෙට් කරයි
WORKDIR /app

# Maven ධාවනය කිරීමට අවශ්‍ය ෆයිල්ස් සහ pom.xml එක කොපි කරයි
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# අපේ Java Source Code එක (src ෆෝල්ඩරය) කොපි කරයි
COPY src src

# Tests run කරන්නේ නැතුව Maven හරහා කෝඩ් එක Compile කරලා JAR ෆයිල් එකක් හදයි
RUN ./mvnw package -DskipTests

# --- Stage 2: Run the application ---
# කෝඩ් එක Run කරන්න විතරක් අවශ්‍ය JRE (Java Runtime Environment) Image එක ගනී (සයිස් එක අඩුයි)
FROM eclipse-temurin:21-jre-alpine

# වැඩ කරන ෆෝල්ඩරය '/app' විදිහට සෙට් කරයි
WORKDIR /app

# 1 වෙනි Stage එකේ (build) හැදුන JAR ෆයිල් එක අලුත් image එකට 'app.jar' නමින් කොපි කරයි
COPY --from=build /app/target/*.jar app.jar

# කන්ටේනර් එක 8080 port එකෙන් සේවය සපයන බව කියයි
EXPOSE 8080

# කන්ටේනර් එක start වෙනකොට 'java -jar app.jar' කමාන්ඩ් එක රන් කරලා Spring Boot ඇප් එක ඔන් කරයි
ENTRYPOINT ["java", "-jar", "app.jar"]
