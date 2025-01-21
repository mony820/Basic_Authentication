import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "12345678",
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try{
  const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
  if (result.rows.length > 0) {
    //return res.redirect("/login");
    res.send("User already exists");
  }
  else{
    await db.query(
      `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`
    );
    res.redirect("/login");
  }
}catch(err){
  res.render(err);
}
  });

  

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try{
    const result = await db.query(`select * from users where email = '${email}'`)
    //const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if(result.rows.length>0){
      const user = result.rows[0];
      console.log(user);
      const storedPassword = user.password;
      if(storedPassword === password)
        {
        res.render("secrets.ejs");}
        else{
          res.send("Wrong Password");
        }
    }
    else {
      res.send("You are not resistered yet");
    }
  }catch(err){
    console.log(err)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
