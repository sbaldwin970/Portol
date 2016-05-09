(function() {
angular.module('App', ['ngFileUpload']);
var mainController = function($scope, $http, $interval, Upload) {
	console.log('hello from main.js');
	$http.get('/api/me').then(function(returnData) {
		$scope.user = returnData.data;
	});

	$scope.$watch(function() {
		return $scope.file
	}, function() {
		$scope.upload($scope.file);
	});

	//$scope.upload = function(file) {
	//	if(file) {
	//		Upload.upload({
	//			url: '/api/profile/editPhoto', 
	//			method: 'POST', 
	//			data: {userId: $scope.user._id},
	//			file: file
	//		}).progress(function(evt) {
	//			console.log("firing");
	//		}).success(function(data) {
	//		}).error(function(error) {
	//			console.error(error);
	//		});
	//	};
	//};
	$scope.upload = function(file) {
		if(file) {
			file.upload = Upload.upload({
				url: '/api/profile/editPhoto',
				method: 'POST',
				data: {userId: $scope.user._id},
				file: file
			});
			file.upload.then(function(response) {
				file.result = response.data;
			});
		};
	};
	$scope.updateBio = function() {
		var request = {
			userId: $scope.user._id,
			bio: $scope.user.bio
		}
		$http.post('/api/profile/updateBio', request).success(function() {
			console.log("success");
		}).error(function(error) {
			console.log("error");
		});
	};
	$scope.sendPost = function(event) {
		if(event.which === 13) {
			var request = {
				user: $scope.user.name,
				userId: $scope.user._id,
				userImage: $scope.user.image,
				content: $scope.newPost
			}
			$http.post('/api/post/posts', request).success(function(response) {
				console.log(response);
				$scope.posts = response;
			}).error(function(error) {
				console.error(error);
			});
		};
	};
	function getPosts(initial) {
		$http.get('/api/post/get').success(function(response) {
			if(initial) {
				$scope.posts = response;
			}
			else {
				if(response.length > $scope.posts.length) {
				$scope.incomingPosts = response;
				};
			};
		});
	};
	$interval(function() {
		getPosts(false);
		if($scope.incomingPosts) {
		$scope.difference = $scope.incomingPosts.length - $scope.posts.length;
		}
		console.log("this is working");
	}, 5000);

	$scope.setNewPosts = function() {
		$scope.posts = angular.copy($scope.incomingPosts);
		$scope.incomingPosts = undefined;
	};
getPosts(true);
	
};
angular.module('App')
	.controller('mainController', mainController)
}());














