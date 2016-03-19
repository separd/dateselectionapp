var app = angular.module("dateselectionguru", ['ngMaterial', 'ngRoute', 'materialCalendar', 'pascalprecht.translate', 'ngStorage', 'hamburgerHelper', 'ngAstro']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme("default")
        .primaryPalette("brown")
        .accentPalette("red");
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'pages/calendar.html',
        controller: 'calendarCtrl'
      }).
      when('/day/:date', {
        templateUrl: 'pages/day.html',
        controller: 'dayCtrl'
      }).
      when('/person-list', {
        templateUrl: 'pages/person-list.html',
        controller: 'personCtrl'
      }).
      when('/language', {
        templateUrl: 'pages/language.html',
        controller: 'languageCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);

app.directive('homeLink', function() {
        return {
            restrict: 'AC',
            link: function($scope, $element) {
                $element.bind('click', function() {
                    setTimeout(function(){
                        document.location.href='#'
                    }, 250);
                })
            }
        };
});

app.directive('menuToggle', function() {
        return {
            restrict: 'AC',
            link: function($scope, $element) {
                $element.bind('click', function() {
                    var drawer = angular.element(document.querySelector('.mdl-layout__drawer'));
                    if(drawer) {
                        drawer.toggleClass('is-visible');
                    }
                });
            }
        };
});

app.config(function ($translateProvider) {
  $translateProvider.translations('en', $tranlationEN);
  $translateProvider.translations('sk', $tranlationSK);
  $translateProvider.preferredLanguage('en');
});

app.controller("calendarCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage, $mdBottomSheet, $astro) {
    $scope.selectedPerson = 2

    $scope.menuarrow = true;
    $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
    });
    $translate.use($scope.$storage.locale.lang);

    $scope.activities = activities;

    $scope.personlist = $scope.$storage.personlist;
    $scope.selectedPerson = (typeof $rootScope.selectedPerson == 'number')?  $rootScope.selectedPerson : 'generaly';
    $scope.selectedActivity = $rootScope.selectedActivity || 'any';

    $scope.groupList = $scope.activities.reduce(function(previous, current) {
        if (previous.indexOf(current.group) === -1) {
            previous.push(current.group);
        }
        return previous;
    }, []);

	// CALENDAR

    $scope.selectedDate = null;
    $scope.weekStartsOn = $scope.$storage.locale.weekstart;
    $scope.dayFormat = "d";
    $scope.tooltips = true;
    $scope.disableFutureDates = false;

    $scope.setDirection = function(direction) {
        $scope.direction = direction;
        $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };

    $scope.dayClick = function(date) {
        document.location.href='#/day/' + $filter("date")(date, "yyyy-MM-dd");
    };

    $scope.prevMonth = function(data) {
        $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
    };

    $scope.nextMonth = function(data) {
        $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
    };

    $scope.setContentViaService = function() {
        var today = new Date();
        MaterialCalendarData.setDayContent(today, '<span> :oD </span>')
    }

    $scope.activitySelect = function(activity) {
        $scope.selectedActivity = activity;
        $rootScope.selectedActivity = activity;
        angular.forEach(MaterialCalendarData.data, function(value, key) {
            var date = new Date(key);
            dayValue = $astro.getRating(date, activity.name);
            MaterialCalendarData.setDayContent(date, getDayHtml(dayValue));
        });
    }
    
    $scope.personSelect = function(person) {
        $scope.selectedPerson = person;
        $rootScope.selectedPerson = person;
        if (person == 'add') {
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'addPersonCtrl'
            }).then(function(newPerson){
                if (newPerson > 0) {
                    $scope.selectedPerson = newPerson;
                } else {
                    $scope.selectedPerson = 'generaly';
                }
            }, function() {
                $scope.selectedPerson = 'generaly';
            });
        }
        /*angular.forEach(MaterialCalendarData.data, function(value, key) {
            var date = new Date(key);
            dayValue = getRating(date, activity.name);
            MaterialCalendarData.setDayContent(date, getDayHtml(dayValue));
        });*/
    }

    function getDayHtml(dayData) {

        dayHTML = '<div class="daydata">';
        if (dayData.filter > 0) {
            dayHTML += '<div class="activity activity' + dayData.filter + '"></div>';
        }
        
        stars = $astro.getStars(dayData.rating);          
        ratingClass = (dayData.rating < 0)? 'negative' : 'positive';
        ratingPerc = Math.abs(stars) * 20;
        dayHTML += '<div class="ratingwrap" title="' + dayData.rating + '"><div class="ratingval ratingval' + ratingPerc + ' ' + ratingClass + '"></div></div>';

        dayHTML += '</div>';

        return dayHTML;
    }

    $scope.setDayContent = function(date) {
        activity = ($scope.selectedActivity != 'any')? $scope.selectedActivity.name : null;
        dayData = $astro.getRating(date, activity);
        return getDayHtml(dayData);
        /*if (!$scope.selectedActivity) {
            return 0;
        } else {
            dayValue = $astro.getRating(date, $scope.selectedActivity.name);
            return getDayHtml(dayValue);
        }*/
    };

});

app.controller("dayCtrl", function($scope, $rootScope, $routeParams, $filter, $translate, MaterialCalendarData,  $localStorage, $mdBottomSheet, $astro) {
    $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
    });
    $translate.use($scope.$storage.locale.lang);

    $scope.date = $routeParams.date;

    $scope.activities = activities;

    $scope.personlist = $scope.$storage.personlist;

    $scope.selectedPerson = (typeof $rootScope.selectedPerson == 'number')?  $rootScope.selectedPerson : 'generaly';
    $scope.selectedActivity = $rootScope.selectedActivity || 'any';

    $scope.groupList = $scope.activities.reduce(function(previous, current) {
        if (previous.indexOf(current.group) === -1) {
            previous.push(current.group);
        }
        return previous;
    }, []);

    $scope.activitySelect = function(activity) {
        $scope.selectedActivity = activity;
        $rootScope.selectedActivity = activity;
        /*angular.forEach(MaterialCalendarData.data, function(value, key) {
            var date = new Date(key);
            dayValue = $astro.getRating(date, activity.name);
            MaterialCalendarData.setDayContent(date, getDayHtml(dayValue));
        });*/
    }
    
    $scope.personSelect = function(person) {
        $scope.selectedPerson = person;
        $rootScope.selectedPerson = person;
        if (person == 'add') {
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'addPersonCtrl'
            }).then(function(newPerson){
                if (newPerson > 0) {
                    $scope.selectedPerson = newPerson;
                } else {
                    $scope.selectedPerson = 'generaly';
                }
            }, function() {
                $scope.selectedPerson = 'generaly';
            });
        }
    }

    date = new Date($scope.date + ' 00:00:00');
    activity = ($scope.selectedActivity != 'any')?  $scope.selectedActivity.name : null;

    next = new Date($scope.date + ' 00:00:00').setDate(date.getDate() + 1);
    previous = new Date($scope.date + ' 00:00:00').setDate(date.getDate() - 1);

    dayData = $astro.getRating(date, activity);

    stars = $astro.getStars(dayData.rating);
    starClass = (dayData.rating > 0)? 'positive' : 'negative';
    starClasses = [0, 0, 0, 0, 0].fill('neutral').fill(starClass, 0, stars);

    $scope.starClasses = starClasses;
    $scope.ratingValue = dayData.rating;
    $scope.next = next;
    $scope.previous = previous;

    console.log(stemCompatibility);

})

app.controller("languageCtrl", function($scope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage) {

    $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
    });
    $translate.use($scope.$storage.locale.lang);

    $scope.laguageSelect = function(lang) {
            $translate.use(lang);
            if (lang == 'en') {
                  $scope.weekstart = 0;
            } else {
                  $scope.weekstart = 1;
            }

            $scope.$storage.locale.lang = lang;
            $scope.$storage.locale.weekstart = $scope.weekstart;
    }
    $scope.laguage = $translate.use();

    $scope.setWeekStart = function(weekstart) {
        $scope.$storage.locale.weekstart = weekstart;
    }
    $scope.weekstart = $scope.$storage.locale.weekstart;
});

app.controller("personCtrl", function($scope, $filter, $q, $timeout, $log, $translate, $localStorage, $mdBottomSheet, $localStorage) {

      $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
      });
      $translate.use($scope.$storage.locale.lang);

      $scope.personlist = $scope.$storage.personlist;

      $scope.addPersonForm = function() {
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'addPersonCtrl'
            })
      };

      $scope.deletePersonForm = function(key) {
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-delete.html',
                  controller: 'deletePersonCtrl',
                  resolve: {
                    deletekey: function () {
                        return key;
                    }
                  }
            })
      };

});

app.controller("addPersonCtrl", function($scope, $mdBottomSheet, $localStorage) {

    $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
    });

    var datedays = [];
    for(var i=0; i<32; i++) {
        datedays.push(i);
    }
    $scope.datedays = datedays;

    $scope.datemonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    $scope.savePerson = function() {
        var bornDate = new Date($scope.user.dateyear, $scope.user.datemonth, $scope.user.dateday);
        person = {name: $scope.user.name, date: bornDate};
        $scope.$storage.personlist.push(person);
        $mdBottomSheet.hide($scope.$storage.personlist.length - 1);
    };
});

app.controller("deletePersonCtrl", function($scope, $mdBottomSheet, $localStorage, deletekey) {

    $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
    });

    $scope.key = deletekey;
    $scope.person = $scope.$storage.personlist[deletekey];

    $scope.deletePerson = function() {
        $scope.$storage.personlist.splice(deletekey, 1);
        $mdBottomSheet.hide();
    };

    $scope.deleteCancel = function() {
        $mdBottomSheet.hide();
    };

});