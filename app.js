const express = require("express");
const app = express();
const port = 3000;

require("dotenv").config();
const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_SCHEME,
  dateStrings: "date",
});
console.log("connected to mysql db");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

// 라우터
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});
app.get("/map", (req, res) => {
  res.render("map");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.post("/contactProc", (req, res) => {
  const user_name = req.body.name;
  const user_phone = req.body.phone;
  const user_email = req.body.email;
  const user_memo = req.body.memo;
  //console.log(user_name);
  let sql = `insert into contact(name,phone,email,memo,regdate) values ('${user_name}','${user_phone}', '${user_email}', '${user_memo}', DATE_FORMAT(now(), '%y/%m/%d'))`;
  conn.query(sql, (error, result) => {
    if (error) throw error;
    console.log("1 rows inserted");
    res.send(
      "<script>alert('문의사항이 등록되었습니다'); location.href='/';</script>"
    );
  });

  // conn.end();
  // let message = `${user_name}, ${user_phone}, ${user_email}, ${user_memo}`;

  // res.send(message);
});

// 관리자용 | 외부노출 x | 문의내용 확인
app.get("/contactList", (req, res) => {
  let sql = `select * from contact order by idx desc`;
  conn.query(sql, (error, result, fields) => {
    if (error) throw error;
    //console.log(result);
    res.render("contactList", { lists: result });
  });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
