const express = require("express");
const server = express();

// setting up the server to show extra files
server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));

const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "docker",
  host: "localhost",
  port: "5432",
  database: "maratonadev"
});

// setting up the server
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true
});

server.get("/", (req, res) => {
  db.query(`SELECT * FROM donors`, (err, result) => {
    if (err) res.send("erro no db");

    const donors = result.rows;
    return res.render("index.html", { donors });
  });
});

server.post("/", (req, res) => {
  const { name, email, blood } = req.body;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatorios");
  }

  const query = `
  INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)
  `;

  const values = [name, email, blood];

  db.query(query, values),
    err => {
      if (err) return res.send("erro no db");
      return res.redirect("/");
    };
});

server.listen(3333);
