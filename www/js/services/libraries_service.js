mapaKniznicApp.factory("libraries", function(rawLibraryDataService, leafletMap, $timeout, uiState, removeDiacritics) {
  var service = {_libraries: []}

  service.load = function(libraryUrlID){
    rawLibraryDataService.getAll().forEach(function(rawLibraryDataEntry) {
      var library = new Library(removeDiacritics)
      library.load(rawLibraryDataEntry)
      if(libraryUrlID == null || (libraryUrlID && libraryUrlID == library.url_id)){
        var libraryMarker = library.createMarker()
        libraryMarker.setClickCallback(function(){
            $timeout(function(){
              uiState.showLibraryDetail(library)
            })
        })

        leafletMap.addMarker(libraryMarker)
        service._libraries.push(library)
      }
    })

  }

  service.all = function(){
    return(this._libraries)
  }

  service.findLibraryByUrlID = function(libraryUrlID){
    return this._libraries.find(function(library){
      return (library.url_id == libraryUrlID)
    })
  }

  service.search = function(query){
    var q = removeDiacritics.replace(query.toLowerCase())
    results = this._libraries.filter(function(library){
      return(library.isMatchingSearchString(q))
    })

    return results
  }

  return service
})
