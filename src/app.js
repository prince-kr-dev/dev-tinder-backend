const express = require("express");

const app = express();

app.use("/hello",(req, res)=>{
    res.send("Hello hello hello prince changed");
})

app.use("/test",(req, res)=>{
    res.send("Hello from the test server");
})

app.listen(3000, ()=>{
    console.log("Serverver is successfully listening port 3000...");  
})