mapaKniznicApp.controller('embeddedMapCtrl', function($scope, $stateParams, $window, uiState, leafletMap, libraries) {
  var libraryID = $stateParams.libraryUrlID
  uiState.enableEmbeddedMode()
  leafletMap.initialize()
  libraries.load(libraryID)

  var library = libraries.findLibraryByUrlID(libraryID)
  uiState.showLibraryDetailInEmbeddedMode(library)
  leafletMap.refreshMarkersAppearance(library);

  $scope.openMapaKniznic = function(){
    $window.open('https://mapakniznic.sk/'+library.url_id, '_blank');
  }
})