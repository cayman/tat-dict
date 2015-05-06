_tatApp.controller('DictionaryCtrl', function ($log, $scope, $timeout, tatGlossary, tatRest, tatApp, $modalInstance, data) {
    $log.log('DictionaryCtrl');

    var postId = data.post;
    $scope.images = tatApp.getPlugUrl('img/');
    $scope.icon = null;
    $scope.request = {};
    $scope.out = {};
    $scope.glossary = tatGlossary.get(postId);
    $scope.history = tatApp.getHistory();


    $scope.deleteSymbol = function () {
        if ($scope.request.name && $scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
    };

    $scope.restore = function () {
        var name = $scope.request.name;
        if($scope.history.length>0){
            $scope.request.name = $scope.history.pop();
            if($scope.request.name === name){
                $scope.request.name = $scope.history.pop();
            }
        }else{
            $scope.request.name = null;
        }
    };



    $scope.copyText = function () {
        var subSearchText = tatApp.getSelectedText();
        if (subSearchText) {
            $scope.request.name = subSearchText;
        }
    };

    $scope.goto = function (name) {
        $scope.request.name = name;
    };


    $scope.search = function() {
        if ($scope.glossary && ($scope.out.term = $scope.glossary[$scope.request.name])) {
            //found in glossary
            $log.debug('selected:', $scope.out.term.name);
            $scope.icon = 'in-glossary.png';
            $scope.out.selected = $scope.out.term.name;

        } else {
            //search in dictionary
            $log.debug('new search:', $scope.request);
            $scope.icon = 'load.gif';
            $scope.out = tatRest.search($scope.request,
                function objectsFound(value) {
                    if (value.term) {
                        $log.debug('found term:', $scope.out);
                        $scope.icon = 'found.png';
                        if (value.term.like) {
                            $scope.out.selected = value.term.name;
                        }
                    } else {
                        $log.debug('found like:', $scope.out);
                        $scope.icon = 'like.png';
                    }

                }, function objectsNotFound(result) {
                    $log.debug('not found:', result);
                    $scope.icon = 'not-found.png';

                });
        }

        if($scope.history.length === 0 || $scope.history[$scope.history.length - 1]!==$scope.request.name) {
            $scope.history.push($scope.request.name);
        }

    };

    $scope.hasGlossary = function(){
        return tatApp.size($scope.glossary)>0;
    };

    $scope.inGlossary = function(){
        return $scope.glossary && $scope.out.term && $scope.out.term === $scope.glossary[$scope.out.term.name];
    };


    var searchWord = null;
    //searching
    $scope.$watch('request.name', function (text, oldText) {
        if (text && text !== oldText) {
            searchWord = text;
            $timeout(function () {
                if (searchWord === $scope.request.name) {
                    $scope.search();
                }
            }, 1200);
        }
    });

    //change selectbox

    $scope.$watch('out.selected', function (name, oldName) {
        if (name && name !== oldName) {
            $scope.out.term = tatApp.inArray($scope.out.like, name ) || $scope.glossary[name];
        }
    });

    //closing

    $scope.close = function (result) {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        tatGlossary.save(postId, $scope.text, $scope.out.term);
        $modalInstance.close($scope.text);
    };

    $scope.delete = function () {
        tatGlossary.delete(postId, $scope.out.term);
        $modalInstance.close($scope.text);
    };


    if (data.text) {
        $scope.request.name = $scope.text = data.text;
        $scope.search();
    }

});