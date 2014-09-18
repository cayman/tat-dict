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
            $scope.out.term = $scope.glossary[$scope.request.name];

            if ($scope.out.term && $scope.out.term.id) {//found in glossary
                $scope.searchIcon = 'tat-search-icon-glossary';
                $log.debug('selected:', $scope.out.term.id, $scope.out.term.name);
                $scope.out.selectedId = $scope.out.term.id;

            } else {     //not found in glossary ,search in rest
                $scope.searchIcon = 'tat-search-icon-process';
                $log.debug('new search:', $scope.request);
                $scope.out = tatRest.search($scope.request,
                    function objectsFound(value) {
                        if (!value) {
                            $log.debug('not found');
                            $scope.searchIcon = 'tat-search-icon-error';

                        } else if (value.term) {
                            $log.debug('found term:', $scope.out);
                            $scope.searchIcon = 'tat-search-icon-success';
                            if (value.term.like) {
                                $scope.out.selected = value.term.name;
                            }

                        } else {
                            $log.debug('found like:', $scope.out);
                            $scope.searchIcon = 'tat-search-icon-like';
                        }

                    }, function objectsNotFound(result) {
                        $log.debug('not found:', result);
                        $scope.searchIcon = 'tat-search-icon-error';

                    });
            }
        } else {

            $scope.out.term = null;

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

    $scope.$watch('out.selected', function (name, oldName) {
        if (name && name !== oldName) {
            $scope.out.term = tatService.inArray($scope.out.like, { name: name }) || $scope.glossary[name];

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
            $scope.glossary[$scope.selectedText] = tatGlossary.save(postId, $scope.selectedText, $scope.out.term);
        }
        $modalInstance.close($scope.selectedText);
    };


    if (data.text) {
        $scope.request.name = $scope.selectedText = data.text;
        search();
    }


});