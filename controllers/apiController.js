var User = require('../models/user');
var fs = require('fs-extra');
var path = require('path');

module.exports.updatePhoto = function(req, res) {
	var file = req.files.file;
	var userId = req.body.userId;
	console.log("user " + userId + " fs submitting ", file);

	var uploadDate = new Date();

	var tempPath = file.path;
	var targetPath = path.join(__dirname, "../uploads/" + userId + uploadDate + file.name);
	var savePath = "/uploads/" + userId + uploadDate + file.name;

	fs.rename(tempPath, targetPath, function(err) {
		if(err) {
			console.log(err)
		}
		else {
			User.findById(userId, function(err, userData) {
				var user = userData;
				user.image = savePath;
				user.save(function(err) {
					if(err) {
						console.log("failed save");
						res.json({status: 500})
					}
					else {
						console.log("save successful");
						res.json({status: 200})
					}
				})
			})
		}
	})
};
module.exports.updateBio = function(req, res) {
	var bio = req.body.bio;
	var userId = req.body.userId;

	User.findById(userId, function(err, userData) {
		var user = userData;
		user.bio = bio;

		user.save(function(err) {
			if(err) {
				console.log("fail");
				res.json({status: 500})
			}
			else {
				console.log("successful");
				res.json({status: 200})
			}
		})
	})
};
var Post = require('../models/posts');
module.exports.postPosts = function(req, res) {
	var post = new Post(req.body);
	post.save();

	Post.find({})
		.sort({date: -1}).exec(function(err, allPosts) {
		if(err) {
			res.error(err);
		}
		else {
			res.json(allPosts);
		}
	})
};
module.exports.getPosts = function(req, res) {
	if(!req.body.following) {
	Post.find({})
		.sort({date: -1})
		.exec(function(err, allPosts) {
			if(err) {
				res.error(err);
			}
			else {
				res.json(allPosts);
			}
		})
	}
	else {
		var requestedPosts = [];
		for(var i = 0, len = req.body.following.length; i < len; i++) {
			requestedPosts.push({userId: req.body.following[i].userId});
		}
		Post.find({$or: requestedPosts})
			.sort({date: -1})
			.exec(function(err, allPosts) {
				if(err) {
					res.error(err);
				}
				else {
					res.json(allPosts);
				}
			})
	};
}
var Users = require('../models/user')
module.exports.getUsers = function(req, res) {
	Users.find({}, function(err, usersData) {
		if(err) {
			res.error(err);
		}
		else {
			res.json(usersData);
		}
	})
}
module.exports.followUser = function(req, res) {
	var userId = req.body.userId,
		posterId = req.body.posterId;
	Users.findById(posterId, function(err, poster) {
		poster.followers.push({userId: userId});
		poster.save();
	})
	Users.findById(userId, function(err, follower) {
		follower.following.push({userId: posterId});
		follower.save();
	})
}














