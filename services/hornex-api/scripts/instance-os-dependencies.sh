#!/usr/bin/env bash

sudo apt update

sudo apt install -y wget
sudo wget https://www.python.org/ftp/python/3.11.8/Python-3.11.8.tgz

# Install Python3 pip
sudo apt install -y python3-pip

# Install Nginx
sudo apt install -y nginx

# Install Virtualenv
# sudo apt install -y virtualenv
sudo pip install "poetry==1.7.1"
