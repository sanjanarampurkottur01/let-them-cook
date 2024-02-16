# Use an official OpenJDK runtime as a parent image
FROM openjdk:17.0.1-jdk-slim

# Set the working directory to /app
WORKDIR /app

RUN ls

# Copy only the necessary files to cache dependencies and build the project
# COPY Backend/letscook/letscook/build.gradle Backend/letscook/letscook/settings.gradle Backend/letscook/letscook/gradlew Backend/letscook/letscook/gradlew.bat /app/

# COPY Backend/letscook/letscook/gradle /app/gradle

COPY Backend/letscook/letscook/ /app/

RUN chmod 777 ./gradlew

# Download dependencies
RUN ./gradlew --version

# Build the project
RUN ./gradlew build

# Expose port 8080 (adjust as needed)
EXPOSE 8080

# Command to run your application
CMD ["java", "-jar", "build/libs/letscook-0.0.1-SNAPSHOT.jar"]
