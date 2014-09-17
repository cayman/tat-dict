_tatApp.controller('DictionaryCtrl', function ($log, $scope, $timeout, tatGlossary, tatRest, tatService, $modalInstance, data) {
    $log.log('DictionaryCtrl');

    var postId = data.post;
    $scope.selectedText = null;
    $scope.searchIcon = 'tat-search-icon-empty';
    $scope.glossary = tatGlossary.get(postId);

    $scope.request = {};
    $scope.out = {};


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
        var subSearchText = tatService.getSelectedText();
        if (subSearchText) {
            $scope.request.name = subSearchText;
        }
    };

    function search() {
        if ($scope.request.name) {
            $scope.out.term = tatService.inArray($scope.glossary, { name: $scope.request.name }, true);

            if (!$scope.out.term) {
                $scope.searchIcon = 'tat-search-icon-process';
                $log.debug('new search:', $scope.request);
                $scope.out = tatRest.search($scope.request,
                    objectsFound,
                    objectsNotFound);
            } else {
                $scope.searchIcon = 'tat-search-icon-glossary';
                $log.debug('selected:', $scope.out.term.id, $scope.out.term.name);
                $scope.out.selectedId = $scope.out.term.id;

            }
        } else {
            $scope.out.term = null;
        }
    }

    //Error ajax loaded
    function objectsNotFound(result) {
        $scope.searchIcon = 'tat-search-icon-error';
        $log.debug('not found:', result);
    }

    //Success ajax loaded
    function objectsFound(value) {
        var hasLike = (value.like && value.like.length);
        if (value.term || hasLike) {
            $log.debug('found:', $scope.out);
            $scope.out = value;
            $scope.searchIcon = $scope.out.term ? 'tat-search-icon-success' : 'tat-search-icon-like';

            if ($scope.out.term && hasLike) {
                $scope.out.selectedId = $scope.out.term.id;
            }

        } else {
            objectsNotFound(value);
        }
    }

    var searchWord = null;
    //searching
    $scope.$watch('request.name', function (text, oldText) {
        if (text && text !== oldText) {
            searchWord = text;
            $timeout(function () {
                if (searchWord === text) {
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

    $scope.$watch('out.selectedId', function (newId, oldId) {
        if (newId && newId !== oldId) {
            $scope.out.term = tatService.inArray($scope.out.like, { id: newId }) ||
                tatService.inArray($scope.glossary, { id: newId });

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
        if ($scope.glossary && $scope.selectedText) {
            tatGlossary.add(postId, $scope.selectedText, $scope.out.term);
        }
        $modalInstance.close($scope.selectedText);
    };


    if (data.text) {
        $scope.request.name = $scope.selectedText = data.text;
        search();
    }


});