const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Player = require('./player');
const Game = require('./game');

const TeamSchema = new Schema({
	name    : {
		type     : String,
		required : true
	},
	manager : {
		type     : String,
		required : true
	},
	players : [
		{
			type : Schema.Types.ObjectId,
			ref  : 'Player'
		}
	],
	wins    : {
		type     : Number,
		required : true,
		default  : 0
	},
	losses  : {
		type     : Number,
		required : true,
		default  : 0
	},
	games   : [
		{
			type : Schema.Types.ObjectId,
			ref  : 'Game'
		}
	]
});

module.exports = module.model('Team', TeamSchema);
