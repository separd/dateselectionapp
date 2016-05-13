var app = angular.module("dateselectionguru", ['ngMaterial', 'ngRoute', 'materialCalendar', 'pascalprecht.translate', 'ngStorage', 'hamburgerHelper', 'angularMaterialPreloader', 'ngAstro']);

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

app.directive('starRating', function() {
    return {
            link: function(scope, $element, $attr) {

                $attr.$observe('rating', function(rating){
                    if(rating){
   
                        if (rating < -8) {
                            stars = 5
                        } else if (rating < -6) {
                            stars = 4
                        } else if (rating < -4) {
                            stars = 3
                        } else if (rating < -2) {
                            stars = 2
                        } else if (rating < 0) {
                            stars = 1
                        } else if (rating  == 0) {
                            stars = 0
                        } else if (rating > 8) {
                            stars = 5
                        } else if (rating > 6) {
                            stars = 4
                        } else if (rating > 4) {
                            stars = 3
                        } else if (rating > 2) {
                            stars = 2
                        } else if (rating > 0) {
                            stars = 1
                        }

                        starClass = (rating > 0)? 'positive' : 'negative';
                        scope.starClasses = [0, 0, 0, 0, 0].fill('neutral').fill(starClass, 0, stars);
                    }
                });

            },
            template: '<i ng-repeat="starClass in starClasses track by $index" class="large material-icons {{starClass}}">star</i>'
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
            selectedPerson: []
    });
    $rootScope.activities = $astro.getActivities();
    if ($rootScope.$storage.selectedActivity != 'any') {
        activity = $filter('filter')($rootScope.activities, {id: $rootScope.$storage.selectedActivity.id});
        $rootScope.$storage.selectedActivity = activity[0];
    }

});

app.factory('$Rating', function($q, $astro, $timeout, $rootScope, $localStorage) {

    var getDay = function(date) {
        var deferred = $q.defer();
        var activityPerson = getActivityPerson();

        $ratingData = $astro.getRating(date, activityPerson.activity, activityPerson.person);
        deferred.resolve($ratingData);
        return deferred.promise;
    };
  
    var getHours = function(date) {
        var deferred = $q.defer();
        var activityPerson = getActivityPerson();

        $timeout(function() {
            $hours = $astro.getRatingForHours(date, activityPerson.activity, activityPerson.person);
            deferred.resolve($hours);
        }, 500);
  
        return deferred.promise;
    };

    var getMonth = function($monthStart) {
        var deferred = $q.defer();
        var activityPerson = getActivityPerson();

        $timeout(function() {
           
            var myMonth = $monthStart.getMonth();
            var monthData = [];

            var date = new Date($monthStart.getFullYear(), $monthStart.getMonth(), 1, 0, 0, 0, 0);
            while (date.getMonth() == myMonth) {
                monthData.push($astro.getRating(date, activityPerson.activity, activityPerson.person));
                date.setDate(date.getDate() + 1);
            }

            deferred.resolve(monthData);
        }, 500);
  
        return deferred.promise;
    };
    
    return {
        getDay: getDay,
        getHours: getHours,
        getMonth: getMonth
    };

    function getActivityPerson() {
        activity = ($rootScope.$storage.selectedActivity != 'any')?  $rootScope.$storage.selectedActivity.name : null;
        person = [];
        angular.forEach($rootScope.$storage.selectedPerson, function($personKey, $k) {
            if (typeof($rootScope.$storage.personlist[$personKey]) != 'undefined') {
                person.push($rootScope.$storage.personlist[$personKey]);
            }
        });

        return {activity: activity, person: person};
    };
  
  })

app.controller("calendarCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage, $mdBottomSheet, $astro, $Rating) {

    $translate.use($rootScope.$storage.locale.lang);

    $scope.activities = $astro.getActivities();
    $scope.personlist = $rootScope.$storage.personlist;
    $scope.selectedPerson = $rootScope.$storage.selectedPerson;
    $scope.selectedActivity = $rootScope.$storage.selectedActivity;
    $now = new Date();
    $scope.monthStart = new Date($now.getFullYear(), $now.getMonth(), 1, 0, 0, 0, 0);

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
        $scope.monthStart = new Date(data.year, data.month-1, 1, 0, 0, 0, 0);
        setCalendarHtml();
        getMothEvents(data);
    };

    $scope.nextMonth = function(data) {
        $scope.monthStart = new Date(data.year, data.month-1, 1, 0, 0, 0, 0);
        setCalendarHtml();
        getMothEvents();
    };

    function getMothEvents() {
        var endDate = new Date($scope.monthStart.getFullYear(), $scope.monthStart.getMonth()+1, 1, 0, 0, 0, -1);
        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.calendar) != 'undefined') {
            window.plugins.calendar.findEvent(null, null, null, $scope.monthStart, endDate, setMothEvents, onError);
        } else {
            // debug
            /*setTimeout(function(){
                $data = [{"id":"23","message":"","location":"","title":"Sviatok svätého Cyrila a Metoda","startDate":"2016-07-05 02:00:00","endDate":"2016-07-06 02:00:00","allday":true},{"id":"24","message":"","location":"","title":"","startDate":"2016-07-07 21:30:00","endDate":"2016-07-10 16:00:00","allday":false},{"id":"25","message":"","location":"Vrbove","title":"","startDate":"2016-07-15 21:30:00","endDate":"2016-07-17 15:00:00","allday":false}];
                setMothEvents($data);
            }, 200);*/
        }
        function setMothEvents($data) {
            angular.forEach($data, function(event, key) {
                dateId = event.startDate.substr(0, 10);

                eventElement = angular.element( document.querySelector('.event_' + dateId) );
                eventElement.addClass('active');
            });
        }
        function onError($msg) {
            document.getElementById('cdatatest').innerHTML = JSON.stringify($data);
        }
    }

    $scope.activitySelect = function(activity) {
        $rootScope.$storage.selectedActivity = activity;
        setCalendarHtml();
    }
    
    $scope.personSelect = function(person) {
        if (person.indexOf('add') !== -1) {
            $scope.selectedPerson = $rootScope.$storage.selectedPerson;
            angular.element(document.querySelector('md-backdrop')).triggerHandler('click');
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'addPersonCtrl'
            }).then(function(newPerson) {
                if (angular.isNumber(newPerson)) {
                    $scope.selectedPerson = $scope.selectedPerson.concat(newPerson);
                    $rootScope.$storage.selectedPerson = $scope.selectedPerson;
                    setCalendarHtml();
                }
            });
        }
        if (!angular.equals($rootScope.$storage.selectedPerson, $scope.selectedPerson)) {
            $rootScope.$storage.selectedPerson = $scope.selectedPerson;
            setCalendarHtml();
        }
    }

    function getDayHtml(dayData, date) {

        dayHTML = '<div class="daydata">';
        if (dayData.filter > 0) {
            activityClass = (dayData.filter > 5)? 2 : 1;
            dayHTML += '<div class="activity activity' + activityClass + '"></div>';
        }
        dateId = $filter("date")(date, "yyyy-MM-dd");

        stars = $astro.getStars(dayData.rating);          
        ratingClass = (dayData.rating < 0)? 'negative' : 'positive';
        ratingPerc = Math.abs(stars) * 20;
        dayHTML += '<div class="ratingwrap" title="' + dayData.rating + '"><div class="ratingval ratingval' + ratingPerc + ' ' + ratingClass + '"></div></div>';
        dayHTML += '<div class="event event_' + dateId + '" id="event_' + dateId + '"></div>';
        dayHTML += '</div>';

        return dayHTML;
    }

    function setCalendarHtml() {
        angular.element(document.querySelector('md-backdrop')).triggerHandler('click');

        myMonth = $scope.monthStart.getMonth();
        angular.forEach(MaterialCalendarData.data, function(value, key) {
            var date = new Date(key);
            if (date.getMonth() == myMonth) {
                MaterialCalendarData.setDayContent(date, '<div class="ratingwrap" title="calculating"></div>');
            } else {
                MaterialCalendarData.setDayContent(date, '<div></div>');
            }
        }); 

        $Rating.getMonth($scope.monthStart).then(function($days) {
            for ($i=0; $i<$days.length; $i++) {
                var date = new Date($scope.monthStart.getFullYear(), $scope.monthStart.getMonth(), 1+$i, 0, 0, 0, 0);
                MaterialCalendarData.setDayContent(date, getDayHtml($days[$i], date));
            }
            getMothEvents();
        });
    }
    setCalendarHtml();
});

app.controller("dayCtrl", function($scope, $rootScope, $routeParams, $filter, $translate, MaterialCalendarData,  $localStorage, $mdBottomSheet, $astro, $Rating) {

    $scope.materialPreloader = false;

    $translate.use($rootScope.$storage.locale.lang);

    $scope.activities = $astro.getActivities();
    $scope.personlist = $rootScope.$storage.personlist;
    $scope.selectedPerson = $rootScope.$storage.selectedPerson;
    $scope.selectedActivity = $rootScope.$storage.selectedActivity;

    $scope.testdir = 'lolo';

    $scope.groupList = $scope.activities.reduce(function(previous, current) {
        if (previous.indexOf(current.group) === -1) {
            previous.push(current.group);
        }
        return previous;
    }, []);

    $scope.date = $routeParams.date;
    var date = new Date($scope.date + ' 00:00:00');

    $scope.activitySelect = function(activity) {
        // zatial nic
    }

    $scope.personSelect = function(person) {
        if (person.indexOf('add') !== -1) {
            $scope.selectedPerson = $rootScope.$storage.selectedPerson;
            angular.element(document.querySelector('md-backdrop')).triggerHandler('click');
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'addPersonCtrl'
            }).then(function(newPerson) {
                if (angular.isNumber(newPerson)) {
                    $scope.selectedPerson = $scope.selectedPerson.concat(newPerson);
                    $rootScope.$storage.selectedPerson = $scope.selectedPerson;
                    setDayData(date);
                }
            });
        }
        if (!angular.equals($rootScope.$storage.selectedPerson, $scope.selectedPerson)) {
            $rootScope.$storage.selectedPerson = $scope.selectedPerson;
            setDayData(date);
        }
    }

    $scope.next = new Date($scope.date + ' 00:00:00').setDate(date.getDate() + 1);
    $scope.previous = new Date($scope.date + ' 00:00:00').setDate(date.getDate() - 1);

    setDayData(date);

    function setDayData(date) {
        $Rating.getDay(date).then(function($dayData) {
            $scope.ratingValue = $dayData.rating;
        });

        $scope.hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  
        angular.element(document.querySelector('md-backdrop')).triggerHandler('click');
        $Rating.getHours(date).then(function($hours) {
            $scope.hours = $hours;
            getDayEvents();
        });
    }

    function getDayEvents() {
        var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0);
        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.calendar) != 'undefined') {
            window.plugins.calendar.findEvent(null, null, null, date, endDate, setDayEvents, onError);
        } else {
            // debug
            setTimeout(function(){
                $data = [{"id":"23","message":"","location":"","title":"Sviatok svätého Cyrila a Metoda","startDate":"2016-07-05 02:00:00","endDate":"2016-07-05 02:00:00","allday":true},{"id":"24","message":"","location":"","title":"","startDate":"2016-07-05 21:30:00","endDate":"2016-07-10 16:00:00","allday":false},{"id":"25","message":"","location":"Vrbove","title":"","startDate":"2016-07-05 21:30:00","endDate":"2016-07-05 15:00:00","allday":false}];
                setDayEvents($data);
            }, 200);
            //
        }
        function setDayEvents($data) {
            $scope.$dayEvents = [];
            $scope.$hourEvents = [];
            for ($i=0; $i<24; $i++) {
                $scope.$hourEvents[$i] = [];
            }
            angular.forEach($data, function(event, key) {
                myEvent = event.title + ' ' + event.location;
                eventStart = new Date(event.startDate);

                if ((event.allday && eventStart.getDate() == date.getDate()) || !event.allday) {
                    $scope.$dayEvents.push(myEvent);
                }
                if (!event.allday && eventStart.getDate() == date.getDate()) {
                    hourId = parseInt(event.startDate.substr(11, 2));
                    $scope.$hourEvents[hourId].push(myEvent);
                }
            });
            $scope.$apply();
        }
        function onError($msg) {
            //document.getElementById('cdatatest').innerHTML = JSON.stringify($data);
        }
    }

    $scope.addEvent = function($hour) {
        var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $hour, 0, 0, 0);
        var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $hour, 59, 59, 0);

        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.calendar) != 'undefined') {
            alert(endDate);
            window.plugins.calendar.createEventInteractively('', '', '', startDate, endDate, getNewDayEvents, onError);
            alert('create ok');
        } else {
            alert('Device not support this function');
            setTimeout(function(){
                getNewDayEvents();
            }, 200);
        }
        function getNewDayEvents() {
            getDayEvents();
        }
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
        $deleteInSelected = $rootScope.$storage.selectedPerson.indexOf(deletekey);
        if ($deleteInSelected != -1) {
            $rootScope.$storage.selectedPerson.splice($deleteInSelected, 1);
        }
        $mdBottomSheet.hide();
    };

    $scope.deleteCancel = function() {
        $mdBottomSheet.hide();
    };

});