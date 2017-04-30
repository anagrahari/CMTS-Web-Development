var mongoose = require('mongoose');

// Book Schema

var meetingScheduleSchema = mongoose.Schema({
	_id: {
		type: Number,
		required: true
	},
	inviter_id: {
		type: Number,
		required: true
	},
	room_id: {
		type: Number,
		required: true
	},
	start_time: {
		type: Number,
		required: true
	},
	end_time: {
		type: Number,
		required: true
	},
	priority_invitees: {
		type: [{
			user_id : {type: Number, required: true},
			ack_status: {type: Boolean, required: true},
			invite_status: {type: Boolean, required: true}
		}],
		required: true
	},
	secondary_invitees: {
		type: [{
			user_id : {type: Number, required: true},
			ack_status: {type: Boolean, required: true},
			invite_status: {type: Boolean, required: true}
		}],
		required: true
	},
	agenda: {
		type: String
	}
});

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

// Export the Mongoose model
module.exports = mongoose.model('Meeting_Schedule', meetingScheduleSchema);