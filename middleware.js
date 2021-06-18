const mongoose = require('mongoose');
const moment = require('moment');
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

module.exports.homeTeamNames = async (req, res, next) => {
	const games = await Game.find({ $or: [ { homeTeam: req.params.id }, { awayTeam: req.params.id } ] });
	const homeTeamNames = [];
	for (let game of games) {
		const homeTeamID = await Team.findById(game.homeTeam);
		const homeTeam = homeTeamID.populate().teamName;
		homeTeamNames.push(homeTeam);
	}
	res.locals.homeTeamNames = homeTeamNames;
	next();
};

module.exports.awayTeamNames = async (req, res, next) => {
	const games = await Game.find({ $or: [ { homeTeam: req.params.id }, { awayTeam: req.params.id } ] });
	const awayTeamNames = [];
	for (let game of games) {
		const awayTeamID = await Team.findById(game.awayTeam);
		const awayTeam = awayTeamID.populate().teamName;
		awayTeamNames.push(awayTeam);
	}
	res.locals.awayTeamNames = awayTeamNames;
	next();
};

module.exports.formatDates = async (req, res, next) => {
	const games = await Game.find({ $or: [ { homeTeam: req.params.id }, { awayTeam: req.params.id } ] });
	const formattedDates = [];
	for (game of games) {
		formattedDates.push(moment(game.date).format('MMM Do YY'));
	}
	res.locals.formattedDates = formattedDates;
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
	teamTotals.ops = (parseFloat(teamTotals.obp) + parseFloat(teamTotals.slg)).toFixed(3);
	res.locals.teamTotals = teamTotals;
	next();
};
