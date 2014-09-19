_tatApp.controller('DictionaryCtrl', function ($log, $scope, $timeout, tatGlossary, tatRest, tatApp, $modalInstance, data) {
    $log.log('DictionaryCtrl');

    var postId = data.post;
    $scope.images = tatApp.getImage('');
    $scope.icon = null;
    $scope.request = {};
    $scope.out = {};
    $scope.glossary = tatGlossary.get(postId);
    $scope.history = [];


    $scope.deleteSymbol = function () {
        if ($scope.request.name && $scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
    };

    $scope.restore = function () {
        if ($scope.request.name && $scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
    };





    $scope.copyText = function () {
        var subSearchText = tatApp.getSelectedText();
        if (subSearchText) {
            $scope.request.name = subSearchText;
        }
    };


    function search() {
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
        $scope.history.push($scope.request.name);

    }

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
                    search();
                }
            }, 900);
        }
    });

    //change selectbox

    function decodeDescription(value) {
        return value;
//        atob(CryptoJS.AES.decrypt($scope.out.raw, 'zarur',{
//              mode: mode,
//                padding: padding
//            }
    }

    $scope.$watch('out.selected', function (name, oldName) {
        if (name && name !== oldName) {
            $scope.out.term = tatApp.inArray($scope.out.like, { name: name }) || $scope.glossary[name];

//            if($scope.out.term) {
//                if (!$scope.out.term._description && $scope.out.term.description ) {
//                    $scope.out.term._description = decodeDescription($scope.out.term.description);
//                }
//                if (!$scope.out.term._parent_description && $scope.out.term._parent_description ) {
//                    $scope.out.term._parent_description = decodeDescription($scope.out.term._parent_description);
//                }
//            }
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
        search();
    }

});