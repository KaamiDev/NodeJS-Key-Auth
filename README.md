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
admin key. Use it to login and delete the default one for security reasons.
