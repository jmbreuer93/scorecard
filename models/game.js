const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Player = require('./player');
const Team = require('./team');

const GameSchema = new Schema({
	homeTeam : {
		type     : Schema.Types.ObjectId,
		ref      : 'Team',
		required : true
	},
	awayTeam : {
		type     : Schema.Types.ObjectId,
		ref      : 'Team',
		required : true
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
