mapaKniznicApp.directive('listOfAllLibs', function($rootScope, uiState, libraries, libraryIcons) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'templates/_list_of_all_libs.html',
    link: function($scope, element, attrs) {  
      $scope.libraries = libraries
      
      $scope.hide = function(){
        uiState.hideListOfAllLibraries()
      }

      $scope.isVisible = function(){
        return(uiState.listOfAllLibrariesIsVisible())
      }  

      $scope.showLibraryDetail = function(library){
        var doClearSearchResults = true
        uiState.showLibraryDetail(library, doClearSearchResults)
      }

      $scope.libTypes = [
        {value: 'all', name: 'Všetky typy'},
        {value: 'verejná knižnica', name: 'Verejná knižnica'},
        {value: 'akademická knižnica', name: 'Akademická knižnica'},
        {value: 'špeciálna knižnica', name: 'Špeciálna knižnica'},
        {value: 'knižná búdka', name: 'Knižná búdka'},
        {value: 'bibliobox', name: 'Bibliobox'},
        {value: 'letná čitáreň', name: 'Letná čitáreň'}
      ]

      $scope.libLocations = [
        {value: 'all', name: 'Všetky lokality'},
        {value: 'Banská Bystrica', name: 'Banská Bystrica'},
        {value: 'Bratislava', name: 'Bratislava'},
        {value: 'Košice', name: 'Košice'}
      ]
      
      $scope.selected = {
        libType: $scope.libTypes[0].value,
        libLocation: $scope.libLocations[0].value,
      }
    }    
  };
});