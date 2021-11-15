const express = require("express");
const mysql = require("mysql");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const ejs = require("ejs");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "node_crud",
  });
  con.connect(function (error) {
    if (!!error) {
      console.log(error);
    } else {
      console.log("database connected");
    }
  });

app.get("/", (req, res, next) => {
    let sql = "Select * from users";
    con.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      console.log("hi middleware");
      res.render("user_show", {
        title: "crued in ejs",
        users: rows,
      });
    });
  });

  app.get("/add-user", (req, res, next) => {
    console.log("hi middleware");
    res.render("user_add", {
      title: "insert operation",
    });
  });
  app.post("/save", (req, res, next) => {
    console.log(req.body);
    let data = {
      name: req.body.name,
      email: req.body.email,
      phone_no: req.body.phone,
    };
    let sql = `insert into users SET ?`;
    let query = con.query(sql, data, (err, results) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/");
      }
    });
  });

  app.post("/update", (req, res, next) => {
    let userId=req.body.id;
    let sql = "update users SET name= '"+req.body.name+"', email= '"+req.body.email+"',phone_no= '"+req.body.phone+"' where id = "+ userId;
    let query = con.query(sql, (err, results) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/");
      }
    });
  });
  app.get("/edit/:userId", (req, res) => {
    const userId = req.params.userId;
    let sql = `select * from users where id = ${userId}`;
    let query = con.query(sql, (err, result) => {
      if(err){
        throw err;
      }
      res.render('user_edit',{
        title:'crud operation',
        user:result[0]
      })
    });
  });
  app.get("/delete/:userId", (req, res) => {
    const userId = req.params.userId;
    let sql = `delete from users where id = ${userId}`;
    let query = con.query(sql, (err, result) => {
      if(err){
        throw err;
      }
      res.redirect('/');
    });
  });

app.listen(3000, () => {
    console.log("hi server is up running on 3000");
  });
  