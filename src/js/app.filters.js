_tatApp.filter('notEmpty', function () {
        return function (obj) {
            if(angular.isObject(obj)) {
                for (var field in obj) {
                    if (obj.hasOwnProperty(field)) {
                        return true;
                    }
                }
                return false;
            }else if (angular.isArray(obj)){
                return obj.length>0;
            }else {
                return !!obj;
            }

        };
    });