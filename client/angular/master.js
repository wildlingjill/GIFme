var app = angular.module('app', ['ngRoute', 'routeStyles']);

app.config(function ($routeProvider) {
// Routes to load your new and edit pages with new and edit controllers attached to them!
	$routeProvider

	.when('/',{
		templateUrl: 'partials/welcome.html',
		controller: 'welcomeController',
		css: 'static/css/index.css'
	})

	.when('/game',{
		templateUrl: 'partials/game.html',
		controller: 'gameController',
		css: 'static/css/game.css'
	})

	.when('/results',{
		templateUrl: 'partials/results.html',
		controller: 'resultController',
		css: 'static/css/results.css'
	})

	// .when('/new_question',{
	// 	templateUrl: 'partials/create.html',
	// 	controller: 'createController'
	// })

	// .when('/question/:question_id/new_answer',{
	// 	templateUrl: 'partials/answer.html',
	// 	controller: 'viewQuestionController'
	// })

	// .when('/delete/:poll_id',{
	// 	templateUrl: 'partials/dashboard.html',
	// 	controller: 'pageController'
	// })

	.otherwise({
		redirectTo: '/'
	});
});

app.factory('questionFactory', ['$http', function($http) {
	var factory = {};

	// factory.login = function(user, callback){
	// 	$http.post('/login', user).then(function(response){
	// 		callback(response.data);
	// 	});
	// };


	factory.getQuestions = function(callback){
		$http.get('/dashboard').then(function(response){
			callback(response.data);
		});
	};


	factory.create = function(question, callback){
		$http.post('/create', question).then(function(response){
			callback(response.data);
		});
	};


	factory.delete = function(question, callback){
		$http.delete('/delete/'+question._id).then(function(response){
			callback();
		});
	};

	factory.show = function(question_id, callback){
		$http.get('/question/'+question_id).then(function(response){
			callback(response.data);
		});
	};

	factory.like = function(question_id, answer, callback){
		$http.post('/like/'+question_id, {answer: answer}).then(function(response){
			callback(response.data);
		});
	};

	factory.answer = function(question_id, answer, callback){
		$http.post('/question/'+question_id+'/answer', answer).then(function(response){
			callback(response.data);
		});
	};


	// factory.create = function(newfriend,callback){
	// 	$http.post('/friends', newfriend).then(function(response){
	// 		callback(response.data);
	// 	});
	// };

	// factory.update = function(friend, callback){ 
	// 	console.log(friend);
	// 	console.log('/friends/'+friend._id);
	// 	$http.put('/friends/'+friend._id, friend).then(function(response){
	// 		callback();
	// 	})
	// };

	// factory.delete = function(friend, callback){
	// 	$http.delete('/friends/'+friend._id).then(function(response){
	// 		callback();
	// 	})
	// };

	// factory.show = function(friend_id, callback){
	// 	$http.get('/friends/'+friend_id).then(function(response){
	// 		callback(response.data);
	// 	})
	// };

	return factory;
}]);


// ***** SOCKET FACTORY *****
app.factory('socket', function ($rootScope) {
  	var socket = io.connect();
  	return {
    	on: function (eventName, callback) {
      		socket.on(eventName, function () {
        		var args = arguments;
        		$rootScope.$apply(function () {
          			callback.apply(socket, args);
        		});
      		});
    	},
    	emit: function (data, callback) {
      		socket.emit(data, function () {
        		var args = arguments;
        		$rootScope.$apply(function () {
          			if (callback) {
            			callback.apply(socket, args);
          			}
        		});
      		})
    	},
    	currentId: function(){
        	return socket.id;
    	}
  	};
});


// ***** CONTROLLERS *****
app.controller('welcomeController', function($scope, questionFactory, $routeParams, $location, $rootScope, socket) {
/*
	THIS INDEX METHOD ACCESSES THE FRIENDS FACTORY AND RUNS THE FRIENDS INDEX.
	WE MIGHT RE USE INDEX A FEW TIMES, SO TO MINIMIZE REPETITION WE SET IT AS A VARIABLE.
*/
	$scope.login = function(){
		userFactory.login($scope.user, function(data){
			console.log($scope.user);
			console.log(data);
			$location.url('/');
		});
	};

});

app.controller('gameController', function($scope, questionFactory, $routeParams, $location, $rootScope, socket){

	// userFactory.getUser(function(user){
	// 	if(!user.username){
	// 		$location.url('/index');
	// 	} else {
	// 		$scope.username = user.username;
	// 	}
	// });	

	// $scope.addQuestion = function(){
	// 	$scope.newQuestion.author = $scope.username;
	// 	console.log($scope.newQuestion);
	// 	$scope.errors = {};
	// 	$scope.questions = {};
	// 	questionFactory.create($scope.newQuestion, function(data){
	// 		if(data.errors){
	// 			console.log(data.errors);
	// 			$scope.errors = data.errors;
	// 		} else {
	// 			$location.url('/');
	// 		}
	// 	})
	// }

	// can put this script in an angular controller
	// $scope.socketMessage = function(){
	// 	socket.emit('chat message', $scope.newMessage.content);
	// 	$scope.newMessage.content = '';
	// 	return false;
	// };

	// socket.on('chat message', function(msg){	
	// 	document.getElementById('messages').innerHTML = "<li>{{msg}}</li>";
	// 	$compile( document.getElementById('messages') )($scope);
	// });



	
}); 

app.controller('resultController', function($scope, questionFactory, userFactory, $routeParams, $location, $rootScope, socket) {

	questionFactory.getQuestions(function(data){
		$scope.questions = data;
		console.log(JSON.stringify($scope.questions, 0, 2))	
	});

	userFactory.getUser(function(user){
		if(!user.username){
			$location.url('/index');
		} else {
			$scope.username = user.username;
		}
	});		

});




