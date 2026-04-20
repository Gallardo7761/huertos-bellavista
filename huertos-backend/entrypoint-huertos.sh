#!/bin/sh
set -e

echo "*** Compilando huertos..."
cd huertos
mvn clean package -DskipTests

echo "*** Lanzando Spring..."
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5006 -jar target/huertos-1.0.0.jar