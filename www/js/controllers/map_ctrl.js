mapaKniznicApp.controller('mapCtrl', function($scope, $stateParams, $timeout, $location, $window, rawLibraryDataService, $rootScope, uiState, leafletMap, removeDiacritics) {
  leafletMap.initialize()
  $scope.libraries = []

  $scope.checkSideMenuVisibility = function(clickEvent){
    $rootScope.$broadcast('changeSideMenuVisibility', clickEvent)
  }

  $scope.$on('updateLibraryMarkersAppearance', function(event) {
    if(uiState.searchFoundLibraries().length > 0){
      $scope.libraries.forEach(function(library){
        library.marker.setStyle('hide')
      })    
      uiState.searchFoundLibraries().forEach(function(library){
        library.marker.setStyle('highlight')
      })
    } else {
      $scope.libraries.forEach(function(library){
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

  rawLibraryDataService.getAll().forEach(function(rawLibraryDataEntry) {
    var library = new Library(removeDiacritics)
    library.load(rawLibraryDataEntry)
    
    var libraryMarker = library.createMarker()
    libraryMarker.setClickCallback(function(){
        $timeout(function(){
          uiState.showLibraryDetail(library)
        })
    })

    leafletMap.addMarker(libraryMarker)
    $scope.libraries.push(library)
  })

  $scope.$broadcast('updateLibraryMarkersAppearance');

  if($stateParams.libraryName){
    var preselectedLibrary = $scope.libraries.find(function(library){
      return ($stateParams.libraryName == library.nameForURL)
    })
    if(preselectedLibrary)
      preselectedLibrary.marker.click()
  }


})