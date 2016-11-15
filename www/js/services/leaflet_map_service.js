mapaKniznicApp.service("leafletMap", function() {
  var service = {
    _markers: [],
    initialize: function(){
      this._map = L.map('map', {maxBounds: [[46.1656,15.3726], [50.428, 25.966]]})
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg?access_token={accessToken}', {
        attribution: '&copy; prisp. <a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,  © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        minZoom: 8,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicGV0ZXJ2b2p0ZWsiLCJhIjoiY2lpc3V5eGNrMDA5dHc5bTAwejVuamZpYiJ9.Af2Lk6oEDNcJqGZ4Obbq_A'
      }).addTo(this._map);

      this._map.on('zoomend', this.refreshMarkersAppearance.bind(this))

      if (!this._map.restoreView()) {
        this._map.setView([48.1380, 17.1431], 12);
      }
    },

    addMarker: function(libraryMarker){
      this._markers.push(libraryMarker)
      libraryMarker.onMapInitialized()
    },

    refreshMarkersAppearance: function(librariesToFitView){
      var mapZoom = this._map.getZoom()
      this._markers.forEach(function(libraryMarker){
        libraryMarker.updateAppearance(mapZoom)
      })

      if(librariesToFitView && librariesToFitView.length > 0){
        var leafletMarkers = librariesToFitView.map(function(library){
          return library.marker._marker
        })
        var group = new L.featureGroup(leafletMarkers);
        this._map.fitBounds(group.getBounds(), {maxZoom: 15});
      }
    },

    focusTo: function(libraryMarker){
      var mapZoom = this._map.getZoom()
      var maxZoom = 15
      if(mapZoom > 15)
        maxZoom = mapZoom
      var group = new L.featureGroup([libraryMarker._marker]);
      this._map.fitBounds(group.getBounds(),{
          paddingBottomRight: L.point(window.innerWidth/4, window.innerHeight/2),
          maxZoom: maxZoom
        });
    },

    getMap: function(){
      return this._map
    }
  }
  return service
})
