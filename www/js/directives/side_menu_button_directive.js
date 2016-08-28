mapaKniznicApp.directive('sideMenuButton', function(uiState) {
  return {
    restrict: 'E',
    scope: {
    },
    template: `
    <button class="button button-outline icon ion-navicon-round" 
      id="menuButton"
      ng-class="buttonIsPressed() ? 'active' : ''">
    </button>`,
    link: function($scope, element, attrs) {
      $scope.buttonIsPressed = function(){
        return(uiState.sideMenuIsVisible())
      }
    }    
  };
});