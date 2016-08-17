function LibraryMarker() {
  this.initialize = function(lat, lon, defaultColor, labelText){
    this._marker =  L.circleMarker([lat, lon], {})
    this._defaultColor = defaultColor
    
    this.uniqueLabelClass = 'L'+ parseInt(Math.random() * 100000)

    this._marker.bindLabel(labelText, {
      noHide: true,
      className: this.uniqueLabelClass,
      opacity: 1.0,
      clickable: true,
    })   

    this.setDefaultStyle()
  }

  this.setDefaultStyle = function(){
    this._marker.setStyle({fillColor: this._defaultColor, 
      color: 'grey',
      radius: 7,
      fillOpacity: 0.8
    })
  }

  this.setHighlightStyle = function(){
    

    this._marker.setStyle({
      fillColor: this._defaultColor, 
      color: this._defaultColor, 
      fillOpacity: 0.8, 
      radius: 7})
  }

  this.hide = function(){
      this._marker.setStyle({radius: 0})
  }  

  this.addTo = function(map){
    this._marker.addTo(map)
  } 

  this.updateStyle = function(mapZoom){
    if (mapZoom < 14) {
      var labelFontSizePercent = 120
      var labelOpacity = 0.0
    } else {
      var labelFontSizePercent = 120 - (18 - mapZoom) * 5
      var labelOpacity = 1.0 - (18 - mapZoom) * 0.075
    }
    $('.' + this.uniqueLabelClass).css({
       'opacity': labelOpacity,
       'font-size': labelFontSizePercent + '%'
     })   

  }
}