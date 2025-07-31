const express = require("express");

const app = express();

//This will only handle GET call to /user
app.get("/user",(req, res)=>{
    res.send({firstName: "Prince", lastName: "Kumar"});
})


app.post("/user",(req, res)=>{
    res.send("Saving data to database");
})

app.delete("/user",(req, res)=>{
    res.send("Deleted data successfully");
})

//This will match all the HTTP method API calls to /test
app.use("/test",(req, res)=>{
    res.send("Hello from the test server");
})

app.listen(3000, ()=>{
    console.log("Serverver is successfully listening port 3000...");  
})