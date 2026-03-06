#!/bin/bash

cd core/ || exit
mvn clean package
cd ..
cd huertos/ || exit
mvn clean package
cd ..
scp core/target/core-*.jar root@huertosbellavista.es:/root/transfer
scp huertos/target/huertos-*.jar root@huertosbellavista.es:/root/transfer