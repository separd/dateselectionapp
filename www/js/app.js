
var app = angular.module("dateselectionguru", ['ngMaterial', 'ngRoute', 'materialCalendar', 'pascalprecht.translate', 'ngStorage', 'hamburgerHelper', 'angularMaterialPreloader', 'ngAstro']);

angular.element(document).ready(function() {
    if (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
        document.addEventListener("deviceready", function() {
            angular.bootstrap(document, ['dateselectionguru']);
        }, false);
    } else {
        angular.bootstrap(document, ['dateselectionguru']);
    }
});

/*
function bootstrapAngular() {
    console.log("Bootstrapping AngularJS");
    // This assumes your app is named "app" and is on the body tag: <body ng-app="app">
    // Change the selector from "body" to whatever you need
    var domElement = document.querySelector('body');
    // Change the application name from "app" if needed
    angular.bootstrap(domElement, ['dateselectionguru']);
}

if (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
    console.log("URL: Running in Cordova/PhoneGap");
    document.addEventListener("deviceready", bootstrapAngular, false);
} else {
    console.log("URL: Running in browser");
    bootstrapAngular();
}*/

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
      when('/settings', {
        templateUrl: 'pages/settings.html',
        controller: 'settingsCtrl'
      }).
      when('/wellcome', {
        templateUrl: 'pages/wellcome.html',
        controller: 'wellcomeCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);

app.directive('homeLink', [function() {
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
}]);

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
                        if (rating < -2) {
                            mark = 'fa-times negative'
                        } else if (rating  < 2) {
                            mark = 'fa-adjust neutral'
                        } else if (rating < 5) {
                            mark = 'fa-check positive'
                        } else {
                            mark = 1
                        }
                        scope.mark = mark;
                    }
                });

            },
            template: function (scope) {
                template = '<div ng-if="mark == 1"><span class="fa-stack double positive"><i class="fa fa-check fa-stack-1x"></i><i class="fa fa-check fa-inverse fa-stack-1x"></i><i class="fa fa-check fa-stack-1x"></i></span></div>';
                template += '<div ng-if="mark != 1"><i class="fa {{mark}}"></i></div>';
                return template;
            }
        };
});

app.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}])

app.config(function ($translateProvider) {
  $translateProvider.translations('en', $tranlationEN);
  $translateProvider.translations('sk', $tranlationSK);
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.preferredLanguage('en');
});

app.run(function($rootScope, $localStorage, $filter, $astro, $location) {
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
    
    $rootScope.$on('$routeChangeStart', function (event, next) {
        $rootScope.currentRoute = next;
        if ($rootScope.$storage.personlist.length == 0 && next.originalPath != '/wellcome') {
            $location.path("/wellcome");
        }
    });

    $rootScope.datemonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
                ratingData = $astro.getRating(date, activityPerson.activity, activityPerson.person);
                if (!activityPerson.activity) {
                    ratingData.filter = -1;
                }
                monthData.push(ratingData);
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

app.controller("calendarCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage, $mdBottomSheet, $mdToast, $astro, $Rating, $location) {

    $translate.use($rootScope.$storage.locale.lang);

    $scope.activities = $astro.getActivities();
    $scope.personlist = $rootScope.$storage.personlist;
    //$rootScope.$storage.$reset();
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
        $location.path('/day/' + $filter('date')(date, 'yyyy-MM-dd'));
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
            $mdToast.show($mdToast.simple().content($translate.instant('CALENDAR_WARNING')));
            $timeout(function() {
                $scope.$apply();
            }, 500);
            
        }
        function setMothEvents($data) {
            angular.forEach($data, function(event, key) {
                dateId = event.startDate.substr(0, 10);
                eventElement = angular.element( document.querySelector('.event_' + dateId) );
                eventElement.addClass('active');
            });
        }
        function onError($msg) {
            $mdToast.show($mdToast.simple().content($translate.instant('CALENDAR_WARNING')));
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
        if (dayData.filter != -1) {
            if (dayData.filter > 5) {
                dayRating = 8;
            } else if (dayData.filter > 0) {
                dayRating = 3;
            } else {
                dayRating = -5;
            }
        } else {
            dayRating = dayData.rating;
        }
        dateId = $filter("date")(date, "yyyy-MM-dd");
        toDay = new Date();
        if ($filter("date")(toDay, "yyyy-MM-dd") == dateId) {
            dayHTML += '<div class="today"></div>';
        }

        dayHTML += '<div class="ratingwrap"><star-rating rating="' + dayRating + '"></star-rating></div>';
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

app.controller("dayCtrl", function($scope, $rootScope, $routeParams, $filter, $translate, MaterialCalendarData,  $localStorage, $mdBottomSheet, $mdToast, $astro, $Rating) {

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
            $mdToast.show($mdToast.simple().content($translate.instant('CALENDAR_WARNING')));
        }
        
        function setDayEvents($data) {
            $scope.$dayEvents = [];
            $scope.$hourEvents = [];
            for ($i=0; $i<24; $i++) {
                $scope.$hourEvents[$i] = [];
            }
            angular.forEach($data, function(event, key) {
                event.startDate = new Date(event.startDate);
                event.endDate = new Date(event.endDate);
                if (typeof(event.location) == 'undefined') {
                    event.location = '';
                    event.label = event.title;
                } else {
                    event.label = event.title + ' ' + event.location;
                }

                if ((event.allday && event.startDate.getDate() == date.getDate()) || !event.allday) {
                    $scope.$dayEvents.push(event);
                }
                if (!event.allday && event.startDate.getDate() == date.getDate()) {
                    hourId = parseInt(event.startDate.getHours());
                    $scope.$hourEvents[hourId].push(event);
                }
            });
            $scope.$apply();
        }
        function onError($msg) {
            $mdToast.show($mdToast.simple().content($translate.instant('CALENDAR_WARNING')));
        }
    }

    $scope.addEvent = function($hour) {
        var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $hour, 0, 0, 0);
        var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $hour, 59, 59, 0);

        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.calendar) != 'undefined') {
            window.plugins.calendar.createEventInteractively('', '', '', startDate, endDate, getNewDayEvents, onError);
        } else {
            setTimeout(function(){
                $mdToast.show($mdToast.simple().content($translate.instant('CALENDAR_WARNING')));
            }, 200);
        }
        function getNewDayEvents($data) {
            getDayEvents();
        }
        function onError($msg) {
            $mdToast.show($mdToast.simple().content($translate.instant('CALENDAR_WARNING')));
        }
    }

    $scope.deleteEventForm = function(deleteEvent) {
        $mdBottomSheet.show({
                  templateUrl: 'pages/event-detail.html',
                  controller: 'deleteEventCtrl',
                  resolve: {
                    deleteEvent: function () {
                        return deleteEvent;
                    }
                  }
        }).then(function(refresh) {
            if (refresh) {
                getDayEvents();
            }
        });;
    }

    $scope.showEventForm = function(showEvent) {
        $mdBottomSheet.show({
                  templateUrl: 'pages/event-detail.html',
                  controller: 'showEventCtrl',
                  resolve: {
                    showEvent: function () {
                        return showEvent;
                    }
                  }
        });
    }

});

app.controller("showEventCtrl", function($scope, $mdBottomSheet, showEvent) {

    $scope.event = showEvent;

    $scope.okButton = function() {
        $mdBottomSheet.hide();
    };

});

app.controller("deleteEventCtrl", function($scope, $mdBottomSheet, deleteEvent) {

    $scope.event = deleteEvent;
    $scope.delete = true;

    $scope.deleteEvent = function() {
        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.calendar) != 'undefined') {
            window.plugins.calendar.deleteEvent(deleteEvent.title, deleteEvent.location, null, deleteEvent.startDate, deleteEvent.endDate, eventDeleted, onError);
        } else {
            $mdBottomSheet.hide();
        }

        function eventDeleted($data) {
            $mdBottomSheet.hide(true);
        }

        function onError($msg) {
            $mdToast.show($mdToast.simple().content($translate.instant('CALENDAR_WARNING')));
        }
    };

    $scope.deleteCancel = function() {
        $mdBottomSheet.hide();
    };

});

app.controller("settingsCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage) {

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

        $rootScope.$storage.personlist[0].name = $translate.instant('ME');
    }
    $scope.laguage = $translate.use();

    $scope.setWeekStart = function(weekstart) {
        $rootScope.$storage.locale.weekstart = weekstart;
    }
    $scope.weekstart = $rootScope.$storage.locale.weekstart;

    $scope.debugReset = function() {
        localStorage.clear();
        window.location.hash = '#wellcome';
        window.location.reload(true);
    }
});

app.controller("wellcomeCtrl", function($scope, $rootScope, $filter, $q, $timeout, $log, $translate, MaterialCalendarData, $localStorage, $location, $mdToast) {

    $scope.laguageSelect = function(lang) {
        $translate.use(lang);
        $rootScope.$storage.locale.lang = lang;
    }
    $scope.laguage = $translate.use();

    $scope.saveMe = function() {
        if (typeof $scope.user == 'undefined') {
            $mdToast.show($mdToast.simple().content($translate.instant('CORRECT_DATE_WARNING')));
            return;
        }
        var bornDate = new Date($scope.user.dateyear, $scope.user.datemonth, $scope.user.dateday);
        if (isNaN(bornDate.getTime())) {
            $mdToast.show($mdToast.simple().content($translate.instant('CORRECT_DATE_WARNING')));
            return;
        }
        person = {name: $translate.instant('ME'), date: bornDate};
        $rootScope.$storage.personlist.push(person);
        $location.path("/");
    };

    if (typeof(navigator.globalization) != 'undefined') {
        navigator.globalization.getPreferredLanguage(
            function (deviceLang) {
                lang = deviceLang.value.substr(0,2);
                if (lang == 'sk') {
                    $translate.use(lang);
                    $rootScope.$storage.locale.lang = lang;
                    $scope.laguage = lang;
                    $scope.$apply();
                }
            },
            function () {alert('Error getting language\n');}
        );
        navigator.globalization.getFirstDayOfWeek(
           function (day) {
                if (day.value == 2) {
                    $rootScope.$storage.locale.weekstart = 1;
                } else {
                    $rootScope.$storage.locale.weekstart = 0;
                }
            },
            function () {alert('Error getting first\n');}
        );
    }

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

      $scope.editPersonForm = function(key) {
            $mdBottomSheet.show({
                  templateUrl: 'pages/person-add.html',
                  controller: 'editPersonCtrl',
                  resolve: {
                    editkey: function () {
                        return key;
                    }
                  }
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

    $scope.savePerson = function() {
        var bornDate = new Date($scope.user.dateyear, $scope.user.datemonth, $scope.user.dateday);
        person = {name: $scope.user.name, date: bornDate};
        $rootScope.$storage.personlist.push(person);
        $mdBottomSheet.hide($rootScope.$storage.personlist.length - 1);
    };
});

app.controller("editPersonCtrl", function($scope, $rootScope, $mdBottomSheet, $localStorage, editkey) {
    
    editPerson = $rootScope.$storage.personlist[editkey];
    bornDate = new Date(editPerson.date);

    $scope.user = {
        name: editPerson.name,
        dateday: bornDate.getDate(),
        datemonth: bornDate.getMonth(),
        dateyear: bornDate.getFullYear()
    };

    $scope.savePerson = function() {
        var bornDate = new Date($scope.user.dateyear, $scope.user.datemonth, $scope.user.dateday);
        person = {name: $scope.user.name, date: bornDate};
        $rootScope.$storage.personlist[editkey] = person;
        $mdBottomSheet.hide();
    };
    $scope.editkey = editkey;

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