
//require modules
const ejs = require("ejs");
const uuid = require("uuid");
const session = require("express-session");
const fs = require('fs');
const sqlite3 = require("sqlite3");
const isImageUrl = require("is-image-url");
const moment = require("moment");
var dbFile = "./database.db"
var exists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);

//main function
module.exports = function authController(app) {
    //session setup information
    app.use(session({cookie: { path: '/', httpOnly: true, maxAge: null}, secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

    //create db table if not exists
    db.serialize(function() {
        if(!exists) {
            db.run('CREATE TABLE Keys (name TEXT, key TEXT, rank INTEGER, pfp TEXT)');
            db.run('CREATE TABLE News (title TEXT, post TEXT, author TEXT, authpfp TEXT, date TEXT)');
            db.run(`INSERT INTO Keys VALUES("default user", "fc6b4343-d567-43d2-b3fd-24111766af54", 5, "https://i.imgur.com/LnUCAme.png")`);
        }
        else {
            console.log("Database ready to go!");
        }
    
    });

    //define session variable
    var sess;
    
    //get request made to "/"
    app.get("/", (req, res) => {
        sess = req.session;
        //takes to "/home" if already signed in
        if(sess.key) {
            return res.redirect('/home');
        }
        //takes to login page if not signed in
        res.render("index", {status: req.query.status});
    });
    //post request is made to "/"
    app.post("/", (req, res) => {
        sess = req.session;
        //checks if entered key exists in database
        db.all(`SELECT * FROM Keys WHERE key="${req.body.key}"`, function (err, rows) {
            if (rows.length !== 0) {
               //if key exists, sets session info and redirects to "/home" 
                sess.key = req.body.key;
                sess.name = rows[0].name;
                sess.pfp = rows[0].pfp;
                sess.rank = rows[0].rank;
                res.redirect("/home")
            }
            else {
                //if key doesn't exist, gives "invalid key" message
                if (!sess.key) res.redirect("/?status=invalidkey");
            }
        });
    });

    //get request is made to "/home"
    app.get("/home", (req, res) => {
        sess = req.session;
        //checks if signed in
        if(sess.key) {
            //renders homepage if signed in
            res.render("home", {name: sess.name, pfp: sess.pfp, userrank: sess.rank});
        }
        else {
            //sends "please sign in first" message
            res.send('You do not have permission to view this page. <br> Please <a href="/">login</a> with a key first.');
        }
    });

    //get request is made to "/logout"
    app.get("/logout", (req, res) => {
        //destroys session
        req.session.destroy();
        //redirects back to login page
        res.redirect('/');
    });

    //get request is made to "/createkey"
    app.get("/createkey", (req, res) => {
        sess = req.session;
        //checks if admin
        if(sess.rank === 5) {
            //renders createkey page if admin
            res.render("createkey", {userrank: sess.rank});
        }
        else {
            //sends "you do not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //post request is made to "/createkey"
    app.post("/createkey", (req, res) => {
        sess = req.session;
        //checks if admin
        if(sess.rank === 5) {
            //creates "newKey" object if admin
            const newKey = {
                key: uuid.v4(),
                name: req.body.name,
                rank: req.body.rank,
                pfp: "https://i.imgur.com/LnUCAme.png"
            }
            //saves newKey object to database
            db.run(`INSERT INTO Keys VALUES("${newKey.name}", "${newKey.key}", ${newKey.rank}, "${newKey.pfp}")`, function(err) {
                if (err) throw err;
                //renders success page with newKey information
                res.render("createkeysuccess", {key: newKey.key, name: newKey.name, rank: newKey.rank, userrank: sess.rank});
            })
        }
        else {
            //sends "you do not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //get request is made to "listkeys"
    app.get("/listkeys", (req, res) => {
        sess = req.session;
        //checks if admin
        if(sess.rank === 5) {
            //gets keys from database if admin
        db.all(`SELECT * FROM Keys`, function (err, rows) {
            //renders page with keys
        res.render("listkeys", {data: rows, status: req.query.status, userrank: sess.rank})
        });
        }
        else {
            //sends "do not have permission" if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //post request is made to delete a key
    app.post("/listkeysdl", (req, res) => {
        sess = req.session;
        //checks if admin
        if(sess.rank === 5) {
            //deletes key if admin
        db.run(`DELETE FROM Keys WHERE key="${req.body.idkey}"`, function(err) {
            //redirects to success page
            res.redirect("/listkeys?status=success");
        });
        }
        else {
            //sends "do not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //post request is made to change name (admin)
    app.post("/listkeysch", (req, res) => {
        sess = req.session;
        //checks if admin
        if(sess.rank === 5) {
            //changes name if admin
        db.run(`UPDATE Keys SET name="${req.body.newname}" WHERE key="${req.body.oldname}"`, function(err) {
            //redirects to success page
            res.redirect("/listkeys?status=success");
        });
        }
        else {
            //sends "do not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //post request is made to change rank
    app.post("/listkeysrk", (req, res) => {
        sess = req.session;
        //checks if admin
        if(sess.rank === 5) {
            //changes rank if admin
        db.run(`UPDATE Keys SET rank="${req.body.rankselect}" WHERE key="${req.body.keytoupdate}"`, function(err) {
            //redirects to success page
            res.redirect("/listkeys?status=success");
        });
        }
        else {
            //sends "do not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //get request is made to "/editprofile"
    app.get("/editprofile", (req, res) => {
        sess = req.session;
        //checks if signed in
        if(sess.key) {
            //renders edit profile page if signed in
        res.render("editprofile", {status: req.query.status, userrank: sess.rank, name: sess.name, pfp: sess.pfp, key: sess.key})
        }
        else {
            //sends "please sign in first" message if not signed in
            res.send('You do not have permission to view this page. <br> Please <a href="/">login</a> with a key first.');
        }
    });

    //post request is name to change name (user)
    app.post("/editprofilenm", (req, res) => {
        sess = req.session;
        //checks if signed in
        if(sess.key) {
            //changes name if signed in
        db.run(`UPDATE Keys SET name="${req.body.newname}" WHERE key="${req.body.keytochange}"`, function(err) {
            sess.name = req.body.newname
            //redirects to success page
            res.redirect("/editprofile?status=success");
        });
        }
        else {
            //sends "please sign in first" message if not signed in
            res.send('You do not have permission to view this page. <br> Please <a href="/">login</a> with a key first.');
        }
    });

    //post request is made to edit profile picture
    app.post("/editprofilepfp", (req, res) => {
        sess = req.session;
        //checks if signed in
        if(sess.key) {
            //checks if provided link is a image
            if(isImageUrl(req.body.newpfp) === true) {
                //updates profile picture if provided link is a image
        db.run(`UPDATE Keys SET pfp="${req.body.newpfp}" WHERE key="${req.body.keytochange}"`, function(err) {
            sess.pfp = req.body.newpfp
            //redurects to success page
            res.redirect("/editprofile?status=success");
        });
    }   else {
        //changes profile picture back to default if not an image
        db.run(`UPDATE Keys SET pfp="https://i.imgur.com/LnUCAme.png" WHERE key="${req.body.keytochange}"`, function(err) {
            sess.pfp = "https://i.imgur.com/LnUCAme.png"
            //redirects to error message if not an image
            res.redirect("/editprofile?status=errorpfp");
        });
    }
        }
        else {
            //sends "please sign in first" message if not signed in
            res.send('You do not have permission to view this page. <br> Please <a href="/">login</a> with a key first.');
        }
    });

    //get request is made to "/newsfeed"
    app.get("/newsfeed", (req, res) => {
        //checks if signed in
        if(sess.key) {
            //fetches news posts from database if signed in
            db.all(`SELECT rowid, * FROM News ORDER BY rowid DESC`, function (err, rows) {
                //renders newsfeed page displaying news posts
                res.render("newsfeed", {data: rows, status: req.query.status, userrank: sess.rank})
            });
        }
        else{
            //sends "Please sign in first" message if not signed in
            res.send('You do not have permission to view this page. <br> Please <a href="/">login</a> with a key first.');
        }
    });

    //post request is made to create a news post
    app.post("/newsfeedcp", (req, res) => {
        //checks if admin
        if(sess.rank === 5) {
            //creates newPost object if admin
            const newPost = {
                title: req.body.posttitle,
                post: req.body.postcontent,
                author: sess.name,
                authpfp: sess.pfp,
                date: moment().format()
            }
            //inserts newPost object to database
            db.run(`INSERT INTO News VALUES("${newPost.title}", "${newPost.post}", "${newPost.author}", "${newPost.authpfp}", "${newPost.date}")`, function(err) {
                if (err) throw err;
                //redirets to success page
                res.redirect("/newsfeed?status=postsuccess");
            })
        }
        else{
            //sends "not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //post request is made to delete a news post
    app.post("/newsfeeddp", (req, res) => {
        //checks if admin
        if(sess.rank === 5) {
            //deletes post from database if admin
            db.run(`DELETE FROM News WHERE rowid="${req.body.idtodelete}"`, function(err) {
                if (err) throw err;
                //redirects to success page
                res.redirect("/newsfeed?status=delsuccess");
            });
        }
        else{
            //sends "do not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });

    //post request is made to edit a post
    app.post("/newsfeedep", (req, res) => {
        //checks if admin
        if(sess.rank === 5) {
            //updates post in database with edited post if admin
            db.run(`UPDATE News SET post="${req.body.updatedpost}" WHERE rowid="${req.body.idtochange}"`, function(err) {
                //redirects to success page
                res.redirect("/newsfeed?status=editsuccess");
            });
        }
        else{
            //sends "do not have permission" message if not admin
            res.send('You do not have permission to view this page.');
        }
    });
}