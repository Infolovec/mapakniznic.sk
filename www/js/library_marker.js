function LibraryMarker() {
  this.initialize = function(uid, lat, lon, defaultColor, labelText){
    this._marker =  L.circleMarker([lat, lon], {zIzndex: 1})
    this._defaultColor = defaultColor
    this.setStyle('normal')
    this.uid = uid
    this.lat = lat
    this.lon = lon

    this._marker.bindLabel(labelText, {
      noHide: false,
      className: this.uid,
      opacity: 0.9,
      clickable: true,
    })   

    this._supportHightlightMarker = L.circleMarker([lat, lon], {
      radius: 0, 
      zIndex: 0,
      color: 'blue',
      fillColor: 'blue'})
  }

  this.addTo = function(map){
    this._supportHightlightMarker.addTo(map)
    this._supportHightlightMarker.on('click',this._markerClicked);
    this._marker.addTo(map)
    this._marker.on('click',this._markerClicked);
  } 

  this.setStyle = function(style){
    this._style = style
  }

  this.updateAppearance = function(mapZoom){
    var radius = mapZoom - 4

    if(this._style == 'highlight'){
      this._supportHightlightMarker.setStyle({radius: 30, fillOpacity: 0.2, opacity: 0.4})
      this._marker.setStyle({
        fillColor: this._defaultColor, 
        color: 'white', 
        fillOpacity: 1.0, 
        radius: radius
      })  
      
    } else if(this._style == 'normal'){
      this._marker.setStyle({fillColor: this._defaultColor, 
        color: 'white',
        radius: radius,
        fillOpacity: 0.8
      })
      this._supportHightlightMarker.setStyle({radius: 0})
    } else if(this._style == 'hide'){
      this._marker.setStyle({radius: 0})
      this._supportHightlightMarker.setStyle({radius: 0})
    }
  }

  this.setClickCallback = function(callback){
    this._markerClicked = callback
  }
}