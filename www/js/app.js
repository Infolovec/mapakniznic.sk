// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var mapaKniznicApp = angular.module('mapaKniznicApp', ['ionic', 'txx.diacritics'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

mapaKniznicApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider

    .state('map', {
    url: "/:libraryName",
    controller: 'mapCtrl',
    templateUrl: "templates/map.html",
    reloadOnSearch: false // do not reload controller on libraryName change
  })

  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);

})

mapaKniznicApp.factory('metaInfoService', function() {
   var service = {
     title: 'Mapa knižníc (v Bratislave)',
     update: function(library){
       this.title = library.name + ' | mapakniznic.sk'
     },
     reset: function(){
       this.title = 'Mapa knižníc (v Bratislave)'
     }
   }
   return service
});

mapaKniznicApp.controller('headCtrl', function($scope, $stateParams, metaInfoService) {
  $scope.metaInfo = metaInfoService
})

