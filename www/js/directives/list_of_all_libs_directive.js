mapaKniznicApp.directive('listOfAllLibs', function($rootScope) {
  return {
    restrict: 'E',
    scope: {
      libraries: '=libraries'
    },
    templateUrl: 'templates/_list_of_all_libs.html',
    link: function($scope, element, attrs) {  
      $scope.$on('showListOfAllLibraries', function() {
        $scope.isVisible = true 
      });   

      $scope.hide = function(){
        $scope.isVisible = false  
      }

      $scope.isVisible = false  

      $scope.listOfAllLibsFilter = null
      $scope.applyFilterListOfLibs = function(libType){
        $scope.listOfAllLibsFilter = libType
      }

      $scope.listOfLibsFilterEqualsTo = function(libType){
        return($scope.listOfAllLibsFilter == libType)
      }

      $scope.isLibraryMatchingFilter = function(library){
        if($scope.listOfAllLibsFilter){
          return(library.libraryType == $scope.listOfAllLibsFilter)
        } else 
          return true
      } 

      $scope.showLibraryDetail = function(library){
        $scope.isVisible = false  
        library.marker.click()
        $rootScope.$broadcast('clearSearchResults')
      }
    }    
  };
});