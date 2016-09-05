_tatApp.directive('tatAbbr', function ($log, tatApp, tatRest) {

    return function (scope, element, attrs) {

        var list = tatRest.getAbbreviations();
        list.$promise.then(function () {
            var text = element.text();
            var title = list ? list.find(function(abbr){ return abbr.name==text }) : null;
            if(title) {
//                $log.debug('abbr title:',title.description);
                element.attr('title', title.description);
            }
        });

    };

});