_tatApp.controller('SidebarCtrl', function ($log, $scope, tatApp, tatGlossary, $location, $anchorScroll) {
    $log.log('SidebarCtrl:' + $scope.postId);

    $scope.dictConfig = tatApp.getConfig();
    $scope.glossary = null;

    $scope.$watch('postId', function (postId) {
        $log.info('postId:' + $scope.postId);
        $scope.glossary = tatGlossary.get(postId);
    });

    $scope.goToHighlight = function (name) {
        $location.hash(tatApp.getId(name));
        $anchorScroll();
    };

    $scope.openDictionary = function (text) {
        if ($scope.dictConfig.enabled) {
            tatApp.openDictionary($scope.postId, text || tatApp.getSelectedText());
        }
    };

});
