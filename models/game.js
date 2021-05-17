const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Player = require('./player');
const Team = require('./team');

const GameSchema = new Schema({
	homeTeam : {
		type : Schema.Types.ObjectId,
		ref  : 'Team'
	},
	awayTeam : {
		type : Schema.Types.ObjectId,
		ref  : 'Team'
	},
	date     : {
		type     : Date,
		required : true
	},
	time     : {
		type     : Date,
		required : true
	}
});

module.exports = mongoose.model('Game', GameSchema);
