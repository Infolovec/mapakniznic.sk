mapaKniznicApp.controller('mapCtrl', function($scope, $stateParams, $timeout, $location, $window, rawLibraryDataService, removeDiacritics) {
  $scope.search = {query: ''}
  $scope.searchFoundLibraries = []
  $scope.libraries = []

  $scope.$on('clearSearchResults', function(event) {
    $scope.clearSearch()
 });  

  $scope.clearSearch = function(){
    $scope.searchFoundLibraries = []
    $scope.search.query = ''
    $scope.$broadcast('updateLibraryMarkersAppearance');
    $scope.$broadcast('hideLibraryDetail');
    manuallySelectedLibrary = null
  }

  $scope.doSearch = function(){
    $scope.$broadcast('hideLibraryDetail');
    manuallySelectedLibrary = null
    if($scope.search.query.length > 2){
      $scope.searchFoundLibraries = $scope.libraries.filter(function(library){
        var q = removeDiacritics.replace($scope.search.query.toLowerCase())
        return(library.isMatchingSearchString(q))
      })
    } else 
      $scope.searchFoundLibraries = []

    if($scope.searchFoundLibraries.length == 1)
      $scope.$broadcast('showLibraryDetail', $scope.searchFoundLibraries[0]);

    $scope.$broadcast('updateLibraryMarkersAppearance')
    document.getElementById('searchField').blur() // hide smartphone keyboard
  }

  var manuallySelectedLibrary = null

  $scope.$on('updateLibraryMarkersAppearance', function(event) {
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
  })

  var leafletMap = new LeafletMap()
  leafletMap.initialize()
  rawLibraryDataService.getAll().forEach(function(rawLibraryDataEntry) {
    var library = new Library(removeDiacritics)
    library.load(rawLibraryDataEntry)
    
    var libraryMarker = library.createMarker()
    libraryMarker.setClickCallback(function(){
      manuallySelectedLibrary = library
      
        $timeout(function(){
          $scope.$broadcast('showLibraryDetail', library);
        })

      $scope.$broadcast('updateLibraryMarkersAppearance');
      leafletMap.focusTo(libraryMarker)
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