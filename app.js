//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Blog",{useUnifiedTopology: true,useNewUrlParser: true});

const homeStartingContent = "If you’re like most bloggers, you spend a ton of time on your blog posts. Crafting the perfect headline. Writing that intro that grabs readers just right. And while your posts certainly are important…how much time does that leave to spend on your blog homepage? Or, maybe a better question – do you even have a WordPress blog homepage that’s not just a list of your most recent posts?";
const aboutContent = "Use this as a diary, use this as a journel its up to you, make your memories through it! :)";
const contactContent = "Contact? why do you need one?"
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post",postSchema);


app.get('/',function (req,res){
  Post.find({},function(err,blogs){
    if(!err){
      if(!blogs){
        res.render("home",{"homeStartingContent":homeStartingContent, "blog":[]});      
      }
      else{
        res.render("home",{"homeStartingContent":homeStartingContent, "blog":blogs});
      }
    }
  });
});

app.get('/about',function(req,res){
  res.render("about",{"aboutContent":aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{"contactContent":contactContent});
});

app.get("/post/:route",function(req,res){
  Post.findOne({_id:req.params.route},function(err,blogs){
    if(!err && blogs){
      res.render("post", {title: blogs.title,content: blogs.content});
    }
  });
});

app.get('/compose',function(req,res){
  res.render("compose");
});

app.post('/compose',function(req,res){
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});












app.listen(3000, function() {
  console.log("Server started on port 3000");
});
