var mongoose = require('mongoose');

var userScheduleSchema = mongoose.Schema({
	user_id: {
		type: Number,
		required: true
	},
	meeting_list: {
		type: [{
			meeting_id : {type: Number, required: true},
			inviter_id: {type: Number, required: true},
			start_time: {type: Number, required: true},
			start_time: {type: Number, required: true}
		}],
		required: true
	}
});

module.exports = mongoose.model('User_Schedule', userScheduleSchema);