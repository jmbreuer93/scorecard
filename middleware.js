const mongoose = require('mongoose');
const Player = require('./models/player');
const Team = require('./models/team');
const Game = require('./models/game');

module.exports.getPlayers = async (req, res, next) => {
	const players = await Player.find({});
	res.locals.players = players;
	next();
};

module.exports.getTeams = async (req, res, next) => {
	const teams = await Team.find({});
	res.locals.teams = teams;
	next();
};

module.exports.getTeam = async (req, res, next) => {
	const team = await Team.findById(req.params.id);
	res.locals.team = team;
	next();
};

module.exports.homeTeamName = async (req, res, next) => {
	const game = req.game;
	const team = await Game.findById({ _id: req.game }, { _id: 0, homeTeam: 1, awayTeam: 1 });
	const homeTeamName = team.teamName;
	res.locals.homeTeamName = homeTeamName;
	next();
};

module.exports.awayTeamName = async (req, res, next) => {
	const team = await Team.findById(req.params.id);
	const games = await Game.find({ $or: [ { homeTeam: team }, { awayTeam: team } ] });
	await games.map(async (game) => {
		const awayTeamName = game.awayTeam.teamName;
	});
	next();
};
