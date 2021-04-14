var path = require("path");
var express = require("express");
var hbs = require("express-handlebars");
var bodyParser = require("body-parser");
var router = require("./router");
var app = express();

var help = {
    compare:function(a,b,options){
        if(a == b){
            return options.fn(this);        
            }else{
            return options.inverse(this);
            }
    }
}

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.engine('.hbs', hbs({
    extname: ".hbs",
    defaultLayout: 'default',
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + '/views/partials/',
    helpers: help
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", router);

// app.use(express.static(__dirname + "/public"));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/config', express.static(path.join(__dirname, 'config')));

app.listen(8898, () => {
    console.log("server starts on http://localhost:8898");
});