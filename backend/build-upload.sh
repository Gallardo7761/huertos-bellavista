#!/bin/bash

cd core/ || exit
mvn clean package
cd ..
cd huertos/ || exit
mvn clean package
cd ..
scp core/target/core-*.jar root@159.69.155.167:/root/transfer
scp huertos/target/huertos-*.jar root@159.69.155.167:/root/transfer