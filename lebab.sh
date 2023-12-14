#!/bin/sh

for file in $(find . -name "*.js"); do
    lebab --transform commonjs $file -o $file
done
