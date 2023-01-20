//setup
const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require('dotenv').config(); 
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json())

//home route
app.get('/', (req, res) => {
  res.json({"message": "API Listening"});
});

//get all movies
app.post("/api/movies", (req, res) => {
    res.status(201).json(db.addNewMovie(req.body));
  });

//get all movies while specifying pages and title
app.get("/api/movies", (req,res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        res.status(400).json({"message": "bad request"});
    });
  });

//get movie with a specific id
app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id)
    .then((movie) => {
      movie ? res.status(200).json(movie) : res.status(404).json({"message": "Resource not found"});
    })
    .catch((err) => {
      res.status(500).json({"message": "Server internal error"});
    });
  });

//edit a movie
app.put("/api/movies/:id", (req, res) => {

    if (req.body.id && req.params.id != req.body.id ) { 
      res.status(400).json({"message": "IDs do not match"});
    }
    else {
      let movie = db.updateMovieById(req.body, req.params.id);
      movie ? res.json(movie) : res.status(404).json({"message": "Resource not found"});
    }
    
});

//delete a movie
app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id);
    res.status(204).end();
});

//initializes database and server
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});