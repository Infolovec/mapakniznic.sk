function LibraryMarker() {
  this.initialize = function(uid, lat, lon, defaultColor, labelText){
    
    this._marker =  L.marker([lat, lon], {zIzndex: 1, icon: this._icon(defaultColor)})

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
      color: '#feffd5',
      fillColor: '#feffd5'})
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
    var iconSize = mapZoom * 2.5 - 11

    if(this._style == 'highlight'){
      this._supportHightlightMarker.setStyle({radius: 30, fillOpacity: 0.6, opacity: 0.9})
      
    } else if(this._style == 'normal'){
      this._supportHightlightMarker.setStyle({radius: 0})
    } else if(this._style == 'hide'){
      iconSize = 0
      this._supportHightlightMarker.setStyle({radius: 0})
    }

    this._marker.setIcon(this._icon(iconSize))  
  }

  this.setClickCallback = function(callback){
    this._markerClicked = callback
  }

  this.click = function(){
    this._markerClicked()
  }

  this._icon = function(iconSize){
    var color = this._defaultColor
    var iconImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 490 490" style="enable-background:new 0 0 490 490;" xml:space="preserve" width="512px" height="512px"><g><g><g><path d="M373.3,120.7C373.3,54.6,315.8,1,245,1S116.7,54.6,116.7,120.7c0,1.6,0,3.1,0,4.7l128.3,28l128.3-28     C373.3,123.9,373.3,122.3,373.3,120.7z" fill="`+color+`"/><ellipse cx="466.3" cy="286.4" rx="23.7" ry="50.2" fill="`+color+`"/><ellipse cx="23.7" cy="286.4" rx="23.7" ry="50.2" fill="`+color+`"/><path d="M23.7,216.4L23.7,216.4c25.3,0,43.6,29.6,43.6,70s-18.3,70-43.6,70l0,0v86.3L234.9,489V171.7L23.7,125.4V216.4z" fill="`+color+`"/><path d="M422.7,286.4c0-40.4,18.3-70,43.6-70v-91l-211.2,46.3v317l211.2-46.3V356C441,356,422.7,326.9,422.7,286.4z" fill="`+color+`"/></g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`

    return L.icon({
      iconUrl: iconImg.replace(/\#/g, '%23'),
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize/2, iconSize/2]
    })
  }
}