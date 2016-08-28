mapaKniznicApp.factory("uiState", function($rootScope, $location, leafletMap) {
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
    $location.path('/'+this._displayedLibraryDetail.nameForURL);
    $rootScope.$broadcast('updateLibraryMarkersAppearance');
    leafletMap.focusTo(library.marker)
  }

  service.currentlyDisplayedLibraryDetail = function(){
    return(service._displayedLibraryDetail)
  }

  service.hideLibraryDetail = function(){
    this._displayedLibraryDetail = null
    $rootScope.$broadcast('updateLibraryMarkersAppearance');
    $location.path('/');
  }

  service.isLibraryDetailVisible = function(library){
    return(this._displayedLibraryDetail && library && this._displayedLibraryDetail.uid == library.uid)
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
    $location.path('/');    
  }

  return service
})