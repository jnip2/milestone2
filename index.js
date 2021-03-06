const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();

const fs = require("fs").promises;

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("createcard");
});


//THIS CREATES USER IN DATABASE
app.post("/create", (req, res) => {
  const user = req.body;
  user.id = (Math.floor(Math.random() * 600) + 1).toString();

  fs.readFile(`${__dirname}/database.json`, "utf-8")
    .then((data) => JSON.parse(data))
    .then((jsonObj) => {
      jsonObj.users.push(user);
      return jsonObj;
    })
    .then((content) => fs.writeFile(`${__dirname}/database.json`, JSON.stringify(content, null, '\t')))
    .then(() => res.redirect(`/people/${user.id}`))
    .catch((err) => console.log(err));
});

app.get("/people/:id", (req, res) => {
  const userID = req.params.id;

  fs.readFile(`${__dirname}/database.json`, "utf-8")
    .then((data) => JSON.parse(data).users)
    .then((users) => users.find((obj) => {
      if (obj.id === userID) {
        console.log("user found :-)");
        return obj;
      } else {
        console.log("user doesn't exist");
      }
    }))
    .then((user) => res.render("homepage", { user }))
    .catch((err) => console.log(err));
});

app.get("/:id/photos", (req, res) => {

});

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});