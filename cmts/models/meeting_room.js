var mongoose = require('mongoose');

var meetingRoomsSchema = mongoose.Schema({
	room_id: {
		type: String,
		required: true
	},
	start_time : {
		type: Number, 
		required: true
	},
	end_time: {
		type: Number,
		required: true
	}
	
});

module.exports = mongoose.model('Meeting_Room', meetingRoomsSchema);