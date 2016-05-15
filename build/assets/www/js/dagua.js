
var app = angular.module("ngDaGua", []);

app.factory("$dagua", function($filter) {return {

    getRating: function($hexagrams) {
        $hexaCombinations = [];
        angular.forEach($hexagrams, function($hexaFor, $k) {

            if ($hexaCombinations.length == 0) {
                if (typeof hexagrams[$k][0] == 'object') {
                    $hexaCombinations[0] = {};
                    $hexaCombinations[0][$k] = 0;
                }
                if (typeof hexagrams[$k][1] == 'object') {
                    $hexaCombinations[$hexaCombinations.length][$k] = 0;
                }
            } else {

                $tmpCount = $hexaCombinations.length;

                for ($i=0; $i<$tmpCount; $i++) {
                    if (typeof hexagrams[$k][0] == 'object' && typeof hexagrams[$k][1] == 'object') {
                        $hexaCombinations[$tmpCount + $i] = {};
                        angular.forEach($hexaCombinations[$i], function($hv, $hk) {
                            $hexaCombinations[$tmpCount + $i][$hk] = $hv;
                        });
                        $hexaCombinations[$tmpCount + $i][$k] = 1;

                        $hexaCombinations[$i][$k] = 0;
                    }
                    if (typeof hexagrams[$k][0] == 'object' && typeof hexagrams[$k][1] != 'object') {
                        $hexaCombinations[$i][$k] = 0;
                    }
                    if (typeof hexagrams[$k][0] != 'object' && typeof hexagrams[$k][1] == 'object') {
                        $hexaCombinations[$i][$k] = 1;
                    }
                }
            }
        });

        var $finalRating = 0;
        angular.forEach($hexaCombinations, function($hexaCombination, $k) {
            $testHexagram = {};
            angular.forEach($hexaCombination, function($hexaIndex, $k) {
                $testHexagram[$k] = $hexagrams[$k][$hexaIndex];
            });
            $testRating = this.getDaguaPersonal($testHexagram);
            if ($testRating > $finalRating) {
                $finalRating = $testRating;
            }
        }, this);

        return $finalRating;
    },

    getDaguaPersonal: function($hexagrams) {
        
        $dayHexagrams = {};
        $personHexagrams = {};
        angular.forEach($hexagrams, function($hexagram, $k) {
            if ($k.indexOf('person') == 0) {
                $personHexagrams[$k] = $hexagram;
            } else {
                $dayHexagrams[$k] = $hexagram;
            }
        });

        
        $dayRatings = this.getDagua($dayHexagrams);
        $ratings = [];
        for ($i=1; $i<=10; $i++) {
            $ratings[$i] =  $dayRatings[$i] || 0;
        }

        angular.forEach($personHexagrams, function($person, $k) {
            var $hexaWithPerson = $dayHexagrams;
            $hexaWithPerson['person'] = $person;
            var $personalRatings = this.getDagua($hexaWithPerson);
            //console.log($k);
            for ($i=1; $i<=10; $i++) {
                var $dr = $dayRatings[$i] || 0;
                var $pr = $personalRatings[$i] || 0;
                if ($dr > 0 && $pr == 0) {
                    $ratings[$i] -= $dr / 2;
                } else {
                    $ratings[$i] += $pr / 2;
                }
            }
        }, this);

        $rating = $ratings.reduce(function(a, b){
            return a + b;
        }, 0);
        return $rating;
    },

    getDagua: function($hexagrams) {
        
        var $rating = [];

        // equal GuaYun
        var $guaYunEqual = true;
        angular.forEach($hexagrams, function($hexagram, $k) {
            if (typeof $compare == 'undefined') {
                $compare = $hexagram['GuaYun'];
            }
            if ($hexagram['GuaYun'] != $compare) {
                $guaYunEqual = false;
            }
        });
        if ($guaYunEqual) {
            $rating[1] = 3;
        }

        // HeTu GuaYun
        if (this.getDaguaForPairs($hexagrams, 'GuaYun', 'isHetu')) {
            $rating[2] = 3;
        }

        // 51015 GuaYun
        if (this.getDaguaForPairs($hexagrams, 'GuaYun', 'is51015')) {
            $rating[3] = 3;
        }

        // equal GuaQi
        var $guaQiEqual = true;
        angular.forEach($hexagrams, function($hexagram, $k) {
            if (typeof $compare == 'undefined') {
                $compare = $hexagram['GuaQi'];
            }
            if ($hexagram['GuaQi'] != $compare) {
                $guaQiEqual = false;
            }
        });
        if ($guaQiEqual) {
            $rating[4] = 3;
        }

        // HeTu GuaQi
        if (this.getDaguaForPairs($hexagrams, 'GuaQi', 'isHetu')) {
            $rating[5] = 3;
        }

        // 51015 GuaQi
        if (this.getDaguaForPairs($hexagrams, 'GuaQi', 'is51015')) {
            $rating[6] = 3;
        }

        // blod link
        var $compare = false;
        var isBlodLink = true;
        angular.forEach($hexagrams, function($hexagram, $k) {
            if (!$compare) {
                $compare = $hexagram['blood-link'];
            } else {
                $isIntersect = $compare.filter(function(n) {
                    return $hexagram['blood-link'].indexOf(n) != -1;
                });
                if ($isIntersect.length == 0) {
                    isBlodLink = false;
                } else {
                    $compare = $isIntersect;
                }
            }
        });
        if (isBlodLink) {
            $rating[7] = 6;
        }

        // star 7 robbery
        if (this.getDaguaForPairs($hexagrams, 'star7robbery', 'isEqual', 'id')) {
            $rating[8] = 4;
        }

        // Sheng In Ke In

        var isShengInKeIn = true;
        angular.forEach($hexagrams, function($hexagram, $k) {
            if ($k != 'day') {
                if (!this.isShengInKeIn($hexagrams['day']['GuaQi'], $hexagram['GuaQi'])) {
                    isShengInKeIn = false;
                }
            }
        }, this);
        if (isShengInKeIn) {
            $rating[9] = 2;
        }

        // Mutual connection
        if (this.getDaguaForPairs($hexagrams, 'GuaYun', 'isMutual')) {
            $rating[10] = 2;
        }

        return $rating;
    },

    getDaguaForPairs: function ($hexagrams, $position, $compareFunction, $position2) {
        $daGuaFor = [];
        angular.forEach($hexagrams, function($hexagram, $k) {
            $daGuaFor.push($k);
        });
        $inpairs = {};
        $pairs = [];
        $combiPairs = [];

        $daGuaFor2 = $daGuaFor;
        angular.forEach($daGuaFor, function($for1, $k) {
            delete ($daGuaFor2[$k]);
            angular.forEach($daGuaFor2, function($for2, $k) {
                eval('var compareFunction = this.' + $compareFunction);
                $position2 = $position2 || $position;
                $pairValue = compareFunction($hexagrams[$for1][$position], $hexagrams[$for2][$position2], this);
                if ($pairValue != 0) {
                    if ($pairValue == 'combi') {
                        $combiPairs.push([$for1, $for2]);
                    } else {
                        $inpairs[$for1] = 1;
                        $inpairs[$for2] = 1;
                    }
                }
            }, this);
        }, this);
        
        var $plus = true;
        angular.forEach($combiPairs, function($combiPair) {
            if ($inpairs[$combiPair[0]] || $inpairs[$combiPair[1]]) {
                $inpairs[$combiPair[0]] = 1;
                $inpairs[$combiPair[1]] = 1;
            }
        })

        angular.forEach($hexagrams, function($hexagram, $for1) {
            if ($inpairs[$for1] != 1) {
                $plus = false;
            }
        })

        return $plus;
    },

    isHetu: function($a, $b) {
        var $HeTuPairs = [0, 6, 7, 8 ,9];

        if ($a == $HeTuPairs[$b] || $b == $HeTuPairs[$a]) {
            return 'HE TU';
        } else {
            return 0;
        }
    },

    is51015: function($a, $b, context) {
        if ($a + $b == 5 || $a + $b == 10 || $a + $b == 15) {
            return 'SUM ' + ($a + $b);
        } else {
            if (context && context.isHetu($a, $b)) {
                return 'combi';
            } else {
                return 0;
            }
        }
    },

    isEqual: function($a, $b) {
        if ($a == $b) {
            return 'Equal';
        } else {
            return 0;
        }
    },

    isMutual: function($a, $b, context) {
        var $MutualPairs = [0, 3, 4, 0, 6, 0, 8, 9];
        if ($a == $MutualPairs[$b] || $b == $MutualPairs[$a]) {
            return 'Mutual';
        } else {
            if (context.isHetu($a, $b) || context.is51015($a, $b)) {
                return 'combi';
            } else {
                return 0;
            }
        }
    },

    isShengInKeIn: function($dGuaQi, $GuaQi){
        $QiElements = [0, 'water', 'fire', 'wood', 'metal', 'earth', 'water', 'fire', 'wood', 'metal'];
        
        if ($QiElements[$dGuaQi]=='water' && $QiElements[$GuaQi]=='metal') {
            return 'Sheng IN'; 
        }
                
        if ($QiElements[$dGuaQi]=='wood') {
            if ($QiElements[$GuaQi]=='water' ) return 'Sheng IN';  
            if ($QiElements[$GuaQi]=='metal' ) return 'Ke IN';  
        }
                
        if($QiElements[$dGuaQi]=='fire'){
            if($QiElements[$GuaQi]=='wood' ) return 'Sheng IN';  
            if($QiElements[$GuaQi]=='water' ) return 'Ke IN';  
        }

        if($QiElements[$dGuaQi]=='metal' && $QiElements[$GuaQi]=='fire') {
            return 'Ke IN';
        }

        return false;
    }

}});