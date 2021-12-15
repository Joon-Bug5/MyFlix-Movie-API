const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const uuid = require('uuid');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// middleware functions
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// get defaul textual response
app.get('/', (req, res) => {
  res.send('Welcome to my top 10 Marvel Movies App!');
});
// get documentation html in public folder from express.static
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});
// get movies json
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// get movies by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// get genre by title
app.get('/movies/genres/:Name', (req, res) => {
  Movies.find({ 'Genre.Name' : req.params.Name})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// get director by name, ryan cogler, joseph russo, jon watts, 61b1130d03ab8873803f93e1
app.get('/movies/director/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name' : req.params.Name})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// Get all Users.
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// Allow new users to register.
app.post('/newUser', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) =>{
        res.status(201).json(user)
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + error);
  });
});
// Allow users to update their user info (username)
app.put('/newUser/:username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
// Allow users to add movie to their list of favorites
app.post('/newUser/username/:favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: {FavoriteMovies: req.params.movieID}
  },
  {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
// Allow users to delete movie from their list of favorites
app.delete('/newUser/username/:favorites', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $pull: { FavoriteMovies: req.params.movieID}
  },
  {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.jsone(updatedUser);
    }
  });
});
// Allow users to deregister
app.delete('/newUser', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) => {
    if (!user) {
      res.status(400).send(Req.params.Username + ' was not found');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// log all application error to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There is an error!');
});
// listening to port
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
