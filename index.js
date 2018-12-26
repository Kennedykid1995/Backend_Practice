const express = require("express"); 
const cors = require("cors"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const db = require("./database/dbConfig");

const server = express(); 

server.use(express.json()); 
server.unsubscribe(cors()); 

const secret = "onetwothree";

//you will need to generate a token for the new user. 
//that is registered. This is for security. 
function generateToken(user){
    const payload = {
        username: user.username
    };
    const options = {
        expiresIn: "1h",
        jwtid: "12345",
    }; 
    return jwt.sign(payload, secret, options); 
}
//creating a new user. 
//post is for adding a user/element to the api.
server.post("/api/register", (req, res)=>{
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10); 
    creds.password = hash; 
    db("user")
        .insert(creds)
        .then(ids=>{
            const id = ids[0];
            db("user")
                .where({id})
                .first()
                .then(user => {
                    const token = generateToken(user);
                    res.status(201).json({id: user.id, token});
                })
                .catch(err => res.status(500).send(err));
        })
        .catch(er => res.status(500).send(err)); 
})

server.get("/", (req, res)=> {
    res.send("Working");
});

server.listen(3200, () => console.log("\n Server 3200 is Running \n"));