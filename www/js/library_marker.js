function LibraryMarker() {
  this.initialize = function(uid, lat, lon, defaultColor, labelText){
    this._marker =  L.circleMarker([lat, lon], {zIzndex: 1})
    this._defaultColor = defaultColor
    this.setStyle('normal')
    this.uid = uid

    this._marker.bindLabel(labelText, {
      noHide: true,
      className: this.uid,
      opacity: 1.0,
      clickable: true,
    })   

    this._supportHightlightMarker = L.circleMarker([lat, lon], {
      radius: 0, 
      zIndex: 0,
      color: 'yellow',
      fillColor: 'yellow'})
  }

  this.addTo = function(map){
    this._supportHightlightMarker.addTo(map)
    this._marker.addTo(map)
    this._marker.on('click',this._markerClicked);
    $('.' + this.uid).click({}, this._markerClicked);    
  } 

  this.setStyle = function(style){
    this._style = style
  }

  this.updateAppearance = function(mapZoom){

    var doShowLabel =  (this._style == 'normal' && mapZoom >= 14) || this._style == 'highlight'

    if (doShowLabel) {
      var labelFontSizePercent = 120 - (18 - mapZoom) * 5
      var labelOpacity = 1.0 - (18 - mapZoom) * 0.075
      $('.' + this.uid).show()
      $('.' + this.uid).css({
        'opacity': labelOpacity,
        'font-size': labelFontSizePercent + '%'
      })  
    } else {
      $('.' + this.uid).hide()
    }

    if(this._style == 'highlight'){
      this._marker.setStyle({
        fillColor: this._defaultColor, 
        color: this._defaultColor, 
        fillOpacity: 1.0, 
        radius: 7
      })  

      this._supportHightlightMarker.setStyle({radius: 30, fillOpacity: 0.6, opacity: 0.8})
    } else if(this._style == 'normal'){
      this._marker.setStyle({fillColor: this._defaultColor, 
        color: 'grey',
        radius: 7,
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