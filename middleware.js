const mongoose = require('mongoose');
const Player = require('./models/player');
const Team = require('./models/team');
const Game = require('./models/game');

module.exports.getPlayers = async (req, res, next) => {
	const players = await Player.find({}).sort({ battingAverage: 'desc' });
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

module.exports.teamTotals = async (req, res, next) => {
	const teamTotals = {
		atBats     : 0,
		runs       : 0,
		hits       : 0,
		rbi        : 0,
		single     : 0,
		double     : 0,
		triple     : 0,
		homeRun    : 0,
		xbh        : 0,
		strikeouts : 0,
		walks      : 0
	};
	const players = await Player.find({ teamName: req.params.id });
	players.forEach((player) => Object.keys(teamTotals).forEach((key) => (teamTotals[key] += player[key])));
	teamTotals.avg = (teamTotals.hits / teamTotals.atBats).toFixed(3);
	teamTotals.obp = ((teamTotals.hits + teamTotals.walks) / (teamTotals.atBats + teamTotals.walks)).toFixed(3);
	teamTotals.slg = ((teamTotals.single * 1 + teamTotals.double * 2 + teamTotals.triple * 3 + teamTotals.homeRun * 4) /
		teamTotals.atBats).toFixed(3);
	teamTotals.ops = teamTotals.obp + teamTotals.slg;
	res.locals.teamTotals = teamTotals;
	next();
};
