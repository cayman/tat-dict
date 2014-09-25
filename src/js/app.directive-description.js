_tatApp.directive('tatDescription', function ($compile) {


    const regExpK =  new RegExp('<k>(.+?)</k>', 'ig');
    const regExpKrefLine = new RegExp('- <kref>(.+?)</kref>', 'ig');
    const regExpKref = new RegExp('<kref>(.+?)</kref>', 'ig');
    const regExpAbr = new RegExp('<abr>(.+?)</abr>', 'ig');
    const regExpNu = new RegExp('<nu /><nu />(.+?)<nu /><nu />', 'ig');


    return function(scope, element, attrs) {

        scope.$watch(attrs.tatDescription, function(input) {

            if(input) {

                var output = input;

                if (output) {
                    output = output.replace(regExpK, '<div class="term-name">$1</div>');
                    output = output.replace(regExpKrefLine, '<div>- <a class="term-link" ng-click="request.name = \'$1\'">$1</a></div>');
                    output = output.replace(regExpKref, '<a class="term-link" ng-click="request.name = \'$1\'">$1</a>');
                    output = output.replace(regExpAbr, '<abbr class="term-abbr" tat-abbr>$1</abbr>');
                    output = output.replace(regExpNu, '&#x301;$1');

                    output = output.replace(new RegExp('<co>', 'ig'), '<span class="term-comment">');
                    output = output.replace(new RegExp('</co>', 'ig'), '</span>');

                    output = output.replace(new RegExp('<c>', 'ig'), '<span class="term-color">');
                    output = output.replace(new RegExp('</c>', 'ig'), '</span>');

                    output = output.replace(new RegExp('<dtrn>', 'ig'), '<span class="term-description">');
                    output = output.replace(new RegExp('</dtrn>', 'ig'), '</span>');

                    output = output.replace(new RegExp('<ex>', 'ig'), '<span class="term-example">');
                    output = output.replace(new RegExp('</ex>', 'ig'), '</span>');

                    output = output.replace(new RegExp('<i>', 'ig'), '<i class="term-italic">');
                    output = output.replace(new RegExp('</i>', 'ig'), '</i>');
                }

                element.html(output);
                $compile(element.contents())(scope);
            }else{
                element.html('');
            }

        });

    };

});