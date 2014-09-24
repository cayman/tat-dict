_tatApp.filter('tatDescription', function () {

    var abbr = {
        'разг.': 'разговорное',
        'книжн.': 'книжное',
        'прям.': 'прям.',
        'перен.': 'перенесный смысл',
        'уст.': 'устаревшее',
        'лингв.': 'лингв.',
        'филос.': 'филосовское',
        'рел.': 'религиозное',
        'физ.': 'физическое',
        'геол.': 'геологическое',
        'диал.': 'диал.',
        'грам.': 'грамматическое',

        'ф.': 'форма',
        'см.': 'смотри',
        'см. тж.': 'смотри также',
        'тж.': 'также',

        'перех.': '?имя действия',
        'не перех.': '?имя действия',

        'сущ.': 'существительное',
        'прил.': 'прилагательное',
        'союз': 'союз',
        'нареч.': 'наречие',
        'модальн. сл.': 'модальное слово',
        'предик. сл.': 'предик. сл.',
        'вводн. сл.': 'вводное слово',
        'в знач.': 'в значении',
        'в разн. знач.': 'в разн. значении',
        'в знач. сущ.': 'в значении существительного',
        'в знач. нареч.': 'в значении наречия',
        'в знач. сказ.': 'в значении сказуемого',
        'частица усил.': 'частица усиления',

        'против.': 'против.',
        'страд.': 'страдательное',
        'пренебр.': 'пренебрежительно',
        'мн.': 'множественное число',



        'погов.': 'поговорка',
        'в функ. сказ.': 'в функ. сказ.'



    };
    return function (input) {
        var output = input;
        if(output) {
            output = output.replace(new RegExp('<k>(.+)</k>', 'ig'), '<div class="term-name">$1</div>');
            output = output.replace(new RegExp('<kref>(.+)</kref>', 'ig'), '<a class="term-link" ng-click="goto(\'$1\')">$1</a>');

            output = output.replace(new RegExp('<co>', 'ig'), '<span class="term-co">');
            output = output.replace(new RegExp('</co>', 'ig'), '</span>');

            output = output.replace(new RegExp('<c>', 'ig'), '<span class="term-c">');
            output = output.replace(new RegExp('</c>', 'ig'), '</span>');

            output = output.replace(new RegExp('<abr>', 'ig'), '<abbr class="term-abbr">');
            output = output.replace(new RegExp('</abr>', 'ig'), '</abbr>');



            output = output.replace(new RegExp('<dtrn>', 'ig'), '<span class="term-description">');
            output = output.replace(new RegExp('</dtrn>', 'ig'), '</span>');

            output = output.replace(new RegExp('<ex>', 'ig'), '<span class="term-example">');
            output = output.replace(new RegExp('</ex>', 'ig'), '</span>');

            output = output.replace(new RegExp('<i>', 'ig'), '<i class="term-italic">');
            output = output.replace(new RegExp('</i>', 'ig'), '</i>');
        }
        return output;
    }
});