var app = angular.module('app', ['ngRoute', 'routeStyles']);

app.config(function ($routeProvider) {
// Routes to load your new and edit pages with new and edit controllers attached to them!
	$routeProvider

	.when('/',{
		templateUrl: 'partials/welcome.html',
		controller: 'loginController',
		css: 'static/css/index.css'
	})

	.when('/game',{
		templateUrl: 'partials/game.html',
		controller: 'dashController',
		css: 'static/css/game.css'
	})

	.when('/results',{
		templateUrl: 'partials/results.html',
		controller: 'viewQuestionController',
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

app.factory('userFactory', ['$http', function($http) {
	var factory = {};

	factory.login = function(user, callback){
		$http.post('/login', user).then(function(response){
			callback(response.data);
		});
	};

	factory.getUser = function(callback){
		$http.get('/user').then(function(response){
			callback(response.data);
		});
	};

	return factory;

}]);

app.controller('loginController', function($scope, questionFactory, userFactory, $routeParams, $location, $cookies, $rootScope) {
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

app.controller('createController', function($scope, questionFactory, userFactory, $routeParams, $location, $cookies, $rootScope){

	userFactory.getUser(function(user){
		if(!user.username){
			$location.url('/index');
		} else {
			$scope.username = user.username;
		}
	});	

	$scope.addQuestion = function(){
		$scope.newQuestion.author = $scope.username;
		console.log($scope.newQuestion);
		$scope.errors = {};
		$scope.questions = {};
		questionFactory.create($scope.newQuestion, function(data){
			if(data.errors){
				console.log(data.errors);
				$scope.errors = data.errors;
			} else {
				$location.url('/');
			}
		})
	}

	// $scope.create = function(){
	// 	$scope.errors={};
	// 	friendsFactory.create($scope.newfriend, function(data){
	// 		if(data.errors){
	// 			console.log(data.errors);
	// 			$scope.errors = data.errors;
	// 		} else {
	// 			friendsFactory.index(function(data){
	// 				$scope.friends = data;
	// 				$scope.newfriend = {};
	// 				$location.url('/');
	// 			});
	// 		}
	// 	})
		
	// }

	
}); 

app.controller('dashController', function($scope, questionFactory, userFactory, $routeParams, $location, $cookies, $rootScope) {

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

	// $scope.delete = function(data){
	// 	questionFactory.delete(data, function(){
	// 		questionFactory.getQuestions(function(data){
	// 			$scope.questions = data;
	// 		});
	// 	});
	// };

});

app.controller('viewQuestionController', function($scope, questionFactory, userFactory, $routeParams, $location, $cookies, $rootScope){

	questionFactory.show($routeParams.question_id, function(data){
		$scope.question = data;
	});

	$scope.like = function(answer){
		questionFactory.like($routeParams.question_id, answer, function(){
			questionFactory.show($routeParams.question_id, function(data){
				$scope.question = data;
			});
		});
	};

	$scope.addAnswer = function(){
		userFactory.getUser(function(user){
			if(!user.username){
				$location.url('/index');
			} else {
				$scope.username = user.username;
				$scope.newAnswer.author = $scope.username;
				questionFactory.answer($routeParams.question_id, $scope.newAnswer, function(data){
					if (data.errors){
						console.log(data.errors);
					} else {
						$location.url('/');
					}
				});
			}
		});
	};

})

// 	console.log($routeParams);
// 	friendsFactory.show($routeParams.friend_id, function(data){
// 		$scope.friend = data;
// 		console.log($scope.friend);
// 	});
	
	
// 	$scope.update = function(data){
// 		console.log($scope.updateFriend);
// 		if (!$scope.updateFriend.friend_id){
// 			$scope.updateFriend._id = $routeParams.friend_id;
// 		}
// 		friendsFactory.update($scope.updateFriend, function(){
// 			friendsFactory.index(function(data){
// 				$scope.friends = data;
// 				$scope.updateFriend = {};
// 				$location.url('/');
// 			})
// 		})
// 	}


