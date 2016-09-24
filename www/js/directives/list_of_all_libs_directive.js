mapaKniznicApp.directive('listOfAllLibs', function($rootScope, uiState, libraries) {
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

      $scope.listOfAllLibsFilter = null
      $scope.applyFilterListOfLibs = function(libType){
        $scope.listOfAllLibsFilter = libType
      }

      $scope.listOfLibsFilterEqualsTo = function(libType){
        return($scope.listOfAllLibsFilter == libType)
      }

      $scope.isLibraryMatchingFilter = function(library){
        if($scope.listOfAllLibsFilter){
          return(library.libraryType.indexOf($scope.listOfAllLibsFilter) > -1)
        } else 
          return true
      } 

      $scope.showLibraryDetail = function(library){
        var doClearSearchResults = true
        uiState.showLibraryDetail(library, doClearSearchResults)
      }
    }    
  };
});