const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/productDB", {useNewUrlParser: true});

let nameItem = "";
let itemPrice = "";
let titleOfList = "";

//----------------------------Database Processor---------------------------------------------//

const listProcessor = new mongoose.Schema({
    name: String,
    core: Number,
    thread: Number,
    price: Number
});

const ListProcessor = mongoose.model("ListProcessor", listProcessor);

const pitem1 = new ListProcessor({
    name: "AMD Ryzen 5 3600",
    core: 6,
    thread: 12,
    price: 17100
});
const pitem2 = new ListProcessor({
    name: "AMD Ryzen 7 3700x",
    core: 8,
    thread: 16,
    price: 30000
})

const processorArray = [pitem1, pitem2];

//---------------------------------------Database Processor------------------------------------------//
//---------------------------------------Database Motherboard-----------------------------------------//

const listMotherboard = new mongoose.Schema({
    name: String,
    platform: String,
    price: Number
});

const ListMotherboard = mongoose.model("ListMotherboard", listMotherboard);

const mitem1 = new ListMotherboard({
    name: "MSI B450 Tomahawk Max",
    platform: "AM4",
    price: 11800
});
const mitem2 = new ListMotherboard({
    name: "Gigabyte X570 Aorus Ultra",
    platform: "AM4",
    price: 22000
})

const motherboardArray = [mitem1, mitem2];

//---------------------------------------Database Motherboard-----------------------------------------//
//server part and get post part start

app.get("/", function(req, res){
    if(titleOfList === "")
    {
        res.render("buildown", {namep: nameItem, pricep: itemPrice});
    }
    else{
        res.render("buildown", {namep: nameItem, pricep: itemPrice});
    }
});

app.post("/", function(req, res){
    const signal = req.body.choose;
    if(signal === "cpu")
    {
        ListProcessor.find({}, function(err, items){
            if(items.length === 0)
            {
                ListProcessor.insertMany(processorArray);
                res.redirect("/product");
            }
            else{
                res.redirect("/product");
            }
        });
        titleOfList = "Processor";
    }
    else if(signal === "mobo"){
        ListMotherboard.find({}, function(err, items){
            if(items.length === 0){
                ListMotherboard.insertMany(motherboardArray);
                res.redirect("/product");
            }
            else{
                res.redirect("/product");
            }
        });
        titleOfList = "Motherboard";
    }
});

app.get("/product", function(req, res){
    if(titleOfList === "Processor")
    {
        res.render("list", {listTitle: titleOfList, listOfProduct: processorArray});
    }
    else if(titleOfList === "Motherboard")
    {
        res.render("list", {listTitle: titleOfList, listOfProduct: motherboardArray});
    }
});
app.post("/product", function(req, res){
    if(titleOfList === "Processor"){
        nameItem = req.body.select;
        ListProcessor.find({ "name": nameItem }, function(err, items){
            if(err)
            {
                console.log("error");
            }
            else{
                itemPrice = items.price;
                // res.render("buildown", {name: nameItem, price: itemPrice});
                res.redirect("/");
            }
        });
    }
    else if(titleOfList === "Motherboard")
    {
        nameItem = req.body.select;
        ListMotherboard.find({ "name": nameItem }, function(err, items){
            if(err)
            {
                console.log("error");
            }
            else{
                itemPrice = items.price;
                // res.render("buildown", {name: nameItem, price: itemPrice});
                res.redirect("/");
            }
        });
    }
    
});

app.listen(3000, function(){
    console.log("Server Up and Running");
});

//Get Post part end