_tatApp.directive('tatAbbr', function ($log, tatApp, tatRest) {

    return function (scope, element, attrs) {

        var list = tatRest.getAbbreviations();
        list.$promise.then(function () {
            var title = tatApp.inArray(list,element.text(),true);
            if(title) {
                $log.debug('abbr title:',title.description);
                element.attr('title', title.description);
            }
        });

    };

});