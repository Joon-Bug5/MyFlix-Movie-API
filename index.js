const express = require('express');
  morgan = require('morgan');

const app = express();

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
// log all application error to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There is an error!');
});
// listening to port
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
