function LibraryMarker() {
  this.initialize = function(uid, libraryType, lat, lon, defaultColor, labelText){
    
    this._marker =  L.marker([lat, lon], {zIndex: 1, icon: this._icon(defaultColor)})

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
      offset: [22,-15]
    })   

    this._supportHightlightMarker = L.circleMarker([lat, lon], {
      radius: 0, 
      zIndex: 0,
      weight: 4,
      color: '#feffd5',
      fillColor: '#feffd5'})

    this._onMouseOverMarker = L.circleMarker([lat, lon], {
      radius: 0, 
      zIndex: 0,
      color: '#feffd5',
      weight: 4,
      dashArray: '15, 8',
      lineCap: 'square',
      fillColor: '#feffd5'})
  }

  this._showOnMouseOverMarker = function(){
    this._onMouseOverMarker.setStyle({radius: 30, fillOpacity: 0.3, opacity: 0.9})
  }

  this._hideOnMouseOverMarker = function(){
    this._onMouseOverMarker.setStyle({radius: 0})
  }

  this.addTo = function(map){
    this._supportHightlightMarker.addTo(map)
    this._supportHightlightMarker.on('click',this._markerClicked);
    this._marker.addTo(map)
    this._marker.on('click',this._markerClicked);
    this._onMouseOverMarker.addTo(map)
    var that = this
    this._marker.on('mouseover', this._showOnMouseOverMarker.bind(this));
    this._marker.on('mouseout', this._hideOnMouseOverMarker.bind(this));
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

  this._icon = function(iconSize){
    return L.icon({
      iconUrl: this._getIconImg(),
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize/2, iconSize/2]
    })
  }

  this._getIconImg = function(){
    
    var libraryTypeToImg = {
      'špeciálna knižnica' : this._libraryBuildingImg(),
      'vedecká knižnica': this._libraryBuildingImg(),
      'akademická knižnica': this._libraryBuildingImg(),
      'verejná knižnica': this._libraryBuildingImg(),
      'letná čitáreň': this._summerReadImg(),
      'bibliobox': this._biblioboxImg(),
      'knižná búdka': this._bookBoxImg()
    }

    var iconImg = libraryTypeToImg[this.libraryType]
    if(iconImg == null)
      iconImg = this._libraryBuildingImg()

    return iconImg.replace(/\#/g, '%23')
  }

  this._libraryBuildingImg = function(){
    var color = this._defaultColor
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 495.398 495.398" style="enable-background:new 0 0 495.398 495.398;" xml:space="preserve"><g>	<g>		<g>			<path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391     v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158     c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747     c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z" fill="`+color+`"/>			<path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401     c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79     c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z" fill="`+color+`"/>		</g>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`
  }

  this._summerReadImg = function(){
    var color = this._defaultColor
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 490 490" style="enable-background:new 0 0 490 490;" xml:space="preserve" width="512px" height="512px"><g><g><g><path d="M373.3,120.7C373.3,54.6,315.8,1,245,1S116.7,54.6,116.7,120.7c0,1.6,0,3.1,0,4.7l128.3,28l128.3-28     C373.3,123.9,373.3,122.3,373.3,120.7z" fill="`+color+`"/><ellipse cx="466.3" cy="286.4" rx="23.7" ry="50.2" fill="`+color+`"/><ellipse cx="23.7" cy="286.4" rx="23.7" ry="50.2" fill="`+color+`"/><path d="M23.7,216.4L23.7,216.4c25.3,0,43.6,29.6,43.6,70s-18.3,70-43.6,70l0,0v86.3L234.9,489V171.7L23.7,125.4V216.4z" fill="`+color+`"/><path d="M422.7,286.4c0-40.4,18.3-70,43.6-70v-91l-211.2,46.3v317l211.2-46.3V356C441,356,422.7,326.9,422.7,286.4z" fill="`+color+`"/></g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`
  }

  this._biblioboxImg = function(){
    var color = this._defaultColor
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 323.66 323.66" style="enable-background:new 0 0 323.66 323.66;" xml:space="preserve" width="512px" height="512px"><g id="XMLID_85_">	<path id="XMLID_86_" d="M299.232,252.99c4.641-2.68,7.5-7.631,7.5-12.99V98.66l-129.902,75v150L299.232,252.99z" fill="`+color+`"/>	<path id="XMLID_87_" d="M16.928,240c0,5.359,2.859,10.311,7.5,12.99l122.402,70.67v-150l-129.902-75V240z" fill="`+color+`"/>	<path id="XMLID_88_" d="M154.33,2.01L31.928,72.68l129.902,75l129.902-75L169.33,2.01C164.689-0.67,158.971-0.67,154.33,2.01z" fill="`+color+`"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`
  }

  this._bookBoxImg = function(){
    var color = this._defaultColor
    return`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 984.099 984.1" style="enable-background:new 0 0 984.099 984.1;" xml:space="preserve"><g>	<path d="M114.387,325.1l540.601,230.8c28.699,12.199,60.5-8.801,60.5-40V51.7c0-31.2-32-52.3-60.7-39.9l-540.5,233.5   C79.187,260.4,79.287,310.2,114.387,325.1z" fill="`+color+`"/>	<path d="M851.087,0h-20c-24.9,0-45,20.1-45,45v894.1c0,24.9,20.1,45,45,45h20c24.9,0,45-20.1,45-45V45   C896.087,20.1,875.988,0,851.087,0z" fill="`+color+`"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`
  }
}