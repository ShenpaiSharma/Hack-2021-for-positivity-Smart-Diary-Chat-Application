//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const homeStartingContent = "I am a very lively guy, who was working as the junior software engineer at a startup. It was all going good until covid arrived with all its disasters. I do not have a job now to support my life, and I really miss those days of college, when the education and grades were sufficient, and man, football, football was love.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb+srv://admin-agp:17JE003089@cluster0.8vdgl.mongodb.net/diaryDB", {useNewUrlParser: true});
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

var dep = 9;

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  //res.render("partials/header", {depression: dep});
  console.log(dep);
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      depression: dep
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/feed", function(req,res){
  const query = "market";
  const appid = "b45ead8dad96467ca3ac9d2e6865d773";
  const category = "business";
  //const url = "https://sv443.net/jokeapi/v2/joke/Programming,Dark?blacklistFlags=;
  const url = "https://newsapi.org/v2/top-headlines?category=" + category + "&q=" + query + "&apiKey=" + appid;
  //const url = "https://newsapi.org/v2/top-headlines?category=" + category + "&apiKey=" + appid;
  
  fetch(url).then((response)=>{
    return response.json()
  }).then((data)=>{
    //console.log(data);
    let arr = data.articles;
    for(let i =0;i<arr.length;i++)
    {
      const title1 = data.articles[i].title;
      const descr1 = data.articles[i].description;
      const imageUrl1 = data.articles[i].urlToImage;
      const newslink1 = data.articles[i].url;
      res.write("<h1>" + title1 + "</h1>");
      res.write("<p>" + descr1 + "</p>");
      res.write("<img src = " + imageUrl1 + ">");
      res.write("<p><a href = " + newslink1 + ">For more Info click here...</a></p>");
    }
    res.send();

  });
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});


//b45ead8dad96467ca3ac9d2e6865d773
//d02524c1b766fba31880d92266f3fdd3
