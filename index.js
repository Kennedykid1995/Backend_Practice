const express = require("express"); 
const cors = require("cors"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const db = require("./database/dbConfig");

const server = express(); 

server.use(express.json()); 
server.unsubscribe(cors()); 

const secret = "one two three";
//section below is for new users. 
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
    db("users")
        .insert(creds)
        .then(ids=>{
            const id = ids[0];
            db("users")
                .where({id})
                .first()
                .then(user => {
                    const token = generateToken(user);
                    res.status(201).json({id: user.id, token});
                })
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err)); 
})

server.post("/api/login", (req, res)=>{
    const creds = req.body; 

    db("users")
        .where({username: creds.username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)){
                const token = generateToken(user); 
                res.status(200).json({token});
            }else{
                res.status(401).json({message: "Not a match try again"}); 
            }
        })
        .catch(err => res.status(500).send(err));
});

server.get("/api/users", (req, res) => {
    db("users")
    .select("id", "username", "password")
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err)); 
})

server.get("/api/notes", (req, res) => {
    db("notes")
    .select("id", "title", "description")
    .then(notes => {
        res.json(notes); 
    })
    .catch(err => res.send(err)); 
})

server.post("/api/make_note", (req, res) => {
    const note = req.body; 
    db("notes")
    .insert(note)
    .then(ids => {
        const id = ids[0];
        db("notes")
            .where({id})
            .first()
            .then(note => {
                res.status(201).json({id: note.id});
            })
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
})



server.get("/", (req, res)=> {
    res.send("Working");
});

server.listen(3200, () => console.log("\n Server 3200 is Running \n"));