const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Float = require('mongoose-float').loadType(mongoose, 3);
const Team = require('./team');

const PlayerSchema = new Schema({
	firstName          : {
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
	rbi                : {
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
		type    : Number,
		default : 0
	},
	single             : {
		type    : Number,
		default : 0
	},
	double             : {
		type    : Number,
		default : 0
	},
	triple             : {
		type    : Number,
		default : 0
	},
	homeRun            : {
		type    : Number,
		default : 0
	},
	battingAverage     : {
		type     : Float,
		default  : function () {
			if (this.atBats) {
				return this.hits / this.atBats;
			}
			return 0;
		},
		required : true
	},
	onBasePercentage   : {
		type     : Float,
		required : true,
		default  : function () {
			if (this.atBats || this.walks) {
				return (this.hits + this.walks) / (this.atBats + this.walks);
			}
			return 0;
		}
	},
	sluggingPercentage : {
		type     : Float,
		required : true,
		default  : function () {
			if (this.atBats) {
				return (this.single + this.double * 2 + this.triple * 3 + this.homeRun * 4) / this.atBats;
			}
			return 0;
		}
	},
	ops                : {
		type     : Float,
		required : true,
		default  : function () {
			if (this.atBats) {
				return this.onBasePercentage + this.sluggingPercentage;
			}
			return 0;
		}
	},
	teamName           : {
		type     : Schema.Types.ObjectId,
		ref      : 'Team',
		required : true
	}
});
module.exports = mongoose.model('Player', PlayerSchema);
