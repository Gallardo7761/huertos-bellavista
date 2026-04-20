#!/bin/sh
set -e

echo "*** Compilando core..."
cd core
mvn clean package -DskipTests

echo "*** Lanzando Spring..."
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar target/core-1.0.0.jar