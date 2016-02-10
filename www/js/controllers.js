angular.module('starter.controllers', []).config(function ($httpProvider) {
	$httpProvider.defaults.headers.put['Content-Type'] = 'application/json';
	$httpProvider.defaults.headers.post['Content-Type'] =  'application/json';
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $state, $ionicLoading) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	$scope.$on('$ionicView.enter', function(e) {
		if (localStorage.getItem("current_user_token") == null) {
			$scope.login();
		}
	});

	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope,
		focusFirstInput: true,
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function() {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		console.log('Doing login', $scope.loginData);
		console.log($scope.loginData);
		// Show loader
		$ionicLoading.show({ template: 'Authenticating...'});
		
		$http({
			method: "POST",
			url: "https://shrouded-stream-24547.herokuapp.com/api/v1/login",
			data: $scope.loginData
		}).then(function successCallback(response) {
			localStorage.setItem("current_user_id", response.data.id);  
			localStorage.setItem("current_user_token", response.data.token);  
			localStorage.setItem("current_user_object", JSON.stringify(response.data));
			
			// Download contact list
			$http({
				method: "GET",
				url: "https://shrouded-stream-24547.herokuapp.com/api/v1/users?token="+response.data.token
			}).then(function successCallback(response) {
				console.log(response.data);
				localStorage.setItem("contacts_list", JSON.stringify(response.data));
			}, function errorCallback(response) {
				console.log('Error downloading user list.');
				localStorage.removeItem("current_user_token");
			});
			
			// Close login modal
			$scope.closeLogin();
			$ionicLoading.hide();
		}, function errorCallback(response) {
			$ionicLoading.hide();
			localStorage.removeItem("current_user_token");
			alert('Invalid Credential.');
		});
	};
	
	$scope.logOut = function() {
		localStorage.removeItem("current_user_token");
		localStorage.clear(); //Clear all local storage
		
		// Render to chats page
		$state.go("app.chats");
	};
})

.service('ContactsService', function($q) {
	return {
		contacts: JSON.parse(localStorage.getItem("contacts_list")),
		getContacts: function() {
			return this.contacts
		},
		getContact: function(contactId) {
			var res = ''
			this.contacts.forEach(function(contact) {
				if (contact.id == contactId) { 
					res = contact;
				}
			})
			return res; 
		}
	}
})

.controller('ChatsCtrl', function($scope, $stateParams) {
	$scope.chats = JSON.parse(localStorage.getItem("ongoing_chats"));
	
	$scope.setCurrentChat = function (id, avatar, chat_title, group) {
		localStorage.setItem("current_chat_id", id);
		localStorage.setItem("current_chat_avatar", avatar);
		localStorage.setItem("current_chat_title", chat_title);
		localStorage.setItem("current_chat_group", group);
	}
})

.controller('ChatCtrl', function($scope, $ionicFrostedDelegate, $ionicScrollDelegate, $stateParams, $ionicLoading) {
	// Show loader
	$ionicLoading.show({ template: 'Loading...'});
	
	$scope.current_user_id = localStorage.getItem("current_user_id");
	$scope.chats = ((localStorage.getItem("ongoing_chats33") == null) ? [] : localStorage.getItem("ongoing_chats33"));
	$scope.chat = getChat($stateParams.chatId);
	$scope.messages = [];
	
	// Current chat object
	$scope.current_chat_id = localStorage.getItem("current_chat_id");
	$scope.current_chat_avatar = localStorage.getItem("current_chat_avatar");
	$scope.current_chat_title = localStorage.getItem("current_chat_title");
	$scope.current_chat_group = localStorage.getItem("current_chat_group");
	
	// Get specific chat object
	function getChat(chatId) {
		var res = '';
		$scope.chats.forEach(function(chat) {
			if (chat.id == chatId) { 
				res = chat;
			}
		})
		return res;
	}
	
	// Get message
	var ref = new Firebase("https://platy.firebaseio.com/chats/" + $stateParams.chatId);
	ref.authWithCustomToken('6VsS1l7cEQA9zLoi8tqM6b46aallaHQBrWHyerLj', function(error, authData) {
		if (error) {
			console.log("Login Failed to Firebase!", error);
		}
		else
		{
			ref.on("value", function(snapshot) {
				$scope.messages = snapshot.val();
				$scope.$evalAsync();
				// Update the scroll area and tell the frosted glass to redraw itself
				$ionicFrostedDelegate.update();
				$ionicScrollDelegate.scrollBottom(true);
				// Hide loader
				$ionicLoading.hide();
			}, function (errorObject) {
				console.log("Error reading Chats: " + errorObject.code);
			});
		}
	});
	
	// Send message
	$scope.sendMessage = function(message, utc_timestamp) {
		var message_obj = {
			'content': message,
			'timestamp': utc_timestamp,
			'user_id': $scope.current_user_id
		}
		// Reset chat input model
		$scope.chatInput =	$scope.initial;
		// Send this to firebase
		ref.push(message_obj);
		
		// Update the scroll area and tell the frosted glass to redraw itself
		$ionicFrostedDelegate.update();
		$ionicScrollDelegate.scrollBottom(true);
		
		// Locally store ongoing chats
		var message_object_json = {
			id: $scope.current_chat_id,
			avatar: $scope.current_chat_avatar,
			chat_title: $scope.current_chat_title,
			last_message: message,
			group: $scope.current_chat_group
		}
		
		if ((localStorage.getItem("ongoing_chats") != null) && (eval(localStorage.getItem("ongoing_chats")).length > 0)) {
			ongoing_chats_json = JSON.parse(localStorage.getItem("ongoing_chats"));
			ongoing_chats_json.removeValue('id', $scope.current_chat_id);
			
			var outcome = $.merge(ongoing_chats_json, [message_object_json]);
			localStorage.setItem("ongoing_chats", JSON.stringify(outcome));
		} else {
			localStorage.setItem("ongoing_chats", JSON.stringify([message_object_json]));
		}
		// Locally store ongoing chats
	}
})

.controller('ContactsCtrl', function($scope, ContactsService, $stateParams) {
	$scope.contacts = ContactsService.getContacts();
})

.controller('ContactCtrl', function($scope, $state, ContactsService, $stateParams) {
	$scope.contact = ContactsService.getContact($stateParams.contactId);
	$scope.current_user_id = localStorage.getItem("current_user_id");
	
	// Init new one to one chat
	$scope.initChat = function(contact) {
		if ($scope.current_user_id > contact.id) {
			chat_id = contact.id + "_" + $scope.current_user_id
		} else {
			chat_id = $scope.current_user_id + "_" + contact.id
		}

		// Set Current chat object
		localStorage.setItem("current_chat_id", chat_id);
		localStorage.setItem("current_chat_avatar", contact.avatar);
		localStorage.setItem("current_chat_title", contact.username);
		localStorage.setItem("current_chat_group", false);
		// Render to chat page
		$state.go("app.chat", {"chatId": chat_id});
	}
})

//  Remove duplicate entry from JSON array
//  http://stackoverflow.com/questions/6310623/remove-item-from-json-array-using-its-name-value
Array.prototype.removeValue = function(name, value){
	var arr = [];

	$.each(this, function(i, item) {
		if (item[name] != value) {
			arr.push(item);
		}
	});
   
	this.length = 0; //clear original array
	this.push.apply(this, arr); //push all elements except the one we want to delete
}
