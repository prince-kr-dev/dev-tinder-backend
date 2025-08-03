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
            
            
            
            
            // //Multiple route handler
            
            // // Handler 1
            // const handler1 = (req, res, next) => {
                //   console.log("Handler 1");
                //   next();
                // };
                
                // // Handler 2
                // const handler2 = (req, res, next) => {
                    //   console.log("Handler 2");
                    //   next();
                    // };
                    
                    // // Handler 3
                    // const handler3 = (req, res) => {
                        //   console.log("Handler 3");
                        //   res.send("Done");
// };

const { adminAuth } = require("./middlewares/auth");
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req,res)=>{
    try {
        res.send("User data sent")   
     throw new Error("Error");
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
})


app.get("/admin/deleteUser", (req,res)=>{
    res.send("Deleted a user");
});

//Error handling
app.use((err, req, res, next) => {
  if(err){
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, ()=>{
    console.log("Serverver is successfully listening port 3000...");  
})