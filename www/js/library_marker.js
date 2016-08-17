function LibraryMarker() {
  this.initialize = function(lat, lon, defaultColor){
    this._marker =  L.circleMarker([lat, lon], {})
    this._defaultColor = defaultColor
    
    this._marker.bindLabel(this.name, {
      noHide: true,
      className: 'markerLabel',
      opacity: 1.0,
      clickable: true
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

  this.getLeafletMarker = function(){
    return(this._marker)
  } 
}