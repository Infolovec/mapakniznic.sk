mapaKniznicApp.service("libraries", function(rawLibraryDataService, leafletMap, $timeout, uiState, removeDiacritics, Library) {
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

  Array.prototype.getUnique = function() {
    var o = {}, a = [], i, e;
    for (i = 0; e = this[i]; i++) {o[e] = 1};
    for (e in o) {a.push (e)};
    return a;
  }

  service.allLocations = function(){
    var allLocations = this._libraries.map(function(l){return l.city})
    return allLocations.getUnique().sort()
  }

  service.filter = function(libType, libLocation){
    return service.all().filter(function(library){
      var libTypeMatch = libType == 'all' || library.libraryType.indexOf(libType) > -1
      var libLocationMatch = libLocation == 'all' || library.city == libLocation
      return libTypeMatch && libLocationMatch
    })
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
