if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/scorecard';
const Player = require('./models/player');
const Team = require('./models/team');
const Game = require('./models/game');
const bodyParser = require('body-parser');

mongoose.connect(dbUrl, {
	useNewUrlParser    : true,
	useCreateIndex     : true,
	useUnifiedTopology : true,
	useFindAndModify   : false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Player Routes
app.get('/players', async (req, res) => {
	const players = await Player.find({});
	res.render('players/index', { players });
});

app.get('/players/new', async (req, res) => {
	const teams = await Team.find({});
	res.render('players/new', { teams });
});

app.post('/players', async (req, res) => {
	const player = new Player(req.body);
	const { firstName, lastName, teamName } = player;
	await player.save();
	res.redirect('/players');
});

// Team Routes
app.get('/teams', async (req, res) => {
	const teams = await Team.find({});
	res.render('teams/index', { teams });
});

app.get('/teams/new', (req, res) => {
	res.render('teams/new');
});

app.post('/teams', async (req, res) => {
	const team = new Team(req.body);
	const { name, manager } = team;
	await team.save();
	res.redirect('/teams');
});

app.get('/teams/:id/games/new', async (req, res) => {
	const teams = await Team.find({});
	const team = await Team.find({ _id: req.params.id }, { _id: 0, teamName: 1 });
	const teamName = team[0].teamName;
	res.render('games/new', { teamName, teams });
});

app.get('/teams/:id', async (req, res) => {
	const team = await Team.findById(req.params.id);
	const games = await Game.find({ $or: [ { homeTeam: team }, { awayTeam: team } ] });
	const players = await Player.find({ teamName: team });
	res.render('teams/show', { team, players, games });
});

// Game Routes
app.get('/games', async (req, res) => {
	const games = await Game.find({});
	res.render('games/index', { games });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});
