mapaKniznicApp.factory('LibraryMarker', function(leafletMap){
  return function (){
    this.initialize = function(uid, libraryType, lat, lon, defaultColor, labelText){
      
      this._marker =  L.circleMarker([lat, lon], {
        radius: 10, 
        zIndex: 1,
        opacity: 1.0,
        fillOpacity: 1.0,
        color: defaultColor,
        fillColor: defaultColor})

      this._defaultColor = defaultColor
      this.setStyle('normal')
      this.uid = uid
      this.lat = lat
      this.lon = lon
      this.libraryType = libraryType

      this._marker.bindLabel(labelText, {
        noHide: false,
        className: this.uid + ' markerLabel',
        opacity: 0.9,
        clickable: true,
        offset: [15,-15]
      })   

      this._supportHightlightMarker = L.circleMarker([lat, lon], {
        radius: 0, 
        zIndex: 0,
        weight: 4,
        color: '#feffd5',
        fillColor: '#feffd5'})

      this._supportHightlightMarker.addTo(leafletMap.getMap())
      this._marker.addTo(leafletMap.getMap())
    }

    this._showOnMouseOverMarker = function(){
      this._onMouseOverMarker.setStyle({radius: 30, fillOpacity: 0.3, opacity: 0.9})
    }

    this._hideOnMouseOverMarker = function(){
      this._onMouseOverMarker.setStyle({radius: 0})
    }

    this.setStyle = function(style){
      this._style = style
    }

    this.onMapInitialized = function(){
      this._supportHightlightMarker.on('click',this._markerClicked);
      this._marker.on('click',this._markerClicked);
      var that = this
    }

    this.updateAppearance = function(mapZoom){
      var radius = mapZoom - 5
      highlightRadius = radius * 3

      if(this._style == 'highlight')
        this._supportHightlightMarker.setStyle({radius: highlightRadius, fillOpacity: 0.6, opacity: 0.9})
      else
        this._supportHightlightMarker.setStyle({radius: 0})
      
      this._marker.setStyle({radius: radius})
    }

    this.setClickCallback = function(callback){
      this._markerClicked = callback
    }
  }
})