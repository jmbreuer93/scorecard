const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
	fistName           : {
		type     : String,
		required : true
	},
	lastName           : {
		type     : String,
		required : true
	},
	atBats             : {
		type     : Number,
		required : true,
		default  : 0
	},
	hits               : {
		type     : Number,
		required : true,
		default  : 0
	},
	walks              : {
		type     : Number,
		required : true,
		default  : 0
	},
	runs               : {
		type     : Number,
		required : true,
		default  : 0
	},
	strikeouts         : {
		type     : Number,
		required : true,
		default  : 0
	},
	single             : {
		type     : Number,
		required : true,
		default  : 0
	},
	double             : {
		type     : Number,
		required : true,
		default  : 0
	},
	triple             : {
		type     : Number,
		required : true,
		default  : 0
	},
	homeRun            : {
		type     : Number,
		required : true,
		default  : 0
	},
	battingAverage     : {
		type     : Number,
		required : true
	},
	onBasePercentage   : {
		type     : Number,
		required : true
	},
	sluggingPercentage : {
		type     : Number,
		required : true
	}
});

module.exports = mongoose.model('Player', PlayerSchema);
