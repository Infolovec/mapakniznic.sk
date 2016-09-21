mapaKniznicApp.controller('mapCtrl', function($scope, $stateParams, $rootScope, uiState, leafletMap, libraries) {
  leafletMap.initialize()
  libraries.load()

  $scope.checkSideMenuVisibility = function(clickEvent){
    $rootScope.$broadcast('changeSideMenuVisibility', clickEvent)
  }

  $scope.$on('updateLibraryMarkersAppearance', function(event) {
    if(uiState.searchFoundLibraries().length > 0){
      libraries.all().forEach(function(library){
        library.marker.setStyle('hide')
      })    
      uiState.searchFoundLibraries().forEach(function(library){
        library.marker.setStyle('highlight')
      })
    } else {
      libraries.all().forEach(function(library){
        library.marker.setStyle('normal')
      })          
    }

    librariesToFitView = uiState.searchFoundLibraries()
    if(uiState.currentlyDisplayedLibraryDetail()){
      uiState.currentlyDisplayedLibraryDetail().marker.setStyle('highlight')
      librariesToFitView = null
    }
    
    leafletMap.refreshMarkersAppearance(librariesToFitView);
  })

  $scope.$broadcast('updateLibraryMarkersAppearance');

  if($stateParams.libraryUrlID){
    var preselectedLibrary = libraries.findLibraryByUrlID($stateParams.libraryUrlID)
    if(preselectedLibrary)
      uiState.showLibraryDetail(preselectedLibrary)
  }

})