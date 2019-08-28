# NodeJS-Key-Auth
A login system that uses UUID v4 keys as a form of authentication, built on NodeJS and Express with sqlite.



## How to setup
Run `npm install` to install all modules,
then run `node app`to run the application

## Information
Upon running the app for the first time, the sqlite database will automatically be created with all the
tables and columns. An admin user called `default user` will also be created. The login key for this
user is `fc6b4343-d567-43d2-b3fd-24111766af54`

Once logged in with the default user, you can create keys and posts. It is recommended that you create a new
admin key, Use it to login, and then delete the default one for security reasons.

## Screenshots
Login Page             |  Homepage
:-------------------------:|:-------------------------:
![](https://i.imgur.com/uYJqtFI.png)  |  ![](https://i.imgur.com/WsXiSZN.png)

Edit Profile Page             |  List all keys Page (admin only)
:-------------------------:|:-------------------------:
![](https://i.imgur.com/1XYuIJ8.png)  |  ![](https://i.imgur.com/u5xmVH4.png)

Create a key (admin only)             |  Edit a user (admin only)
:-------------------------:|:-------------------------:
![](https://i.imgur.com/4k7gJEy.png)  |  ![](https://i.imgur.com/tgDj2di.png)

News Page (user)             |  News Page (admin)
:-------------------------:|:-------------------------:
![](https://i.imgur.com/KgGYNdT.png)  |  ![](https://i.imgur.com/3ALTkEg.png)

New News Post (admin only)             |  Edit News Post (admin only)
:-------------------------:|:-------------------------:
![](https://i.imgur.com/Ft5CVDI.png)  |  ![](https://i.imgur.com/cI3utEb.png)
