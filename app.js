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
const { getPlayers, getTeams, getTeam, homeTeamName, awayTeamName } = require('./middleware');
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
app.get('/players', getPlayers, async (req, res) => {
	res.render('players/index');
});

app.get('/players/new', getTeams, async (req, res) => {
	res.render('players/new');
});

app.post('/players', async (req, res) => {
	const player = new Player(req.body);
	const { firstName, lastName, teamName } = player;
	await player.save();
	res.redirect('/players');
});

// Team Routes
app.get('/teams', getTeams, async (req, res) => {
	res.render('teams/index');
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

app.get('/teams/:id/games/new', getTeams, async (req, res) => {
	const team = await Team.find({ _id: req.params.id }, { _id: 1, teamName: 1 });
	const players = await Player.find({ teamName: req.params.id });
	const teamName = team[0].teamName;
	res.render('games/new', { teamName, team, players });
});

app.post('/teams/:id/games', async (req, res) => {
	const numPlayers = req.body.player.length;
	for (let i = 0; i < numPlayers; i++) {
		const player = req.body.player[i];
		const foundPlayer = await Player.findById(player);
		foundPlayer.atBats += req.body.atBats[i];
		foundPlayer.runs += req.body.runs[i];
		foundPlayer.hits += req.body.hits[i];
		foundPlayer.rbi += req.body.rbi[i];
		foundPlayer.single += req.body.single[i];
		foundPlayer.double += req.body.double[i];
		foundPlayer.triple += req.body.triple[i];
		foundPlayer.homeRun += req.body.homeRun[i];
		foundPlayer.strikeouts += req.body.strikeout[i];
		foundPlayer.walks += req.body.walk[i];
		console.log(foundPlayer);
	}
	const team = await Team.findById(req.params.id);
	const game = new Game(req.body);
	await game.save();
	res.redirect(`/teams/${team._id}`);
});

app.get('/teams/:id', getTeam, async (req, res) => {
	const games = await Game.find({ $or: [ { homeTeam: res.locals.team }, { awayTeam: res.locals.team } ] });
	const players = await Player.find({ teamName: res.locals.team }).sort({ battingAverage: 'desc' });
	res.render('teams/show', { players, games });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});
