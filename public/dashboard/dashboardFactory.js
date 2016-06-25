(function(){
angular.module('DashBoard').factory("getPins",function($resource){
    return $resource('https://api.pinterest.com/v1/boards/mai06/food/pins/?access_token=AS3iVbi5Hdt4IWXEYnOy_reSL7DPFFshGM3youRDMhCAESAsoQAAAAA&fields=id%2Clink%2Curl%2Cmetadata%2Cimage',{},{
        query:{
            method:'JSONP',
            params:{callback:"JSON_CALLBACK"},
            callback:"JSON_CALLBACK"
        }
    });
});

})();