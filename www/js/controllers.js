angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
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

// .controller('ChatsCtrl', function($scope) {
//   $scope.chats = [
//     { id: 1, username: 'Reggae Chat', last_message: 'Dds df dsf dsf dsf sdsds...' },
//     { id: 2, username: 'Chill Chat', last_message: 'Hkjkjk kjd asdkj...' },
//     { id: 3, username: 'Dubstep Chat', last_message: 'Ykj jdjsad asdhsadj asds...' },
//     { id: 4, username: 'Indie Chat', last_message: 'Ujhj jahsd asjdhasd asd...' },
//     { id: 5, username: 'Rap Chat', last_message: 'Lasdsa asdsad...' },
//     { id: 6, username: 'Cowbell Chat', last_message: 'Sssa asf asfsa asf asdsaasf...' }
//   ];
// })

// .controller('ChatsCtrl', function($scope, $stateParams) {
// 	$scope.data = {
// 		showDelete: true,
// 		showReorder: true
// 	};
//
//     $scope.chats = [
//       { id: 1, username: 'Reggae Chat', last_message: 'Dds df dsf dsf dsf sdsds...' },
//       { id: 2, username: 'Chill Chat', last_message: 'Hkjkjk kjd asdkj...' },
//       { id: 3, username: 'Dubstep Chat', last_message: 'Ykj jdjsad asdhsadj asds...' },
//       { id: 4, username: 'Indie Chat', last_message: 'Ujhj jahsd asjdhasd asd...' },
//       { id: 5, username: 'Rap Chat', last_message: 'Lasdsa asdsad...' },
//       { id: 6, username: 'Cowbell Chat', last_message: 'Sssa asf asfsa asf asdsaasf...' }
//     ];
// });

.service('ChatsService', function($q) {
	return {
		chats: [
			{ id: 1, username: 'Reggae Chat', last_message: 'Dds df dsf dsf dsf sdsds...' },
			{ id: 2, username: 'Chill Chat', last_message: 'Hkjkjk kjd asdkj...' },
			{ id: 3, username: 'Dubstep Chat', last_message: 'Ykj jdjsad asdhsadj asds...' },
			{ id: 4, username: 'Indie Chat', last_message: 'Ujhj jahsd asjdhasd asd...' },
			{ id: 5, username: 'Rap Chat', last_message: 'Lasdsa asdsad...' },
			{ id: 6, username: 'Cowbell Chat', last_message: 'Sssa asf asfsa asf asdsaasf...' }
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
})
