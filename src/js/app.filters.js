_tatApp.filter('highlightClass',function(){
    return function(term) {
        return {
            'tat-highlight-process': term.$resolved === false,
            'tat-highlight-dirty': term.$resolved === true && !term.id,
            'tat-highlight': !term.$resolved || term.$resolved === true && term.id
        };
    }
});


