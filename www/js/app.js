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
    url: "/:libraryName",
    controller: 'mapCtrl',
    templateUrl: "templates/map.html",
    reloadOnSearch: false // do not reload controller on libraryName change
  })

  $urlRouterProvider.otherwise('/');

})

mapaKniznicApp.controller('mapCtrl', function($scope, $stateParams, $timeout, $location, rawLibraryData, removeDiacritics) {
  $scope.search = {query: ''}
  $scope.searchFoundLibraries = []
  $scope.libraries = []

  $scope.clearSearch = function(){
    $scope.searchFoundLibraries = []
    $scope.search.query = ''
    updateLibraryMarkersAppearance()
    $scope.hideLibraryDetail()
  }

  $scope.doSearch = function(){
    $scope.hideLibraryDetail()
    if($scope.search.query.length > 2){
      $scope.searchFoundLibraries = $scope.libraries.filter(function(library){
        var q = removeDiacritics.replace($scope.search.query.toLowerCase())
        return(library.isMatchingSearchString(q))
      })
    } else 
      $scope.searchFoundLibraries = []

    if($scope.searchFoundLibraries.length == 1)
      $scope.showLibraryDetail($scope.searchFoundLibraries[0])

    updateLibraryMarkersAppearance()
    $('#searchField').blur() // hide smartphone keyboard
  }

  $scope.visibleLibraryUID = null
  $scope.isDetailVisible = function(library){
    return($scope.visibleLibraryUID == library.uid)
  }

  $scope.showLibraryDetail = function(library){
    $scope.visibleLibraryUID = library.uid
    $location.path('/'+library.nameForURL);
    $scope.hideMenuPopup()
  }

  $scope.hideLibraryDetail = function(){
    $scope.visibleLibraryUID = null
    manuallySelectedLibrary = null
    $scope.hideMenuPopup()
    $location.path('/');
    updateLibraryMarkersAppearance()
  }

  $scope.visibleMenuPopupID = null
  $scope.isMenuPopupVisible = function(popupID){
    return($scope.visibleMenuPopupID == popupID)
  }

  $scope.hideMenuPopup = function(){
    $scope.visibleMenuPopupID = null
  }

  $scope.openMenuPopup = function(popupID){
    $scope.hideLibraryDetail()
    $scope.visibleMenuPopupID = popupID
  }

  var manuallySelectedLibrary = null

  var updateLibraryMarkersAppearance = function(){
    if($scope.searchFoundLibraries.length > 0){
      $scope.libraries.forEach(function(library){
        library.marker.setStyle('hide')
      })    
      $scope.searchFoundLibraries.forEach(function(library){
        library.marker.setStyle('highlight')
      })
    } else {
      $scope.libraries.forEach(function(library){
        library.marker.setStyle('normal')
      })          
    }

    librariesToFitView = $scope.searchFoundLibraries
    if(manuallySelectedLibrary){
      manuallySelectedLibrary.marker.setStyle('highlight')
      librariesToFitView = null
    }
    
    leafletMap.refreshMarkersAppearance(librariesToFitView);
  }

  var leafletMap = new LeafletMap()
  leafletMap.initialize()
  rawLibraryData.getAll().forEach(function(rawLibraryDataEntry) {
    var library = new Library(removeDiacritics)
    library.load(rawLibraryDataEntry)
    
    var libraryMarker = library.createMarker()
    libraryMarker.setClickCallback(function(){
      manuallySelectedLibrary = library
      
        $timeout(function(){
          $scope.showLibraryDetail(library)
        })

      updateLibraryMarkersAppearance()
      leafletMap.focusTo(libraryMarker)
    })

    leafletMap.addMarker(libraryMarker)
    $scope.libraries.push(library)
  })

  updateLibraryMarkersAppearance()

  if($stateParams.libraryName){
    var preselectedLibrary = $scope.libraries.find(function(library){
      return ($stateParams.libraryName == library.nameForURL)
    })
    if(preselectedLibrary){
      preselectedLibrary.marker.click()
    }
  }

  $scope.showSideMenu = false
  $scope.changeSideMenuVisibility = function(event){
    if (event.target.id == 'menuButton') 
      $scope.showSideMenu = !$scope.showSideMenu
    else 
      $scope.showSideMenu = false
  }
})