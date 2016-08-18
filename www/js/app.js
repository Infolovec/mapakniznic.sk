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

mapaKniznicApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('map', {
    url: "/map",
    controller: 'mapCtrl',
    templateUrl: "templates/map.html"
  })

  $urlRouterProvider.otherwise('/map');

})

mapaKniznicApp.controller('mapCtrl', function($scope, rawLibraryData, removeDiacritics) {
  $scope.search = {query: ''}
  var searchFoundLibraries = []
  $scope.libraries = []

  $scope.clearSearch = function(){
    searchFoundLibraries = []
     $scope.search.query = ''
    updateLibraryMarkersAppearance()
  }

  $scope.doSearch = function(){
    if($scope.search.query.length > 2){
      searchFoundLibraries = $scope.libraries.filter(function(library){
        var q = removeDiacritics.replace($scope.search.query.toLowerCase())
        var ln = removeDiacritics.replace(library.name.toLowerCase())
        return(q.indexOf(ln) > -1 || ln.indexOf(q) > -1)
      })
    } else 
      searchFoundLibraries = []

    updateLibraryMarkersAppearance()
    $('#searchField').blur() // hide smartphone keyboard
  }

  $scope.visibleLibraryUID = null
  $scope.isDetailVisible = function(library){
    return($scope.visibleLibraryUID == library.uid)
  }

  $scope.hideLibraryDetail = function(){
    $scope.visibleLibraryUID = null
  }

  var updateLibraryMarkersAppearance = function(){
    if(searchFoundLibraries.length > 0){
      $scope.libraries.forEach(function(library){
        library.marker.setStyle('hide')
      })    
      searchFoundLibraries.forEach(function(library){
        library.marker.setStyle('highlight')
      })
    } else {
      $scope.libraries.forEach(function(library){
        library.marker.setStyle('normal')
      })          
    }

    leafletMap.refreshMarkersAppearance(searchFoundLibraries);
  }

  var leafletMap = new LeafletMap()
  leafletMap.initialize()
  rawLibraryData.getAll().forEach(function(rawLibraryDataEntry) {
    var library = new Library()
    library.load(rawLibraryDataEntry)
    var libraryMarker = library.createMarker()
    libraryMarker.setClickCallback(function(){
      leafletMap.focusTo(libraryMarker)
      $scope.$apply(function(){
        $scope.visibleLibraryUID = library.uid
      })
      
    })
    leafletMap.addMarker(libraryMarker)

    $scope.libraries.push(library)
  })

  updateLibraryMarkersAppearance()
})