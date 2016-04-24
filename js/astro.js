var app = angular.module("ngAstro", ['ngAstroSource', 'ngDaGua']);

app.factory("$astro", function($rootScope, $filter, $dagua, $source) {return {

    getActivities: function() {
        return $source.activities;
    },

    setDateTable: function(d) {
        var dateTable = {year:{}, month:{}, day:{}};

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

    setDateTableHour: function(d, $h) {
        $hDiff = ($h < 3)? 17 : (($h < 23)? -3 : -23);
        $byHour = Math.floor(($h + $hDiff) / 2);
        $stem =  $byHour - (4 - (Math.floor(d.getTime() / 86400000) + 3) % 5) * 2;
        if ($stem < 0) $stem += 10;
        $branch = ($h > 22)? 0 : Math.floor(($h + 1)/2);
        return [$stem, $branch];
    },

    day28: function(d) {
        d28 = (Math.floor(d.getTime() / 86400000) + 8) % 28 + 1;
        return d28;
    },

    getEffect28: function(d, actName) {
        activity = $filter('filter')($source.activities, {name: actName})[0];
        d28 = this.day28(d);
        effect = activity['effect'][d28-1];
        return effect;
    },

    chineDateNum: function(d, type) {
        euroYear    = d.getFullYear();
        euroMonth   = d.getMonth();
        euroDay     = d.getDate();
        
        yearSource = $filter('filter')($source.yearMonthArray, {year: euroYear});
        if (yearSource.length < 1 || yearSource[0]['months'].length < 12) {
            subyear = (euroYear < 2000)? 1900 : 2050;
            yearSource = $filter('filter')($source.yearMonthArray, {year: subyear});
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
        activity = $filter('filter')($source.activities, {name: actName})[0];
        months = this.chineDateNum(d);
        days = Math.floor(d.getTime() / 86400000) + 4;
        officerDay = (days - months) % 12;
        officer = activity['officer'][officerDay];
        return officer;
    },

    getRating: function(d, actName, person) {
        var dateTable = this.setDateTable(d);

        dayRating = 0;
        dayFilter = 0;

        dayRating += this.getGongDong(dateTable);
        dayRating += this.getSansSha(dateTable);
        dayRating += this.getSpecialQuality(d);
        dayRating += this.getStemCompatibility(dateTable.day.stem, dateTable.month.stem);
        dayRating += this.getBranchCompatibility(dateTable.day.branch, dateTable.month.branch, 0);
        dayRating += this.getStemCompatibility(dateTable.day.stem, dateTable.year.stem);
        dayRating += this.getBranchCompatibility(dateTable.day.branch, dateTable.year.branch, 1);
        dayRating += this.getBranchCompatibility(dateTable.month.branch, dateTable.year.branch, 2);

        if (person) {
            bornDate = new Date(person);
            var bornTable = this.setDateTable(bornDate);

            dayRating += this.getStemCompatibility(bornTable.year.stem, dateTable.day.stem);
            dayRating += this.getBranchCompatibility(bornTable.year.branch, dateTable.day.branch, 2);
        }

        hexagrams = this.getHexagrams(dateTable, bornTable);
        dayRating += $dagua.getRating(hexagrams);

        if (actName) {
            effect28    = this.getEffect28(d, actName)
            officer     = this.getOfficer(d, actName);
            if (effect28 + officer > 0 && effect28 + officer + dayRating > 0) {
                dayFilter = effect28 + officer + dayRating;
            }
        }

        return {rating: dayRating, filter: dayFilter};
    },

    getRatingForHours: function(d, actName, person) {
        var dateTable = this.setDateTable(d);
        if (person) {
            bornDate = new Date(person);
            var bornTable = this.setDateTable(bornDate);
        }
        var $hourData = [];
        for ($h=0; $h<24; $h+=2) {
            dayRating = 0;

            $hourTable = this.setDateTableHour(d, $h);
            dateTable['hour'] = {};
            dateTable['hour']['stem'] = $hourTable[0];
            dateTable['hour']['branch'] = $hourTable[1];
            
            hexagrams = this.getHexagrams(dateTable, bornTable);
            dayRating += $dagua.getRating(hexagrams);
            $hourData.push(dayRating);
            $hourData.push(dayRating);
        }
        return $hourData;
        
    },

    getGongDong: function(dateTable) {

        monthBranch = $source.branches[dateTable['month']['branch']];
        dayBranch   = $source.branches[dateTable['day']['branch']];
        dayStem     = $source.stems[dateTable['day']['stem']];

        rating = $source.dongGongRating[$source.dongGongDefinition[monthBranch][dayBranch][dayStem]];
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
        
        if ($source.specialQuality.extictDay.indexOf(testDateStr) !== -1) {
            rating -= 4;
        }
        if ($source.specialQuality.separatingDay.indexOf(testDateStr) !== -1) {
            rating -= 4;
        }
        if ($source.specialQuality.tenBadDays.indexOf(testDateStr) !== -1) {
            rating -= 4;
        }

        return rating;
    },

    getStemCompatibility: function(stem1, stem2) {
        rating = 0;
        if (stem2 == $source.stemCompatibility.combination[stem1]) {
            rating = 2;
        } else if (stem2 == $source.stemCompatibility.counter[stem1]) {
            rating = -1;
        } else if (stem2 == $source.stemCompatibility.clash[stem1]) {
            rating = -1;
        }

        return rating;
    },

    getBranchCompatibility: function(branch1, branch2, type) {

        rating = 0;
        brachCompatibility = $source.branchCompatibility[branch1][branch2];
        if (brachCompatibility != null) {
            compatibilities = brachCompatibility.split('|');
            for (i=0; i<compatibilities.length; i++) {
                rating += $source.branchCompatibilityRating[compatibilities[i]][type];
            }
        }

        return rating;
    },

    getHexagrams: function(dateTable, bornTable){
        allhexagrams = [];
        angular.forEach($source.hexagrams, function(value, key) {
            hexa1 = {};
            for (i=0; i<$source.hexagramKeys.length; i++) {
                hexa1[$source.hexagramKeys[i]] = value[i];
            }
            hexa1['id'] = key;
            allhexagrams[key] = hexa1;
        });

        hexagrams = {};
        angular.forEach(dateTable, function(value, key) {
            stem     = $source.stems[dateTable[key]['stem']];
            branch   = $source.branches[dateTable[key]['branch']];
            hexagrams[key] = $filter('filter')(allhexagrams, {stem: stem, branch: branch});
        });

        if (bornTable) {
            stem     = $source.stems[bornTable['year']['stem']];
            branch   = $source.branches[bornTable['year']['branch']];
            hexagrams['person'] = $filter('filter')(allhexagrams, {stem: stem, branch: branch});
        }
        return hexagrams;
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