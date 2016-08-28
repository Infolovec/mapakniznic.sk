mapaKniznicApp.directive('topBarWithSearch', function($rootScope, uiState, libraries) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'templates/_search.html',
    link: function($scope, element, attrs) {
      $scope.search = {query: ''}
      $scope.searchFoundLibraries = function(){
        return(uiState.searchFoundLibraries())
      }

      $scope.$on('clearSearchQuery', function(event) {
        $scope.search.query = ''
      })

      $scope.clearSearch = function(){
        uiState.clearSearch()
        $scope.search.query = ''
      }

      $scope.doSearch = function(){
        var results = []
        if($scope.search.query.length > 2){
          results = libraries.search($scope.search.query)
        }
        
        uiState.setSearchFoundLibraries(results)
        document.getElementById('searchField').blur() // hide smartphone keyboard
      }
    }    
  };
});