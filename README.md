# AppsoFluna - SimpleApps v1.0

SimpleApps (by AppsoFluna) is a web-based tool to create simple applications.

This project will be submitted as the PGD Level Project for BCS Higher Education Qualification.

The progress of this project will be submitted on http://www.appsofluna.com/

**Demo**

[![SimpleApps Demo](http://img.youtube.com/vi/e5qW0Sv_RtQ/0.jpg)](http://www.youtube.com/watch?v=e5qW0Sv_RtQ)

## Prerequesties

1. MySQL
2. JRE or JDK
3. Server such as Tomcat/Glassfish (Optional, only if it need to be deployed into an existing server)

## How to run
1. Log into MySQL as root
2. Apply **data.sql** (This will create a user and a database called simpleapps with sample data.)
3. Run **"java -jar target/simpleapps-1.0.war"** directly. (If you need to deploy it into a webserver such as Tomcat, please copy **target/simpleapps-1.0.war** file into your server war path)
4. Visit the system in **http://localhost:8080** or your server location. (You may change the port by editing **server.port** property in **application.properties** file.)

**data.sql** file automatically adds a sample app called School into the database.

You may login to the system with the default username and password and generate the code (read **User Manual (manual.pdf)** for further information).

username = **admin**

password = **guess**

If you made no changes the result will be similar to that of **sample_school.zip** file.

# Futher information
GitHub Repository - https://github.com/appsofluna/appsofluna-simpleapps

Project Website - http://www.appsofluna.com

~~Working Prototype - http://simpleapps-appsofluna.rhcloud.com
Note that as it's on a free openshift account, it takes serveral minutes to start work, once it has been idle.
Therefore you might receive an error first. In that case you can visit the prototype after few minutes.~~

Working Prototype - http://www.appsofluna.com:8080
