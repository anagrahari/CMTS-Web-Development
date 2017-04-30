var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var MeetingRoom = require('./models/meeting_room');
var UserSchedule = require('./models/user_schedule');
var MeetingSchedule = require('./models/meeting_schedule');


// Connet to mongoose

mongoose.connect('mongodb://localhost/cmtsdb');
var db = mongoose.connection;
db.on('error',console.log.bind(console,'connection refused !!!!!'));

// Use environment defined port or 5000
var port = process.env.PORT || 5000;

// Create our Express router
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'You are running User APIs!' }); 
});
var startHours =900;
var endHours = 1800;
var duration = 30;
for(var st = startHours; st<endHours;st = st +30 ){
	
}

var noOfMeeting = 5
var arr2D = new Array(noOfMeeting).fill(new Array((endHours-startHours)/50));
map_room ={}
map_time = {}
for(var j=0;j<noOfMeeting;j++)
	map_room[j+1] = j;

var inviteeList = [25,19,18];

router.get('/meetingRooms/:Date', function(req, res) {
	var epochStart = new Date(2017, 3, 28).getTime() / 1000
	var epochEnd= 1493389900//new Date(2017, 3,29).getTime()/1000
	var inviteeId = 25;
	//console.log(epochStart ,epochEnd);
    MeetingRoom.find(
						{$and: [{start_time: {$gte: epochStart}}, {end_time: {$lte: epochEnd}}]},
						function(err,result){
							if(err){
								return;
							}
							for(var j = 0; j<result.length;j++){
								console.log(result[j].start_time);
								var startDate = new Date(result[j].start_time *1000);
								var endDate = new Date(result[j].end_time *1000);
								var startTime, endTime
								if((startDate.getHours()*100 + startDate.getMinutes() - startHours)%50 > 0){
									startTime = (startDate.getHours()*100 + startDate.getMinutes() - startHours)/50 +1;
								}else{
								    startTime = (startDate.getHours()*100 + startDate.getMinutes() - startHours)/50;
								}
								if((endDate.getHours()*100 + endDate.getMinutes() - startHours)%50 > 0){
									endTime = (endDate.getHours()*100 + endDate.getMinutes() - startHours)/50 +1;
								}else{
								    endTime = (endDate.getHours()*100 + endDate.getMinutes() - startHours)/50;
								}
								for(var i = startTime; i<endTime;i++)
									arr2D[map_room[result[j].room_id]][i] = false;
								
							}
							
							
							
						}
					)
	
	inviteeList.forEach(function(inviteeId, index)
	{
		UserSchedule.find({user_id : inviteeId},
						/*{$and: [{start_time: {$gte: epochStart}}, {end_time: {$lte: epochEnd}}]},*/
						function(err,result){
							if(err){
								return;
							}
							console.log(result[0]);
							
								for(var i = 0; i<result[0].meeting_list.length;i++){
									console.log(result[0].meeting_list[0].start_time);
									var startDate = new Date(result[0].meeting_list[i].start_time *1000);
									var endDate = new Date(result[0].meeting_list[i].end_time *1000);
									var startTime, endTime
									if((startDate.getHours()*100 + startDate.getMinutes() - startHours)%50 > 0){
										startTime = (startDate.getHours()*100 + startDate.getMinutes() - startHours)/50 +1;
									}else{
										startTime = (startDate.getHours()*100 + startDate.getMinutes() - startHours)/50;
									}
									if((endDate.getHours()*100 + endDate.getMinutes() - startHours)%50 > 0){
										endTime = (endDate.getHours()*100 + endDate.getMinutes() - startHours)/50 +1;
									}else{
										endTime = (endDate.getHours()*100 + endDate.getMinutes() - startHours)/50;
									}
									for(var j = startTime; j<endTime;j++){
										for(var i = 0;i<noOfMeeting;i++){
											arr2D[j][i] = false;
										}
									}
								}
								for(var i = 0;i<arr2D.length;i++){
								for(var j= 0;j<arr2D[0].length;j++){
									console.log(arr2D[i][j] + "\t");
								}
								console.log("\n");
							}		
						}
					);
					
	});
	console.log("hi");
	var json = JSON.stringify(arr2D);
	console.log(json+"hello");
});


router.get('/meetingDetails', function(req, res) {
	MeetingSchedule.find(function(err, schedule) {
		if (err) {
			res.send(err);
		}
		res.json(schedule);
	});
});


router.get('/meetingDetails/:inviter_id', function(req, res) {
	
	MeetingSchedule.find({inviter_id: req.params.inviter_id}, function(err, schedule) {
		if (err) {
			res.send(err);
		}
		res.json(schedule);
	});
});

router.post('/meeting/schedule', function(req, res) {
	var schedule = new MeetingSchedule();
	
	if(req.body._id==null || req.body.inviter_id==null || req.body.room_id==null || req.body.start_time==null
		|| req.body.end_time==null || req.body.priority_invitees==null || req.body.secondary_invitees==null) {
		res.status(400);
		var error = 
		{
		   "status": 400,
		   "status_description" : "Bad Request",
		   "message": "Parameters missing",
		}
		res.json({message : "Error in scheduling meeting", details: error});
    }
	
	else {
		schedule._id = req.body._id;
		schedule.inviter_id = req.body.inviter_id;
		schedule.room_id = req.body.room_id;
		schedule.start_time = req.body.start_time;
		schedule.end_time = req.body.end_time;
		schedule.priority_invitees = req.body.priority_invitees;
		schedule.secondary_invitees = req.body.secondary_invitees;
		schedule.agenda = req.body.agenda
		  // Save the user and check for errors
		schedule.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Meeting added to the database!', data: schedule });
		});
	}
});

router.put('/meeting/:_id/edit', function(req, res) {
	id = req.params._id;
	MeetingSchedule.findById(req.params._id, function(err, schedule) {
		if (err) {
			res.status(404);
			res.send(err);
		}
		
		if (schedule == null) {
			var error = 
				{	
					"status": 404,
					"message": "Schedule not found.",
				}
			//res.json({message : "Error in updating user", details: error});
			res.status(404).send({ error: 'Error in updating schedule', details: error});
		}
		
		else {
			if (req.body._id) {
				schedule._id = req.body._id;
			}
			
			if (req.body.invitee_id) {
				schedule.invitee_id = req.body.invitee_id;
			}
			
			if (req.body.room_id) {
				schedule.room_id = req.body.room_id;
			}
			
			if (req.body.start_time) {
				schedule.start_time = req.body.start_time;
			}
			
			if (req.body.end_time) {
				schedule.end_time = req.body.end_time;
			}
			
			if (req.body.priority_invitees) {
				schedule.priority_invitees = req.body.priority_invitees;
			}
			
			if (req.body.secondary_invitees) {
				schedule.secondary_invitees = req.body.secondary_invitees;
			}
			
			if (req.body.agenda) {
				schedule.agenda = req.body.agenda;
			}
			
			schedule.save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json({ message: 'Meeting updated in the database!', data: schedule });
			});
		}
	});
});

router.delete('/meeting/:_id/delete', function(req, res) {
	MeetingSchedule.count(function (err, count) { 
		if(count===0) {
		  res.status(404).send({ error: 'No data the database.'});
		}
    });
	
	MeetingSchedule.findById(req.params._id, function(err, schedule) {
		if (err) {
			res.status(404);
			res.send(err);
		}
		
		if (schedule == null) {
			var error = 
				{	
					"status": 404,
					"message": "Schedule not found.",
				}
			res.status(404).send({ error: 'Error in deleting schedule', details: error});
		}
		
		else {
			MeetingSchedule.findByIdAndRemove(req.params._id, function(err) {
				if (err) {
					res.send(err);
				}
				res.json({ message: 'Meeting removed from the database.'});
			});
		}
	});
});

app.put('/meeting/:_id/:invitee_id/acknowledge/:response', function(req, res) {
	var meeting_id = req.params._id;
	var invitee_id = req.params.invitee_id;
	var response = req.params.response;
	Schedule.updateAcknowledgement(meeting_id, invitee_id, response, function(err, schedule) {
		if(err) {
			console.error(err);
			res.end('An error occured.');
		}
		res.json(schedule);
	})
});

app.get('/meetingroom/search/:meetingDate', function(req, res) {
	var date = req.params.meetingDate;
	var invitees = req.body;
	Schedule.getMeetingRooms(function(err, rooms) {
		if(err) {
			console.error(err);
			res.end('An error occured.');
		}
		res.json(rooms);
	})
});


app.use('/api', router);

app.listen(port);
console.log('Running on port 5000');

// Acknowledgement

module.exports.updateAcknowledgement = function(meeting_id, invitee_id, response, callback) {
	schedule = Schedule.findById(meeting_id);
	console.log("Tarun", schedule);
	var query = {_id: meeting_id};
	var priority = schedule.priority_invitees;
	var secondary = schedule.secondary_invitees;
	var isPriority = false;
	
	for(var i = 0; i < priority.size() && !isPriority; i++){
		if(priority[i].user_id == invitee_id){
			priority[i].ack_status = response;
			isPriority = true;
			break;
		}
	}
	
	for(var i = 0; i < secondary.size() && !isPriority; i++){
		if(secondary[i].user_id == invitee_id){
			secondary[i].ack_status = response;
			break;
		}
	}
	
	console.log("Tarun", priority);
	console.log("Tarun", secondary);
	
	var update = {
		inviter_id:schedule.inviter_id,
		room_id:schedule.room_id,
		start_time:schedule.start_time,
		end_time:schedule.end_time,
		priority_invitees:priority,
		secondary_invitees:secondary,
		agenda:schedule.agenda
	}
	
	MeetingSchedule.findOneAndUpdate(query, update, {}, callback);
}

module.exports.getMeetingRooms = function(date, invitees, callback) {
	console.log(date);
	var met_res;
	var user_res;
	MeetingRoom.find(function (room_err, room_res) {
		console.log(room_res);
		UserSchedule.find(function (user_err, user_res) {
			console.log(user_res);
		})
	});
}