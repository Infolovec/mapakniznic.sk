function LibraryMarker() {
  this.initialize = function(lat, lon, defaultColor, labelText){
    this._marker =  L.circleMarker([lat, lon], {})
    this._defaultColor = defaultColor
    this.setStyle('normal')

    this.uniqueLabelClass = 'L'+ parseInt(Math.random() * 100000)

    this._marker.bindLabel(labelText, {
      noHide: true,
      className: this.uniqueLabelClass,
      opacity: 1.0,
      clickable: true,
    })   
  }

  this.addTo = function(map){
    this._marker.addTo(map)
  } 

  this.setStyle = function(style){
    this._style = style
  }

  this.updateAppearance = function(mapZoom){

    var doShowLabel =  (this._style == 'normal' && mapZoom >= 14) || this._style == 'highlight'

    if (doShowLabel) {
      var labelFontSizePercent = 120 - (18 - mapZoom) * 5
      var labelOpacity = 1.0 - (18 - mapZoom) * 0.075
    } else {
      var labelFontSizePercent = 120
      var labelOpacity = 0.0
    }
    $('.' + this.uniqueLabelClass).css({
       'opacity': labelOpacity,
       'font-size': labelFontSizePercent + '%'
     })  

    if(this._style == 'highlight'){
      this._marker.setStyle({
        fillColor: this._defaultColor, 
        color: this._defaultColor, 
        fillOpacity: 0.8, 
        radius: 7
      })  
    } else if(this._style == 'normal'){
      this._marker.setStyle({fillColor: this._defaultColor, 
        color: 'grey',
        radius: 7,
        fillOpacity: 0.8
      })
    } else if(this._style == 'hide'){
      this._marker.setStyle({radius: 0})
    }
  }
}