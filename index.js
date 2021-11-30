const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();
app.use(bodyParser.json());

let topMarvelMovies = [
  {
    title: 'Spider-Man: Homecoming',
    director: 'Jon Watts',
    year: '2017'
  },
  {
    title: 'Iron Man',
    director: 'Jon Favreau',
    year: '2008'
  },
  {
    title: 'The Avengers',
    director: 'Joss Whedon',
    year: '2012'
  },
  {
    title: 'Captain America: The First Avenger',
    director: 'Joe Johnston',
    year: '2011'
  },
  {
    title: 'Doctor Strange',
    director: 'Scott Derrickson',
    year: '2016'
  },
  {
    title: 'Captain America: Civil War',
    director: 'Anthony Russo, Joe Russo',
    year: '2016'
  },
  {
    title: 'Black Panther',
    director: 'Ryan Coogler',
    year: '2018'
  },
  {
    title: 'Avengers: Infinity War',
    director: 'Anthony Russo, Joe Russo',
    year: '2018'
  },
  {
    title: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    year: '2019'
  },
  {
    title: 'Shang-Chi',
    director: 'Destin Daniel Cretton',
    year: '2021'
  }
];
// middleware functions
app.use(morgan('common'));
app.use(express.static('public'));
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
  res.json(topMarvelMovies);
});
// get movies by title
app.get('/movies/:title', (req, res) => {
  res.send('Sucessful Get Response, returning JSON data about single movie by title');
});
// get genre by title
app.get('/movies/title/:genre', (req, res) => {
  res.send('Sucessful Get Response, returning genre description by title');
});
// get director by name
app.get('/movies/director/:name', (req, res) => {
  res.send('Sucessful Get Response, returning director by name');
});
// Allow new users to register.
app.post('/newUser', (req, res) => {
  res.send('Sucessful Post Response, allowing new users to register');
});
// Allow users to update their user info (username)
app.put('/newUser/:username', (req, res) => {
  res.send('Sucessful Put Response, allowing username to update');
});
// Allow users to add movie to their list of favorites
app.post('/newUser/username/:favorites', (req, res) => {
  res.send('Sucessful Post Response, allowing user to add movie to favorites');
});
// Allow users to delete movie from their list of favorites
app.delete('/newUser/username/:favorites', (req, res) => {
  res.send('Sucessful Delete response, allowing user to delete movies from favorites');
});
// Allow users to deregister
app.delete('/newUser', (req, res) => {
  res.send('Sucessful Delete response, allowing user to deregister');
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
