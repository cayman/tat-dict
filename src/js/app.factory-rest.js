_tatApp.factory('tatRest', function ($log, $resource) {
    $log.debug('tatRest');
    var ajaxUrl = './example.json';
    var ajaxNonce = null;

    if (angular.isObject(wpAjax)) {
        ajaxUrl = wpAjax.url;
        ajaxNonce = atob(wpAjax.nonce);
    }

    function decodeResponse(response, header) {
        if(response  &&  response.length>0 ){
            var first = response.trim().substr(0,1);
            if(first==='[' || first==='{') {
                return angular.fromJson(response);
            }else {
                $log.debug(response);
            }
        }
        return null;
    }

    return $resource(ajaxUrl, {}, {
        search: {params: {security: ajaxNonce, action: 'tatrus_search'}, cache: true,  transformResponse:  decodeResponse},
        getGlossary: {params: {security: ajaxNonce, action: 'tatrus_get_history'}, isArray: true,  transformResponse:  decodeResponse },
        addToGlossary: {params: {security: ajaxNonce, action: 'tatrus_save_history'} ,  transformResponse:  decodeResponse}
    });

});

