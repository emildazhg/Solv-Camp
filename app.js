const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
console.log(__dirname);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/books", (req, res) => {
  const books = [
    {
      name: "emilda",
      image:
        "https://1zl13gzmcsu3l9yq032yyf51-wpengine.netdna-ssl.com/wp-content/uploads/2017/06/Mahatma-Gandhi-quote-In-a-gentle-way-you-can-shake-the-world-1068x561.jpg"
    },
    {
      name: "indah",
      image:
        "https://fastertomaster.com/wp-content/uploads/2018/07/growth-mindset-quotes-audrey-hepburn.jpg"
    },
    {
      name: "wuhuuu",
      image:
        "https://www.goalcast.com/wp-content/uploads/2018/07/02_Charles_Bukowski_Quotes_Things_get_bad-1280x720.jpg"
    },
    {
      name: "wuhuuu",
      image:
        "https://www.goalcast.com/wp-content/uploads/2018/07/02_Charles_Bukowski_Quotes_Things_get_bad-1280x720.jpg"
    },
    {
      name: "wuhuuu",
      image:
        "https://www.goalcast.com/wp-content/uploads/2018/07/02_Charles_Bukowski_Quotes_Things_get_bad-1280x720.jpg"
    }
  ];

  res.render("books", { datas: books });
});

app.post("/books", (req, res) => {
  res.send("this is working");
});

app.get("/books/new", (req, res) => {
  res.render("bookForm.ejs");
});

app.listen(3000, () => console.log("Books Review App running in port 3000"));
