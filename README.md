![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
[![Static Badge](https://img.shields.io/badge/telegram-blue?style=for-the-badge&logo=telegram&logoColor=white&logoSize=auto)](https://t.me/mrxarom)
![Status](https://img.shields.io/badge/Status-Development-informational?style=for-the-badge&logo=github)

# Skriva
Skriva is an application that allows you to create your own blog and interact with others blogs. The app enables users to add, edit, delete, like, and discover blogs created by other users.

## Project Purpose
The project was created primarily to learn how the Django framework works, as it handles the entire backend of this application. By building such a large project, I gained a lot of new knowledge that will be useful to me in the future.

## Features
Creating posts, Editing posts, Deleting posts, Changing post status, View counter for each post, Ability to like posts, Profile customization (banner/profile picture/bio/date of birth/full name), Login via Discord or GitHub, Viewing posts from other users (on a dedicated page), Viewing other users' profiles (on a dedicated page), Viewing all posts from a specific user

## Live Demo
Link: https://www.xarom.one/


## Technologies Used

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

## How to Use
To run this application, you’ll need a basic understanding of Django (if you want to run it on your own computer or server). If you just want to see how it works, visit the live demo.

**~**Steps to run the application locally:

**~**Clone the entire GitHub repository

**~**Install all dependencies from requirements.txt

**~**Fill the .env file with all the necessary information.

**~**Run migrations:
`python manage.py makemigrations`

`python manage.py migrate`

**~**Start the (local) server:

`python manage.py runserver`

**WARNING! If you want to deploy this project to a server, you will need to add your domain in all required places in the settings file and replace every instance of yourdomain accordingly.**

## App appearance
![App viev](media/app_preview.gif)

## Licence
This extension is licensed under the MIT License, which means it is free to use, modify, and distribute with minimal restrictions, as long as the original license and copyright notice are included.

## Project Status
*This application will no longer be actively developed. However, bug fixes may still be released occasionally.*

**Application created by Gabriel Dudek (XaromPL)**
