// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var mapaKniznicApp = angular.module('mapaKniznicApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

mapaKniznicApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('map', {
    url: "/map",
    controller: 'mapCtrl',
    templateUrl: "templates/map.html"
  })

  $urlRouterProvider.otherwise('/map');

})

mapaKniznicApp.controller('mapCtrl', function($scope, libraries) {
  var map = L.map('map')
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: '&copy; prispievatelia <a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,  © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    minZoom: 10,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicGV0ZXJ2b2p0ZWsiLCJhIjoiY2lpc3V5eGNrMDA5dHc5bTAwejVuamZpYiJ9.Af2Lk6oEDNcJqGZ4Obbq_A'
  }).addTo(map);

  map.setView([48.1380, 17.1431], 12);

  var markers = []
  libraries.getAll().forEach(function(rawLibraryData) {
    var library = new Library()
    library.load(rawLibraryData)
    var marker = library.createMarker()
    marker.addTo(map)
    markers.push(marker)
  })

  var radiusForCurrentZoomLevel = function() {
    return (map.getZoom() - 5)
  }

  var cssMarkerLabels = $('.markerLabel')

  var updateMarkersSize = function() {
    $(markers).each(function(i, marker) {
      marker.setRadius(radiusForCurrentZoomLevel())
    })

    if (map.getZoom() < 14) {
      var labelFontSizePercent = 120
      var labelOpacity = 0.0
    } else {
      var labelFontSizePercent = 120 - (18 - map.getZoom()) * 5
      var labelOpacity = 1.0 - (18 - map.getZoom()) * 0.075
    }

    cssMarkerLabels.each(function(i, label) {
      $(label).css({
        opacity: labelOpacity,
        'font-size': labelFontSizePercent + '%'
      })
    })
  }

  map.on('zoomend', updateMarkersSize)
  updateMarkersSize();
})