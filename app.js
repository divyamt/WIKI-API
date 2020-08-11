const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false});

const wikiSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model("Article",wikiSchema);


/////Together routing////////////////////////////////////


app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,found){
    if(!err){
      res.send(found);
    }
    else{
      res.send(err);
    }

  });
})

.post(function(req,res){

  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.")
    }
    else{
      res.send(err)
    }
  });
}).delete(function(req,res){
  Article.deleteMany({},function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Successfully deleted all articles");
    }
  });
});


//////////seperate routing///////////////////////////////

app.route("/articles/:articleTitle")
.get(function (req,res){
  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No articles matching this title was found");
    }
  });
})
.put(function(req,res){
  Article.update({title:req.params.articleTitle},
    {title:req.body.title,
    content:req.body.content},
  {overwrite:true},function(err){
    if(!err){
      {res.send("Successfully updated");}
    }
  });
})
.patch(function(req,res){
  Article.update({title:req.params.articleTitle},
                  {$set:req.body},
                function(err){
                  if(!err){
                    res.send("Successfully patched!");
                  }
                  else{
                    res.send("err");
              }
          }
    );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},
  function(err){
    if(!err){
      res.send("Successfully deleted!");
    }
    else{
      res.send(err);
    }
  });
});




app.listen("3000", function(err){
    if(!err){
      console.log("Server started successfully on port 3000");
    }
});
