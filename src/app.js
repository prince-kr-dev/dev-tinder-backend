const express = require("express");

const app = express();

//This will only handle GET call to /user
// app.get("/user",(req, res)=>{
//     res.send({firstName: "Prince", lastName: "Kumar"});
// })


// app.post("/user",(req, res)=>{
//     res.send("Saving data to database");
// })

// app.delete("/user",(req, res)=>{
//     res.send("Deleted data successfully");
// })

//This will match all the HTTP method API calls to /test
// app.use(
//     "/test",
//     (req, res,next)=>{
//         // res.send("1st Response");
//         next();
//     },
//     (req, res)=>{
//         res.send("2nd Response");
//     }
// )




//Multiple route handler

// Handler 1
const handler1 = (req, res, next) => {
  console.log("Handler 1");
  next();
};

// Handler 2
const handler2 = (req, res, next) => {
  console.log("Handler 2");
  next();
};

// Handler 3
const handler3 = (req, res) => {
  console.log("Handler 3");
  res.send("Done");
};

// Apply all three to the same route
app.get("/test", handler1, handler2, handler3);

app.listen(3000, ()=>{
    console.log("Serverver is successfully listening port 3000...");  
})