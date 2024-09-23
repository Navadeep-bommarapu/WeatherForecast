import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import ejs, { name } from "ejs";
import { appendFileSync } from "fs";
import axios from "axios";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));  

app.use(bodyParser.urlencoded({extended:true}));

app.use((req, res, next)=>{
    console.log("required method " + req.method);
    console.log("required url " + req.url);
    next();
});


const yourApiKey = "7d40bf8fa0ee213e770d12b56aaf5b65";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";


app.get("/", async (req,res)=>{
    try{ 
        
        res.render("index.ejs");
    }catch(error){
        res.status(404).send(error.message)
    }
});


app.post("/file", async (req, res)=>{
    try{
        const city = req.body["city"];
        const response = await axios.post(API_URL + `?q=${city}&appid=${yourApiKey}&units=metric`);
        const result = response.data;
        const contents = result.main.temp;
        const long = result.coord.lon;
        const lat = result.coord.lat;
        
        res.render("file.ejs", 
            {
                content : contents,
                cityName : city,
                coordinates : lat + " " + long,
            }
        ); 
    }catch(error){
        res.status().send("file.ejs is not working");
    }
     
});



app.listen(port, ()=>{
    console.log(`your server is running in port ${port}`);
});
