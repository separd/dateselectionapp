var app = angular.module("ngAstro", []);

app.factory("$astro", function($rootScope, $filter) {return {

    setDateTable: function(d) {
        var dateTable = {year:{}, month:{}, day:{}};

        dateTable.year.stem = (this.chineDateNum(d, 'year') + 6) % 10;
        dateTable.year.branch = (this.chineDateNum(d, 'year') + 8) % 12;

        dateTable.year.stem = (this.chineDateNum(d, 'year') + 6) % 10;
        dateTable.year.branch = (this.chineDateNum(d, 'year') + 8) % 12;

        var month  = this.chineDateNum(d);
        dateTable.month.branch  = (month + 2) % 12;
        var mod    = (3003 - this.chineDateNum(d, 'year')) % 5;
        dateTable.month.stem   = (10 + month - mod * 2) % 10;

        var day = Math.floor(d.getTime() / 86400000);
        dateTable.day.stem   = (day + 8 + 5000 * 10) % 10;
        dateTable.day.branch  = (day + 6 + 5000 * 12) % 12;

        return dateTable;
    },

    day28: function(d) {
        d28 = (Math.floor(d.getTime() / 86400000) + 8) % 28 + 1;
        return d28;
    },

    getEffect28: function(d, actName) {
        activity = $filter('filter')(activities, {name: actName})[0];
        d28 = this.day28(d);
        effect = activity['effect'][d28-1];
        return effect;
    },

    chineDateNum: function(d, type) {
        euroYear    = d.getFullYear();
        euroMonth   = d.getMonth();
        euroDay     = d.getDate();
        
        yearSource = $filter('filter')(yearMonthArray, {year: euroYear});
        if (yearSource.length < 1 || yearSource[0]['months'].length < 12) {
            subyear = (euroYear < 2000)? 1900 : 2050;
            yearSource = $filter('filter')(yearMonthArray, {year: subyear});
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
    },

    getOfficer: function(d, actName) {
        activity = $filter('filter')(activities, {name: actName})[0];
        months = this.chineDateNum(d);
        days = Math.floor(d.getTime() / 86400000) + 4;
        officerDay = (days - months) % 12;
        officer = activity['officer'][officerDay];
        return officer;
    },

    getRating: function(d, actName) {
        var dateTable = this.setDateTable(d);

        dayRating = 0;
        dayFilter = 0;

        dayRating += this.getGongDong(dateTable);

        dayRating += this.getSansSha(dateTable);
        
        dayRating += this.getSpecialQuality(d);

        dayRating += this.getStemCompatibility(dateTable.day.stem, dateTable.month.stem);

        if (actName) {
            effect28    = this.getEffect28(d, actName)
            officer     = this.getOfficer(d, actName);
            if (effect28 + officer > 0 && effect28 + officer + dayRating > 0) {
                dayFilter = effect28 + officer + dayRating;
            }
        }

        return {rating: dayRating, filter: dayFilter};
    },

    getGongDong: function(dateTable) {

        monthBranch = branches[dateTable['month']['branch']];
        dayBranch   = branches[dateTable['day']['branch']];
        dayStem     = stems[dateTable['day']['stem']];

        rating = dongGongRating[dongGongDefinition[monthBranch][dayBranch][dayStem]];
        return rating;
    },

    getSansSha: function(dateTable) {

        function sanShaArray($v) {
            $robbery    = [5, 2, 11, 8];
            $calamity   = [6, 3, 0, 9];
            $annual     = [7, 4, 1, 10]; 
            $n = $v % 4;
            return [$robbery[$n], $calamity[$n], $annual[$n]];
        }
        yearSanSha = sanShaArray(dateTable.year.branch);
        monthSanSha = sanShaArray(dateTable.month.branch);

        rating = 0;

        if (yearSanSha[0] == dateTable.day.branch || yearSanSha[1] == dateTable.day.branch || yearSanSha[2] == dateTable.day.branch) {
            rating -= 3;
        }

        if (monthSanSha[0] == dateTable.day.branch || monthSanSha[1] == dateTable.day.branch || monthSanSha[2] == dateTable.day.branch) {
            rating -= 2;
        }

        if (yearSanSha[0] == dateTable.month.branch || yearSanSha[1] == dateTable.month.branch || yearSanSha[2] == dateTable.month.branch) {
            rating -= 1;
        }
        return rating;
    },

    getSpecialQuality: function(d) {

        rating = 0;
        testDateStr = $filter('date')(d, 'dd.MM.yyyy');
        
        if (specialQuality.extictDay.indexOf(testDateStr) !== -1) {
            rating -= 4;
        }
        if (specialQuality.separatingDay.indexOf(testDateStr) !== -1) {
            rating -= 4;
        }
        if (specialQuality.tenBadDays.indexOf(testDateStr) !== -1) {
            rating -= 4;
        }

        return rating;
    },

    getStemCompatibility: function(stem1, stem2) {

        rating = 0;
        if (stem2 == stemCompatibility.combination[stem1]) {
            rating = 2;
        } else if (stem2 == stemCompatibility.counter[stem1]) {
            rating = -1;
        } else if (stem2 == stemCompatibility.clash[stem1]) {
            rating = -1;
        }

        return rating;
    },

    getStars: function(rating) {
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
        return stars;
    }

}});