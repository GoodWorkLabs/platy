angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
	  
  	// var ref = new Firebase("https://platy.firebaseio.com/");
  	// ref.authWithCustomToken('6VsS1l7cEQA9zLoi8tqM6b46aallaHQBrWHyerLj', function(error, authData) {
  	// 	if (error) {
  	// 		console.log("Login Failed to Firebase!", error);
  	// 	}
  	// 	else
  	// 	{
  	// 		ref.once("value", function(snapshot) {
  	// 			// $scope.firebase_chats_response = $firebaseObject(ref);
  	// 				console.log(Object.keys(snapshot.val().chats));
  	// 			console.log(snapshot.val().chats);
  	//
  	// 		}, function (errorObject) {
  	// 			console.log("Error reading Chats: " + errorObject.code);
  	// 		});
  	// 	}
  	// });
	  
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

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.service('ContactsService', function($q) {
	return {
		contacts: [
			{ id: 1, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Rajib', last_name: 'Chowdhury', username: 'Rajib Chowdhury', email: 'rajib@goodworklabs.com', phone: '9836157098'},
			{ id: 2, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Palash', last_name: 'Sinha', username: 'Palash Sinha', email: 'palash@goodworklabs.com', phone: '9836157098'},
			{ id: 3, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Bodhi', last_name: 'Bhattacharya', username: 'Bodhi Bhattacharya', email: 'bodhi@goodworklabs.com', phone: '9836157098'},
			{ id: 4, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Madhumita', last_name: 'Chatterjee', username: 'Madhumita Chatterjee', email: 'madhumita@goodworklabs.com', phone: '9836157098'},
			{ id: 5, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Paridhi', last_name: 'Gupta', username: 'Paridhi Gupta', email: 'paridhi@goodworklabs.com', phone: '9836157098'},
			{ id: 6, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Tapash', last_name: 'Mullick', username: 'Tapash Mullick', email: 'tapash@goodworklabs.com', phone: '9836157098'},
			{ id: 7, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Ujjal', last_name: 'Bhattacharya', username: 'Ujjal Bhattacharya', email: 'ujjal@goodworklabs.com', phone: '9836157098'},
			{ id: 8, avatar: 'http://ionicframework.com/img/docs/venkman.jpg', first_name: 'Bimal', last_name: 'Singh', username: 'Bimal Singh', email: 'bimal@goodworklabs.com', phone: '9836157098'}
		],
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

.service('ChatsService', function($q) {
	return {
		chats: [
			{ id: 1, username: 'Rajib Chowdhury', last_message: 'Dds df dsf dsf dsf sdsds...' },
			{ id: 2, username: 'Palash Sinha', last_message: 'Hkjkjk kjd asdkj...' },
			{ id: 3, username: 'Bodhi Bhattacharya', last_message: 'Ykj jdjsad asdhsadj asds...' },
			{ id: 4, username: 'Madhumita Chatterjee', last_message: 'Ujhj jahsd asjdhasd asd...' },
			{ id: 5, username: 'Paridhi Gupta', last_message: 'Lasdsa asdsad...' },
			{ id: 6, username: 'Tapash Mullick', last_message: 'Sssa asf asfsa asf asdsaasf...' }
		],
		getChats: function() {
			return this.chats
		},
		getChat: function(chatId) {
			var res = ''
			this.chats.forEach(function(chat) {
				if (chat.id == chatId) { 
					res = chat;
				}
			})
			return res; 
		}
	}
})

.controller('ChatsCtrl', function($scope, ChatsService, $stateParams) {
	$scope.chats = ChatsService.getChats();
})

.controller('ChatCtrl', function($scope, ChatsService, $stateParams) {
	$scope.chat = ChatsService.getChat($stateParams.chatId);
	$scope.messages = [];
	
	// 
  	var ref = new Firebase("https://platy.firebaseio.com/chats/" + $stateParams.chatId);
  	ref.authWithCustomToken('6VsS1l7cEQA9zLoi8tqM6b46aallaHQBrWHyerLj', function(error, authData) {
  		if (error) {
  			console.log("Login Failed to Firebase!", error);
  		}
  		else
  		{
			ref.on("value", function(snapshot) {
				$scope.messages = snapshot.val();
				$scope.$apply();
				console.log($scope.messages);
			}, function (errorObject) {
				console.log("Error reading Chats: " + errorObject.code);
			});
  		}
  	});
	//
})

.controller('ContactsCtrl', function($scope, ContactsService, $stateParams) {
	$scope.contacts = ContactsService.getContacts();
})

.controller('ContactCtrl', function($scope, ContactsService, $stateParams) {
	$scope.contact = ContactsService.getContact($stateParams.contactId);
})
