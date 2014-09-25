//_tatApp.filter('tatDescription', function ($sce) {
//
////    var abbr = {
////        'разг.': 'разговорное',
////        'книжн.': 'книжное',
////        'прям.': 'прям.',
////        'перен.': 'перенесный смысл',
////        'уст.': 'устаревшее',
////        'лингв.': 'лингв.',
////        'филос.': 'филосовское',
////        'рел.': 'религиозное',
////        'физ.': 'физическое',
////        'геол.': 'геологическое',
////        'диал.': 'диал.',
////        'грам.': 'грамматическое',
////
////        'ф.': 'форма',
////        'см.': 'смотри',
////        'см. тж.': 'смотри также',
////        'тж.': 'также',
////
////        'перех.': '?имя действия',
////        'не перех.': '?имя действия',
////
////        'сущ.': 'существительное',
////        'прил.': 'прилагательное',
////        'союз': 'союз',
////        'нареч.': 'наречие',
////        'модальн. сл.': 'модальное слово',
////        'предик. сл.': 'предик. сл.',
////        'вводн. сл.': 'вводное слово',
////        'в знач.': 'в значении',
////        'в разн. знач.': 'в разн. значении',
////        'в знач. сущ.': 'в значении существительного',
////        'в знач. нареч.': 'в значении наречия',
////        'в знач. сказ.': 'в значении сказуемого',
////        'частица усил.': 'частица усиления',
////
////        'против.': 'против.',
////        'страд.': 'страдательное',
////        'пренебр.': 'пренебрежительно',
////        'мн.': 'множественное число',
////
////
////
////        'погов.': 'поговорка',
////        'в функ. сказ.': 'в функ. сказ.'
////
////
////
////    };
//
//
//    const regExpK =  new RegExp('<k>(.+)</k>', 'ig');
//    const regExpKref = new RegExp('<kref>(.+)</kref>', 'ig');
//    const regExpAbr = new RegExp('<abr>(.+)</abr>', 'ig');
//    const regExpNu = new RegExp('<nu /><nu />(.+)<nu /><nu />', 'ig');
//
//
//    return function (input, id) {
//        var output = input;
//        if(output) {
//            output = output.replace(regExpK, '<div class="term-name">$1</div>');
//            output = output.replace(regExpKref, '<a class="term-link" onClick="document.getElementsByName(\'word\')[0].value = \'$1\'">$1</a>');
//            output = output.replace(regExpAbr, '<abbr class="term-abbr">$1</abbr>');
//            output = output.replace(regExpNu, '&#x301;$1');
//
//            output = output.replace(new RegExp('<co>', 'ig'), '<span class="term-co">');
//            output = output.replace(new RegExp('</co>', 'ig'), '</span>');
//
//            output = output.replace(new RegExp('<c>', 'ig'), '<span class="term-c">');
//            output = output.replace(new RegExp('</c>', 'ig'), '</span>');
//
//            output = output.replace(new RegExp('<dtrn>', 'ig'), '<span class="term-description">');
//            output = output.replace(new RegExp('</dtrn>', 'ig'), '</span>');
//
//            output = output.replace(new RegExp('<ex>', 'ig'), '<span class="term-example">');
//            output = output.replace(new RegExp('</ex>', 'ig'), '</span>');
//
//            output = output.replace(new RegExp('<i>', 'ig'), '<i class="term-italic">');
//            output = output.replace(new RegExp('</i>', 'ig'), '</i>');
//            $sce.trustAsHtml(output);
//        }
//        return output;
//    }
//});