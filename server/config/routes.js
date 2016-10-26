// var mongoose = require('mongoose');
// var users = require('../controllers/Users.js');
// var questions = require('../controllers/Questions.js');
// var answers = require('../controllers/Answers.js');
// var User = mongoose.model('User');
// var Question = mongoose.model('Question');
// var Answer = mongoose.model('Answer');

module.exports = function(app){

	app.post('/login', function(req, res){
		users.login(req, res);
	});


	app.get('/dashboard', function(req, res){
		questions.index(req, res);
	});

	app.delete('/delete/:question_id', function(req, res){
		questions.delete(req, res);
	});

	app.get('/question/:question_id', function(req, res){
		questions.show(req,res);
	});

	app.post('/create', function(req, res){
		questions.create(req,res);
	});

	app.get('/user', function(req,res){
		var user = {
			username: req.session.username
		};
		res.json(user);
	});

	app.post('/like/:question_id', function(req, res){
		answers.like(req,res);
	});

	app.post('/question/:question_id/answer', function(req, res){
		answers.create(req,res);
	});


	// app.post('/friends', function(req, res){
	// 	friends.create(req,res);
	// });

	// // app.put is to update an existing record, app.delete is to delete one
	// app.put('/friends/:id', function(req, res){
	// 	friends.update(req, res);
	// });


	// app.delete('/friends/:id', function(req, res){
	// 	friends.delete(req, res);
	// });

}