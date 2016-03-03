/**
 * AngularJS
 */
var app 			= angular.module('mainModule', []);
var regexIso8601 	= /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

app.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData){
        convertDateStringsToDates(responseData);
        return responseData;
    });
}]);


app.controller('mainController', ["$scope", "$http", function($scope, $http) 
{
	$scope.method = 'GET';
    $scope.url = 'http://127.0.0.1:3000/clientes';
	
	function dataController($http, $scope) {
	    $scope.go = function () {
	        var request = queryServer($http, $scope.form);
	        request.then(function (response) {
	            $scope.isDate = response.data.date instanceof Date;
	            $scope.date = response.data.date;
	        });
	    };
	    $scope.go();
	};
	    
    
	// LISTA CLIENTES JSON
	$scope.lista = [];
	$http({method: $scope.method, url: $scope.url}).success(function(data) 
	{
		window.console.log('data', data);
		$scope.lista = data;
	});
	
}]);


function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}


function queryServer($http, responseData) {
    var json = encodeURIComponent(angular.toJson(responseData));
    var request = $http.post(
        '/echo/json/',
        'json=' + json, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    });
    return request;
}
