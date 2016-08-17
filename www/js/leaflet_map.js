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

    this._map.setView([48.1380, 17.1431], 12);
    this._map.on('zoomend', this._updateMarkersSizeAccordingToZoom.bind(this))
  }

  this.addMarker = function(marker){
    this._markers.push(marker)
    marker.addTo(this._map)
  }

  this.refreshView = function(){
    this._updateMarkersSizeAccordingToZoom()
  }

  this._radiusForCurrentZoomLevel = function() {
    return (this._map.getZoom() - 5)
  }

  this._updateMarkersSizeAccordingToZoom = function(){
    var that = this
    // $(this._markers).each(function(i, marker) {
    //   marker.setRadius(that._radiusForCurrentZoomLevel())
    // })

    var mapZoom = this._map.getZoom()
    if (mapZoom < 14) {
      var labelFontSizePercent = 120
      var labelOpacity = 0.0
    } else {
      var labelFontSizePercent = 120 - (18 - mapZoom) * 5
      var labelOpacity = 1.0 - (18 - mapZoom) * 0.075
    }

    var cssMarkerLabels = $('.markerLabel')
    cssMarkerLabels.each(function(i, label) {
      $(label).css({
        opacity: labelOpacity,
        'font-size': labelFontSizePercent + '%'
      })
    })
  }
  

}