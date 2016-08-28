mapaKniznicApp.directive('sideMenuButton', function() {
  return {
    restrict: 'E',
    scope: {
    },
    template: `
    <button class="button button-outline icon ion-navicon-round" 
      id="menuButton"
      ng-class="buttonIsPressed ? 'active' : ''">
    </button>`,
    link: function($scope, element, attrs) {
      $scope.buttonIsPressed = false
      $scope.$on('changeSideMenuButtonAppearance', function(broadcastEvent, isPressed) {
        $scope.buttonIsPressed = isPressed
      });
    }    
  };
});