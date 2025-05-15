const express = require('express');
const app = express();

// app.use("/test",(req, res) => {
//     res.send('Hello, Test!');
// })

let data = {
    firstname: "John",
    lastname: "Doe",
    age: 30,
    city: "New York"
};

// Route Query
app.get("/users",(req, res) => {
    console.log(req.query);
    res.send(data);
})

// Dynamic route
app.get("/user/:id",(req, res) => {
    console.log(req.params);
    res.send(data);
})

// Optional route name
// app.get("/ab?c",(req, res) => {
//     res.send(data);
// });
// app.get("/ab+c",(req, res) => {
//     res.send(data);
// })
// app.get("/a/",(req, res) => {
//     res.send("Its a regex route");
// })

app.post("/user",(req, res) => {
   // Saving data to DB
    console.log("Saving data to DB");
    
    res.send("Successfully saved data to DB");
});

app.delete("/user",(req, res) => {
   // Saving data to DB
    console.log("Deleting data from DB");
    
    res.send("Successfully deleted data from DB");
});

app.listen(3000, () => console.log('Server is running on port 3000'));