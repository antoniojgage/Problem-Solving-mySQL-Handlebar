let express = require("express");
let bodyParser = require("body-parser");

let app = express();
let PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "movieplannerdb"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// Use Handlebars to render the main index.html page with the todos in it.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM movies;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { movies: data });
    console.log("Running Index.html");
  });
});

app.post("/movies", function(req, res) {
  connection.query(
    "INSERT INTO movies (movies) VALUES (?)",
    [req.body.movies],
    function(err, result) {
      if (err) {
        return res.status(500).end();
      }
      console.log("Running /movies post");
      // res.json({ id: result.insertId }); // This Method calls the .get/movies route
      // res.send("/movies") // This method also works, why!?!?
      res.json({ id: result.insertId }); // This method works too with the https code included
    }
  );
});

app.get("/movies", function(req, res) {
  connection.query("SELECT * FROM movies;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
    res.render("index", { movies: data });
    console.log("Running /movie get");
  });
});

app.delete("/movies/:id", (req, res) => {
  connection.query("DELETE FROM movies WHERE id = ?",[req.params.id], function(err, result) {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      } else if (result.affectedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
    }
  );
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});