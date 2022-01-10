const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const uuid = require('uuid');
const app = express();

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB',
mongoose.connect(process.env.CONNECTION_URI,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const cors = require('cors');
app.use(cors());
// middleware functions
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');
// get defaul textual response
app.get('/', (req, res) => {
  res.send('Welcome to my top 10 Marvel Movies App!');
});
// get documentation html in public folder from express.static
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});
// get movies json
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }),  (req, res) => {
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
app.get('/movies/genres/:Name', passport.authenticate('jwt', {session: false}),  (req, res) => {
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
app.get('/movies/director/:Name', passport.authenticate('jwt', {session: false}),  (req, res) => {
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
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
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
app.post('/users',[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
// Allow users to update their user info (username)
app.put('/users/:Username', passport.authenticate('jwt', { session: false}),  (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set: {
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
app.post('/users/:Username/favorites/:movieID', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.delete('/users/:Username/favorites/:movieID', passport.authenticate('jwt', { session: false}),  (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.movieID}
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
// Allow users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.')
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
