function LeafletMap() {
  this._markers = []

  this.initialize = function(){
    this._map = L.map('map')
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: '&copy; prispievatelia <a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,  © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      minZoom: 10,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoicGV0ZXJ2b2p0ZWsiLCJhIjoiY2lpc3V5eGNrMDA5dHc5bTAwejVuamZpYiJ9.Af2Lk6oEDNcJqGZ4Obbq_A'
    }).addTo(this._map);

    this.goToMapDefaultZoomAndPosition()
    this._map.on('zoomend', this.refreshMarkersAppearance.bind(this))
  }

  this.addMarker = function(libraryMarker){
    this._markers.push(libraryMarker)
    libraryMarker.addTo(this._map)
  }

  this.goToMapDefaultZoomAndPosition = function(){
    this._map.setView([48.1380, 17.1431], 12);
  }

  this.refreshMarkersAppearance = function(librariesToFitView){
    var mapZoom = this._map.getZoom()
    this._markers.forEach(function(libraryMarker){
      libraryMarker.updateAppearance(mapZoom)
    })

    if(librariesToFitView && librariesToFitView.length > 0){
      var leafletMarkers = librariesToFitView.map(function(library){
        return library.marker._marker
      })
      var group = new L.featureGroup(leafletMarkers);
      this._map.fitBounds(group.getBounds());
    }
  }

  this._radiusForCurrentZoomLevel = function() {
    return (this._map.getZoom() - 5)
  }

  this.focusTo = function(libraryMarker){
    this._map.setView([libraryMarker.lat, libraryMarker.lon], 14)
  }
}