_tatApp.directive('highlight', function ($log, tatApp) {
    $log.debug('directive.highlight');
    return function (scope, element, attrs) {

            element.attr('id',tatApp.getId(attrs.name));
            element.addClass('tat-highlight');

            scope.$watch('glossary["'+attrs.name+'"]', function (value) {
                if(value) {
                   // $log.debug('changed',attrs.name);
                    element.toggleClass('tat-highlight-process', value.$resolved === false);
                    element.toggleClass('tat-highlight-dirty', !value.id);
                }
            },true);

            element.on('click', function () {
                scope.open(attrs.name);
            });

            element.on('mouseover', function () {
                element.addClass('tat-highlight-over');
            });

            element.on('mouseout', function () {
                element.removeClass('tat-highlight-over');
            });

    };
});
