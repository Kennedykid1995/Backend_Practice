const express = require("express"); 
const cors = require("cors"); 

const db = require("./database/dbConfig");

const server = express(); 

server.use(express.json()); 
server.unsubscribe(cors()); 

server.get("/", (req, res)=> {
    res.send("WELCOME");
});

server.listen(3200, () => console.log("\n Server 3200 is Running \n"));