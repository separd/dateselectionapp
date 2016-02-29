var app = angular.module("dateselectionguru", ['ngMaterial', 'ngRoute', 'materialCalendar', 'pascalprecht.translate', 'ngStorage']);

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
        controller: 'calendarCtrl'
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

app.directive('menuClose', function() {
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

app.controller("calendarCtrl", function($scope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage) {

      $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
      });
      $translate.use($scope.$storage.locale.lang);

      $scope.yearMonthArray = yearMonthArray;
      $scope.activities = activities;
      $scope.dongGongDefinition = dongGongDefinition;

      $scope.selectedActivity = null;

      console.log($scope.$storage.locale);

    function setDateTable(d) {
        $scope.dateTable = {year:{}, month:{}, day:{}};

        $scope.dateTable.year.stem = (chineDateNum(d, 'year') + 6) % 10;
        $scope.dateTable.year.branch = (chineDateNum(d, 'year') + 8) % 12;

        $scope.dateTable.year.stem = (chineDateNum(d, 'year') + 6) % 10;
        $scope.dateTable.year.branch = (chineDateNum(d, 'year') + 8) % 12;

        var month  = chineDateNum(d);
        $scope.dateTable.month.branch  = (month + 2) % 12;
        var mod    = (3003 - chineDateNum(d, 'year')) % 5;
        $scope.dateTable.month.stem   = (10 + month - mod * 2) % 10;

        var day = Math.floor(d.getTime() / 86400000);
        $scope.dateTable.day.stem   = (day + 8 + 5000 * 10) % 10;
        $scope.dateTable.day.branch  = (day + 6 + 5000 * 12) % 12;
    }

	 function day28(d) {
        d28 = (Math.floor(d.getTime() / 86400000) + 8) % 28 + 1;
        return d28;
    }

    function getEffect28(d, actName) {
        activity = $filter('filter')($scope.activities, {name: actName})[0];
        d28 = day28(d);
        effect = activity['effect'][d28-1];
        return effect;
    }

    function chineDateNum(d, type) {
        euroYear    = d.getFullYear();
        euroMonth   = d.getMonth();
        euroDay     = d.getDate();
        
        yearSource = $filter('filter')($scope.yearMonthArray, {year: euroYear});
        if (yearSource.length < 1 || yearSource[0]['months'].length < 12) {
            subyear = (euroYear < 2000)? 1900 : 2050;
            yearSource = $filter('filter')($scope.yearMonthArray, {year: subyear});
        }
        yearArray = yearSource[0]['months'];

        chinaYear = (euroMonth > 1 || (euroMonth == 1 && euroDay >= yearArray[0]))? euroYear : euroYear - 1;
        if (type == 'year') {
            return chinaYear;
        }

        chinaMonth = 11;
        for (i=0; i<12; i++) {
            testDay = yearArray[i];
            testMonth = (i == 11)? 0 : i + 1; 
            testYear = (testMonth > 0)? chinaYear : chinaYear + 1;
            testDate = new Date(testYear, testMonth, testDay);
            if (testDate <= d) {
                chinaMonth = i;
            }
        }
        return chinaMonth;
    }

    function getOfficer(d, actName) {
        activity = $filter('filter')($scope.activities, {name: actName})[0];
        months = chineDateNum(d);
        days = Math.floor(d.getTime() / 86400000) + 4;
        officerDay = (days - months) % 12;
        officer = activity['officer'][officerDay];
        return officer;
    }

    function getRating(d, actName) {
        setDateTable(d);
        scopeRating = 0;
        effect28    = getEffect28(d, actName)
        officer     = getOfficer(d, actName);
        
        if (effect28 + officer > 0) {
            scopeRating = effect28 + officer;// + $DayRating;
        }

        return scopeRating;
    }

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
        $scope.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
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
        angular.forEach(MaterialCalendarData.data, function(value, key) {
            var date = new Date(key);
            dayValue = getRating(date, activity.name);
            MaterialCalendarData.setDayContent(date, getDayHtml(dayValue));
        });
    }

    function getDayHtml(dayValue) {
        if (dayValue == 0) {
            return '<div class="activity"></div>';
        } else {
            return '<div class="activity activity' + dayValue + '"></div>';
        }
    }

    $scope.setDayContent = function(date) {
        if (!$scope.selectedActivity) {
            return 0;
        } else {
            dayValue = getRating(date, $scope.selectedActivity.name);
            return getDayHtml(dayValue);
        }
    };

});

app.controller("languageCtrl", function($scope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage) {

      $scope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: []
      });

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

    $scope.datemonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    $scope.savePerson = function() {
        var bornDate = new Date($scope.user.dateyear, $scope.user.datemonth, $scope.user.dateday);
        person = {name: $scope.user.name, date: bornDate};
        $scope.$storage.personlist.push(person);
        $mdBottomSheet.hide();
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
        console.log(deletekey);
        //$scope.$storage.personlist.push(person);
        $scope.$storage.personlist.splice(deletekey, 1);
        $mdBottomSheet.hide();
    };
});