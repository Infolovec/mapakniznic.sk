mapaKniznicApp.service("uiState", function($rootScope, $location, leafletMap, metaInfoService) {
  var service = {
    _sideMenuIsVisible: false,
    _displayedLibraryDetail: null,
    _listOfAllLibrariesVisible: false,
    _searchFoundLibraries: []
  }

  $rootScope.$on('changeSideMenuVisibility', function(broadcastEvent, clickEvent) {
    if((clickEvent.target.id == 'menuButton'))
      service._sideMenuIsVisible = !service._sideMenuIsVisible
    else 
      service._sideMenuIsVisible = false
  });  

  service.sideMenuIsVisible = function(){
    return(this._sideMenuIsVisible)
  }

  service.enableEmbeddedMode = function(){
    this._embededModeEnabled = true
  }

  service.inEmbeddedMode = function(){
    return this._embededModeEnabled
  }

  service.listOfAllLibrariesIsVisible = function(){
    return(this._listOfAllLibrariesVisible)
  }

  service.showListOfAllLibraries = function(){
    this._listOfAllLibrariesVisible = true
    this._sideMenuIsVisible = false
  }

  service.hideListOfAllLibraries = function(){
    this._listOfAllLibrariesVisible = false
  }

  service.showLibraryDetail = function(library, doClearSearchResults){
    if(doClearSearchResults)
      this.clearSearch()
    this._sideMenuIsVisible = false
    this._listOfAllLibrariesVisible = false
    
    this._displayedLibraryDetail = library
    $location.path('/'+this._displayedLibraryDetail.url_id);
    $location.hash(this._displayedLibraryDetail.url_name)
    metaInfoService.update(library)
    $rootScope.$broadcast('updateLibraryMarkersAppearance');
    leafletMap.focusTo(library.marker)
  }

  service.showLibraryDetailInEmbeddedMode = function(library){
    leafletMap.focusTo(library.marker)
    library.marker.setStyle('highlight')
    this._displayedLibraryDetail = library
    $rootScope.$broadcast('updateLibraryMarkersAppearance');
  }

  service.currentlyDisplayedLibraryDetail = function(){
    return(service._displayedLibraryDetail)
  }

  service.hideLibraryDetail = function(){
    this._displayedLibraryDetail = null
    $rootScope.$broadcast('updateLibraryMarkersAppearance');
    metaInfoService.reset()
    $location.path('/');
    $location.hash('')
  }

  service.searchFoundLibraries = function(){
    return(this._searchFoundLibraries)
  }

  service.setSearchFoundLibraries = function(a){
    this._displayedLibraryDetail = null
    this._listOfAllLibrariesVisible = false
    this._searchFoundLibraries = a
    if(this._searchFoundLibraries.length == 1)
      service.showLibraryDetail(this._searchFoundLibraries[0])
    $rootScope.$broadcast('updateLibraryMarkersAppearance');
  }

  service.clearSearch = function(){
    this._searchFoundLibraries = []
    this._displayedLibraryDetail = null
    $rootScope.$broadcast('updateLibraryMarkersAppearance');
    $rootScope.$broadcast('clearSearchQuery');
    metaInfoService.reset()
    $location.path('/');   
    $location.hash('') 
  }

  return service
})