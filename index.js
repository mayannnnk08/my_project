const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const Listing = require("./models/schema");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WonderLust');};

main().then(()=>{
        console.log("connected to DB");
     }).catch(
        (err)=>{    
            console.log(err);
        }
      );


 

app.listen(port, ()=>{
    console.log(`app is listening to port: ${port}`)
});

//HOME ROUTE
app.get("/listings", async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/home.ejs", {allListings});
});

// ADD ROUTE
app.get("/listing/new", (req,res)=>{
  try{
    res.render("./listings/add.ejs")
  }catch(err){
    console.log(err);
  }
    
});

app.post("/listing", async (req,res)=>{
    let listing = req.body;
    let newlisting = new Listing(listing);
    await newlisting.save()
    res.redirect("/listings");
});





// SHOW ROUTE
app.get("/listings/:id", async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});

// EDIT ROUTE
app.get("/listings/:id/edit",async (req,res)=>{
     let { id } = req.params;
   let listing = await Listing.findById(id);
   res.render("./listings/edit.ejs", { listing });
});
//UPDATE ROUTE
app.put("/listings/:id", async (req,res)=>{
    let { id } = req.params;
   await Listing.findByIdAndUpdate(id, req.body);
    res.redirect("/listings");   
})
// DELETE ROUTE
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});




























// app.get("/testlisting", async (req,res)=>{
//     let listing1 = new Listing({
//         title: "my home",
//         description: "a pleasant place to stay",
//         price: 1200,
//         location: "Meerut",
//         country: "India"
//     });
//     await listing1.save();
//     console.log(listing1);
//     res.send("saved")
// });