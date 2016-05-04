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
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.preferredLanguage('en');
});

app.run(function($rootScope, $localStorage, $filter, $astro) {
    $rootScope.$storage = $localStorage.$default({
            locale: {lang: 'en', weekstart: 1},
            personlist: [],
            selectedActivity: 'any',
            selectedPerson: 'generaly'
    });
    $rootScope.activities = $astro.getActivities();
    if ($rootScope.$storage.selectedActivity != 'any') {
        activity = $filter('filter')($rootScope.activities, {id: $rootScope.$storage.selectedActivity.id});
        $rootScope.$storage.selectedActivity = activity[0];
    }

    $rootScope.getRating = function(date) {

        extraData = $rootScope.getActivityPersonPerson();
        ratingData = $astro.getRating(date, extraData.activity, extraData.person);
        return ratingData;
    };

    $rootScope.getActivityPersonPerson = function() {
        activity = ($rootScope.$storage.selectedActivity != 'any')?  $rootScope.$storage.selectedActivity.name : null;
        person = ($rootScope.$storage.selectedPerson != 'generaly')?  $rootScope.$storage.personlist[$rootScope.$storage.selectedPerson].date : null;
        return {activity: activity, person: person};
    }

});

function setMothEvents($data) {
    alert('hura');
    alert('Calendar success out: ' + JSON.stringify($data));
}

function onError(msg) {
    alert('Calendar error out: ' + JSON.stringify(msg));
}

app.controller("calendarCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage, $mdBottomSheet, $astro) {

    $translate.use($rootScope.$storage.locale.lang);
    $scope.activities = $astro.getActivities();

    $scope.personlist = $rootScope.$storage.personlist;
    $scope.selectedPerson = $rootScope.$storage.selectedPerson;
    if ($rootScope.$storage.selectedPerson != 'generaly' && typeof($scope.personlist[$rootScope.$storage.selectedPerson]) == 'undefined') {
        $rootScope.$storage.selectedPerson = 'generaly';
    }
    $scope.selectedActivity = $rootScope.$storage.selectedActivity;

    $scope.groupList = $scope.activities.reduce(function(previous, current) {
        if (previous.indexOf(current.group) === -1) {
            previous.push(current.group);
        }
        return previous;
    }, []);

	// CALENDAR

    $scope.selectedDate = null;
    $scope.weekStartsOn = $rootScope.$storage.locale.weekstart;
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
        console.log(data);
    };

    $scope.nextMonth = function(data) {
        getMothEvents(data);
    };

    $scope.setContentViaService = function() {
        var today = new Date();
        MaterialCalendarData.setDayContent(today, '<span> :oD </span>');
    }

    function getMothEvents($data) {

        var startDate = new Date($data.year, $data.month, 1, 0, 0, 0, 0);
        var endDate = new Date($data.year, $data.month+1, 1, 0, 0, 0, -1);
        if (typeof(window.plugins) == 'undefined') {
            alert('no plugin');
        } else if (typeof(window.plugins.calendar) == 'undefined') {
            alert('no calendar');
        } else {
            window.plugins.calendar.findEvent(null, null, null, startDate, endDate, setMothEvents, onError);
            //alert('find is ok');
        }
        
    }

    function setMothEvents($data) {
        alert('Calendar success: ' + JSON.stringify(msg));
    }

    $scope.activitySelect = function(activity) {
        $scope.selectedActivity = activity;
        $rootScope.$storage.selectedActivity = activity;
        var date = new Date();
        
        angular.forEach(MaterialCalendarData.data, function(value, key) {
            var date = new Date(key);
            dayValue = $rootScope.getRating(date);
            MaterialCalendarData.setDayContent(date, getDayHtml(dayValue));
        });
    }
    
    $scope.personSelect = function(person) {
        if (person == 'add') {
            $scope.selectedPerson = 'generaly';
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'addPersonCtrl'
            }).then(function(newPerson){
                if (angular.isNumber(newPerson)) {
                    $scope.selectedPerson = newPerson;
                    $rootScope.$storage.selectedPerson = $scope.selectedPerson;
                    angular.forEach(MaterialCalendarData.data, function(value, key) {
                        var date = new Date(key);
                        dayData = $rootScope.getRating(date);
                        MaterialCalendarData.setDayContent(date, getDayHtml(dayData));
                    });
                }
            });
        }
        $rootScope.$storage.selectedPerson = $scope.selectedPerson;
        angular.forEach(MaterialCalendarData.data, function(value, key) {
            var date = new Date(key);
            dayData = $rootScope.getRating(date);
            MaterialCalendarData.setDayContent(date, getDayHtml(dayData));
        });
    }

    function getDayHtml(dayData) {

        dayHTML = '<div class="daydata">';
        if (dayData.filter > 0) {
            activityClass = (dayData.filter > 5)? 2 : 1;
            dayHTML += '<div class="activity activity' + activityClass + '"></div>';
        }
        
        stars = $astro.getStars(dayData.rating);          
        ratingClass = (dayData.rating < 0)? 'negative' : 'positive';
        ratingPerc = Math.abs(stars) * 20;
        dayHTML += '<div class="ratingwrap" title="' + dayData.rating + '"><div class="ratingval ratingval' + ratingPerc + ' ' + ratingClass + '"></div></div>';

        dayHTML += '</div>';

        return dayHTML;
    }

    $scope.setDayContent = function(date) {
        dayData = $rootScope.getRating(date);
        return getDayHtml(dayData);
    };

});

app.controller("dayCtrl", function($scope, $rootScope, $routeParams, $filter, $translate, MaterialCalendarData,  $localStorage, $mdBottomSheet, $astro) {

    $translate.use($rootScope.$storage.locale.lang);

    $scope.date = $routeParams.date;

    $scope.activities = $astro.getActivities();
    $scope.personlist = $rootScope.$storage.personlist;

    
    if ($rootScope.$storage.selectedPerson.selectedPerson != 'generaly' && typeof($scope.personlist[$rootScope.$storage.selectedPerson]) == 'undefined') {
        $rootScope.$storage.selectedPerson = 'generaly';
    }
    $scope.selectedPerson = $rootScope.$storage.selectedPerson;
    $scope.selectedActivity = $rootScope.$storage.selectedActivity;

    $scope.groupList = $scope.activities.reduce(function(previous, current) {
        if (previous.indexOf(current.group) === -1) {
            previous.push(current.group);
        }
        return previous;
    }, []);

    var date = new Date($scope.date + ' 00:00:00');

    $scope.activitySelect = function(activity) {
        // zatial nic
    }
    
    $scope.personSelect = function(person) {

        if (person == 'add') {
            $scope.selectedPerson = 'generaly';
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'addPersonCtrl'
            }).then(function(newPerson){
                if (angular.isNumber(newPerson)) {
                    $scope.selectedPerson = newPerson;
                    $rootScope.$storage.selectedPerson = $scope.selectedPerson;

                    setDayData(date);
                }
            });
        }
        $rootScope.$storage.selectedPerson = $scope.selectedPerson;

        setDayData(date);
    }

    $scope.next = new Date($scope.date + ' 00:00:00').setDate(date.getDate() + 1);
    $scope.previous = new Date($scope.date + ' 00:00:00').setDate(date.getDate() - 1);

    setDayData(date);

    function setDayData(date) {
        dayData = $rootScope.getRating(date);

        stars = $astro.getStars(dayData.rating);
        starClass = (dayData.rating > 0)? 'positive' : 'negative';
        starClasses = [0, 0, 0, 0, 0].fill('neutral').fill(starClass, 0, stars);

        $scope.starClasses = starClasses;
        $scope.ratingValue = dayData.rating;

        activityPerson = $rootScope.getActivityPersonPerson();
        $scope.hours = $astro.getRatingForHours(date, activityPerson.activity, activityPerson.person);
    }

})

app.controller("languageCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage) {

    $translate.use($rootScope.$storage.locale.lang);

    $scope.laguageSelect = function(lang) {
            $translate.use(lang);
            if (lang == 'en') {
                  $scope.weekstart = 0;
            } else {
                  $scope.weekstart = 1;
            }

            $rootScope.$storage.locale.lang = lang;
            $rootScope.$storage.locale.weekstart = $scope.weekstart;
    }
    $scope.laguage = $translate.use();

    $scope.setWeekStart = function(weekstart) {
        $rootScope.$storage.locale.weekstart = weekstart;
    }
    $scope.weekstart = $rootScope.$storage.locale.weekstart;
});

app.controller("personCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, $localStorage, $mdBottomSheet) {

      $translate.use($rootScope.$storage.locale.lang);

      $scope.personlist = $rootScope.$storage.personlist;

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

app.controller("addPersonCtrl", function($scope, $rootScope, $mdBottomSheet, $localStorage) {

    var datedays = [];
    for(var i=0; i<32; i++) {
        datedays.push(i);
    }
    $scope.datedays = datedays;

    $scope.datemonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    $scope.savePerson = function() {
        var bornDate = new Date($scope.user.dateyear, $scope.user.datemonth, $scope.user.dateday);
        person = {name: $scope.user.name, date: bornDate};
        $rootScope.$storage.personlist.push(person);
        $mdBottomSheet.hide($rootScope.$storage.personlist.length - 1);
    };
});

app.controller("deletePersonCtrl", function($scope, $rootScope, $mdBottomSheet, $localStorage, deletekey) {

    $scope.key = deletekey;
    $scope.person = $rootScope.$storage.personlist[deletekey];

    $scope.deletePerson = function() {
        $rootScope.$storage.personlist.splice(deletekey, 1);
        $mdBottomSheet.hide();
    };

    $scope.deleteCancel = function() {
        $mdBottomSheet.hide();
    };

});