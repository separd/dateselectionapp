angular.module("dateselectionguru", ["ngMaterial", "materialCalendar"]);
angular.module("dateselectionguru").config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme("default")
        .primaryPalette("brown")
        .accentPalette("green");
});

angular.module("dateselectionguru").controller("calendarCtrl", function($scope, $filter, $q, $timeout, $log, MaterialCalendarData) {

	$scope.yearMonthArray = [
            {year: 1900, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1901, months:[4,6,6,6,6,8,8,8,9,8,8,6]},
            {year: 1902, months:[5,6,6,6,7,8,8,8,9,8,8,6]},
            {year: 1903, months:[5,7,6,7,7,8,9,9,9,8,8,7]},
            {year: 1904, months:[5,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1905, months:[4,6,5,6,6,8,8,7,9,8,8,6]},
            {year: 1906, months:[5,6,6,6,6,8,8,8,9,8,8,6]},
            {year: 1907, months:[5,7,6,7,7,8,9,9,9,8,8,7]},
            {year: 1908, months:[5,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1909, months:[4,6,5,6,6,8,7,8,9,8,8,6]},
            {year: 1910, months:[5,6,6,5,6,8,8,8,9,8,8,6]},
            {year: 1911, months:[5,7,6,7,7,8,9,9,9,8,8,7]},
            {year: 1912, months:[5,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1913, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1914, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1915, months:[5,6,6,6,7,8,8,9,9,8,8,6]},
            {year: 1916, months:[5,6,5,6,6,7,8,8,8,8,6,6]},
            {year: 1917, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1918, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1919, months:[5,6,6,6,7,8,8,9,9,8,8,6]},
            {year: 1920, months:[5,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1921, months:[4,6,5,6,6,8,4,8,9,8,7,6]},
            {year: 1922, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1923, months:[5,6,6,6,7,8,8,9,9,8,8,6]},
            {year: 1924, months:[5,6,5,6,6,7,8,9,8,8,7,6]},
            {year: 1925, months:[4,6,5,6,6,8,8,8,9,8,7,6]},
            {year: 1926, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1927, months:[5,6,6,6,7,8,8,9,9,8,8,6]},
            {year: 1928, months:[5,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1929, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1930, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1931, months:[5,6,6,6,7,8,8,8,9,8,8,6]},
            {year: 1932, months:[5,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1933, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1934, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1935, months:[5,6,6,6,6,8,8,8,9,8,8,6]},
            {year: 1936, months:[5,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1937, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1938, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1939, months:[5,6,6,6,6,8,8,8,9,8,8,6]},
            {year: 1940, months:[5,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1941, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1942, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1943, months:[5,6,6,6,6,8,8,8,9,8,8,6]},
            {year: 1944, months:[5,6,5,5,6,7,8,8,8,7,7,6]},
            {year: 1945, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1946, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1947, months:[4,6,5,6,6,8,8,9,9,8,8,6]},
            {year: 1948, months:[5,5,5,5,6,7,7,8,8,7,7,5]},
            {year: 1949, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1950, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1951, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1952, months:[5,5,5,5,6,7,7,8,8,7,7,5]},
            {year: 1953, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1954, months:[4,6,5,6,6,8,8,8,9,8,7,6]},
            {year: 1955, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1956, months:[5,5,5,5,6,7,7,8,8,7,7,5]},
            {year: 1957, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1958, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1959, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1960, months:[5,5,5,5,6,7,7,7,8,7,7,5]},
            {year: 1961, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1962, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1963, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1964, months:[5,5,5,5,6,7,7,7,8,7,7,5]},
            {year: 1965, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1966, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1967, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1968, months:[5,5,5,5,5,7,7,7,8,7,7,5]},
            {year: 1969, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1970, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1971, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1972, months:[5,5,5,5,5,7,8,7,8,7,7,5]},
            {year: 1973, months:[4,6,5,5,6,7,8,8,8,7,7,6]},
            {year: 1974, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1975, months:[4,6,5,6,6,6,8,8,9,8,8,6]},
            {year: 1976, months:[5,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 1977, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 1978, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1979, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1980, months:[5,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 1981, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 1982, months:[4,6,5,6,6,7,8,9,8,8,7,6]},
            {year: 1983, months:[4,6,5,6,6,8,8,8,9,8,8,6]},
            {year: 1984, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 1985, months:[4,5,5,5,6,7,7,8,8,7,7,5]},
            {year: 1986, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1987, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1988, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 1989, months:[4,5,5,5,6,7,7,7,8,7,7,5]},
            {year: 1990, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 1991, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1992, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 1993, months:[4,5,5,5,6,7,7,7,8,7,7,5]},
            {year: 1994, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1995, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 1996, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 1997, months:[4,5,5,5,5,7,7,7,8,7,7,5]},
            {year: 1998, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 1999, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 2000, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2001, months:[4,5,5,5,5,7,7,7,8,7,7,5]},
            {year: 2002, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 2003, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 2004, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2005, months:[4,5,5,5,5,7,7,7,8,7,7,5]},
            {year: 2006, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 2007, months:[4,6,5,6,6,7,8,8,9,8,7,6]},
            {year: 2008, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2009, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2010, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 2011, months:[4,3,5,6,6,7,8,8,8,8,7,6]},
            {year: 2012, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2013, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2014, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 2015, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 2016, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2017, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2018, months:[4,5,5,5,6,7,7,8,8,7,7,5]},
            {year: 2019, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 2020, months:[4,5,4,5,5,6,7,7,8,7,7,5]},
            {year: 2021, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2022, months:[4,5,5,5,6,7,7,7,8,7,7,5]},
            {year: 2023, months:[4,6,5,6,6,7,8,8,8,8,7,6]},
            {year: 2024, months:[4,5,4,5,5,6,7,7,8,7,6,5]},
            {year: 2025, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2026, months:[4,5,5,5,5,7,7,7,8,7,7,5]},
            {year: 2027, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 2028, months:[4,5,4,5,5,6,7,7,8,7,6,5]},
            {year: 2029, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2030, months:[4,5,5,5,5,7,7,7,8,7,7,5]},
            {year: 2031, months:[4,6,5,6,6,7,8,8,8,7,7,6]},
            {year: 2032, months:[4,5,4,5,5,6,7,7,8,7,6,5]},
            {year: 2033, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2034, months:[4,5,5,5,5,7,7,7,8,7,7,5]},
            {year: 2035, months:[4,6,5,4,6,7,7,8,8,7,7,6]},
            {year: 2036, months:[4,5,4,5,5,6,7,7,8,7,6,5]},
            {year: 2037, months:[3,5,4,5,5,7,7,7,7,7,7,5]},
            {year: 2038, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2039, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 2040, months:[4,5,4,5,5,6,7,7,8,7,6,5]},
            {year: 2041, months:[3,5,4,5,6,7,7,7,8,7,7,5]},
            {year: 2042, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2043, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 2044, months:[4,5,4,5,5,6,7,7,7,7,6,5]},
            {year: 2045, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2046, months:[4,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2047, months:[4,6,5,5,6,7,7,8,8,7,7,6]},
            {year: 2048, months:[4,5,4,5,5,6,6,6,7,7,6,5]},
            {year: 2049, months:[3,5,4,5,5,6,7,7,8,7,7,5]},
            {year: 2050, months:[3,5,4,5,5,7,7,7,8,7,7,5]},
            {year: 2051, months:[4]},
        ];

	$scope.activities = [
		{group: 'job-public-affairs', id:1, name: 'start-new-job',
            effect: [1,-2, 0, 0, 0, 2, 0,-2,-2, 2,-2,-2, 2, 2, 0, 2, 2,-2, 0,-2, 0, 1,-2,-2, 2, 2,-2, 2],
            officer: [1, 0, 3, 2, 3, 2,-3,-2, 3, 0, 3,-3]},
		{group: 'job-public-affairs', id:2, name: 'start-trade-negotiations',
            effect: [2,-2, 2, 0, 0, 2, 0,-2,-2, 0,-2,-2, 2, 2, 0, 2, 2,-2, 2,-2, 0, 0,-2,-2, 2, 2,-2, 2],
            officer: [3, 0, 3, 3, 2, 3,-3,-2, 3, 0, 3,-3]},
		{group: 'job-public-affairs', id:3, name: 'start-public-events',
            effect: [2,-2, 2, 0, 0, 0, 0, 0,-2,-2,-2,-2, 2, 2,-2, 2, 2,-2, 0,-2, 0, 1,-2,-2, 2, 2,-2, 2],
            officer: [2,-3, 3, 2, 3, 3,-3,-2, 3, 0, 3,-3]},
		{group: 'job-public-affairs', id:4, name: 'start-new-business',
            effect: [2,-2, 2,-2, 0, 0, 0, 0,-2, 0,-2,-2, 2, 2,-2, 2, 2,-2, 0,-2, 0, 1,-2,-2, 2, 2,-2, 2],
            officer: [1, 0, 3, 2, 3, 2,-3,-2, 3, 0, 3,-3]},
		{group: 'job-public-affairs', id:5, name: 'new-profit-contracts',
            effect: [2,-2, 2,-2, 0, 2, 0, 0,-2, 0,-2,-2, 2, 2, 0, 2, 2,-2, 0,-2, 0,-2,-2,-2, 0, 2,-2, 2],
            officer: [0, 0, 3, 3, 3, 3,-3,-2, 3, 1, 3,-3]},
		{group: 'job-public-affairs', id:6, name: 'new-encumbrance-contracts',
            effect: [0, 0, 0, 0, 0, 2, 0, 0,-2, 0,-2,-2, 0, 0, 0, 0, 0,-2, 0,-2, 0, 0,-2,-2, 0, 0,-2, 0],
            officer: [0, 0,-3, 3, 0, 0, 0, 0, 0, 0, 0,-3]},
		{group: 'job-public-affairs', id:7, name: 'debt-recovery',
            effect: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0],
            officer: [0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0,-3]},
		{group: 'job-public-affairs', id:8, name: 'start-businesses-shops-offices',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            officer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,-3]},
		{group: 'job-public-affairs', id:9, name: 'depositing-funds-and-investment',
            effect: [2,-2, 2,-2, 0, 2, 0, 2,-2, 0,-2,-2, 2, 2, 0, 2, 2,-2, 0,-2, 0, 0,-2,-2, 0, 2,-2, 2],
            officer: [0, 0, 3, 0, 3, 3,-3,-2, 3, 0, 3,-3]},
		{group: 'job-public-affairs', id:10, name: 'lawsuits',
            effect: [0, 0, 0, 0,-2, 0, 0, 0,-2,-2,-2,-2, 0, 0,-2, 0, 0,-2, 0,-2, 0, 0,-2,-2, 0, 0,-2, 0],
            officer: [0, 0,-3, 3, 0, 0, 0, 0,-3, 0, 0,-3]},
		{group: 'job-public-affairs', id:11, name: 'religious-ceremonies',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            officer: [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0]},
		{group: 'relations', id:12, name: 'wedding',
            effect: [2,-2,-2, 2, 0, 2,-2, 0,-2,-2,-2,-2, 2, 2, 0, 2, 2,-2, 2,-2,-2,-2,-2,-2, 2, 2,-2, 2],
            officer: [1,-3,-2, 3, 3, 0,-3,-3, 3, 0, 3,-3]},
		{group: 'relations', id:13, name: 'betrothal',
            effect: [2,-2,-2, 2, 0, 2,-2, 0,-2, 0,-2,-2, 2, 2, 0, 2, 0,-2, 2,-2,-2,-2,-2,-2, 2, 2,-2, 2],
            officer: [1, 0,-2, 1, 3, 0,-3,-3, 3, 1, 1,-3]},
        {group: 'relations', id:14, name: 'end-personal-working-relationships',
            effect: [ 0, 0, 0, 0, 0, 0, 0, 0,-2, 0,-2,-2, 0, 0, 0, 0, 0,-2, 0,-2, 0, 0,-2,-2, 0, 0,-2, 0],
            officer: [0, 3,-3, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
        {group: 'relations', id:15, name: 'child-adoption',
            effect: [0, 0, 0, 0, 0, 0, 0, 0,-2, 0,-2,-2, 2, 2, 0, 2, 2,-2, 2,-2, 0, 0,-2,-2, 2, 2,-2, 2],
            officer: [0,-3, 0, 0, 0, 0,-3,-2, 3, 2, 0,-3]},
        {group: 'health', id:16, name: 'initiation-health-treatments',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            officer: [0, 3,-3, 0, 0, 0, 0,-3, 3,-3, 0, 0]},
        {group: 'health', id:17, name: 'medical-caregiving',
            effect: [0, 0, 0, 0, 0, 0, 0, 0,-2, 0,-2,-2, 0, 0, 0, 0, 0,-2, 0,-2, 0, 0,-2,-2, 0, 0,-2, 0],
            officer: [3, 0,-2, 0, 3, 0, 0,-2, 3,-3, 0,-3]},
        {group: 'health', id:18, name: 'surgical-removal',
            effect: [0, 0, 0, 0, 0, 0, 0, 0,-2, 0,-2,-2, 0, 0, 0, 0, 0,-2, 0,-2, 0, 0,-2,-2, 0, 0,-2, 0],
            officer: [0, 3,-1,-1, 0, 0, 0,-2, 0,-3, 0,-3]},
        {group: 'personal-affairs', id:19, name: 'cleaning',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            officer: [0, 3,-1,-1, 0, 0, 0, 0, 0,-2, 0,-3]},
        {group: 'personal-affairs', id:20, name: 'remove-things',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            officer: [0, 3,-1,-1, 0, 0, 3, 0, 0,-3, 0, 0]},
        {group: 'personal-affairs', id:21, name: 'purchase-pets',
            effect: [2, 0, 0, 0, 0, 0, 0, 0,-2, 0,-2,-2, 2, 2, 0, 2, 0,-2, 0,-2, 0, 0,-2,-2, 0, 2,-2, 2],
            officer: [0,-3, 0, 0, 3, 0,-3,-2, 3, 2, 3,-3]},
        {group: 'personal-affairs', id:22, name: 'travelling',
            effect: [2, 0, 0, 2,-2, 0, 0, 0,-2, 0,-2,-2, 2, 2, 2, 2, 0,-2, 0,-2, 2, 0,-2,-2, 0, 2,-2, 2],
            officer: [3,-3, 0, 3,-2,-3,-3,-3, 3, 0, 3,-3]},
        {group: 'personal-affairs', id:23, name: 'start-study-course-training',
            effect: [1, 0, 0, 0, 0, 0, 0, 0,-2, 2,-2,-2, 2, 2, 0, 2, 0,-2, 0,-2, 0, 1,-2,-2, 2, 2,-2, 2],
            officer: [3, 0, 0, 2, 2, 3,-3,-2, 3, 3, 3,-3]},
        {group: 'feng-shui-activity', id:24, name: 'start-new-building',
            effect: [0,-2,-2, 0, 0, 2, 2, 2,-2, 0, 0,-2, 2, 2, 0, 2, 2,-2, 2,-2, 2, 2,-2, 0, 0, 2,-2, 2],
            officer: [3,-2, 0, 3, 3, 3,-3,-3, 3, 0, 0,-3]},
        {group: 'feng-shui-activity', id:25, name: 'start-reconstructions',
            effect: [0, 0,-2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            officer: [3, 0, 0, 0, 0, 3,-3,-3, 3, 0, 0,-3]},
        {group: 'feng-shui-activity', id:26, name: 'general-site-excavation',
            effect: [2, 0, 0, 0,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2,-2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0],
            officer: [-3, 0,-3, 0, 0, 3,-3, 3, 0, 0,-3,-3]},
        {group: 'feng-shui-activity', id:27, name: 'demolitions',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            officer: [-3, 3,-3, 0, 0, 0, 3, 0,-2, 0, 0,-3]},
        {group: 'feng-shui-activity', id:28, name: 'moving-in-new-area',
            effect: [2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            officer: [0,-3, 0, 0,-2,-2,-3,-3, 3, 0, 0,-3]},
        {group: 'feng-shui-activity', id:29, name: 'installation-new-furnishings',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            officer: [0,-2, 3, 0, 0, 0,-3,-3, 3, 0, 0,-3]},
        {group: 'feng-shui-activity', id:30, name: 'changing-beds-position',
            effect: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            officer: [0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0,-3]},
        {group: 'feng-shui-activity', id:31, name: 'fundamentals-of-building',
            effect: [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,-2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            officer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
        {group: 'feng-shui-activity', id:32, name: 'installation-of-interior-doors',
            effect: [2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2,-2, 0, 0, 0, 0, 2,-2, 0, 0, 2, 0, 0,-2, 0, 2,-2, 0],
            officer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
        {group: 'feng-shui-activity', id:33, name: 'installation-of-water-features',
            effect: [0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2,-2, 0, 0, 0, 0, 2,-2, 0, 0, 0, 2, 0,-2, 0, 2, 0, 0],
            officer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
	];
	$scope.defaulActivity = $scope.activities[1];

    
    $scope.visibleDates = [];
    /*for (dkey=0; dkey<$scope.visibleDates.length; dkey++) {
        day = $scope.visibleDates[dkey];
        $scope.test = getEffect28(null, 'start-new-job');
    }*/

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

        chinaYear = (euroMonth > 1 || (euroMonth == 1 && euroDay >= yearArray[0]))? euroYear : euroYear - 1

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
        scopeRating = 0;
        effect28    = getEffect28(d, actName)
        officer     = getOfficer(d, actName);
        if (!(effect28 == 0 && officer == 0) && (effect28 + officer) > 0) {
            scopeRating = effect28 + officer;// + $DayRating;
        }

        return /*effect28 + ' + ' + officer + ' = ' + */scopeRating;
    }


// Here I'm just calculating the groups when the controller runs
// You would probably want to use a $watch if you expected the list to change
  $scope.groupList = $scope.activities.reduce(function(previous, current) {
    if (previous.indexOf(current.group) === -1) {
      previous.push(current.group);
    }

    return previous;
  }, []);

	// CALENDAR

    $scope.selectedDate = null;
    $scope.weekStartsOn = 1;
    $scope.dayFormat = "d";
    $scope.tooltips = true;
    $scope.disableFutureDates = false;

    $scope.fullscreen = function() {
        var elem = document.querySelector("#calendar-demo");
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };

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

        angular.forEach(MaterialCalendarData.data, function(value, key) { 
            var date = new Date(key);
            dayValue = getRating(date, activity.name);
            MaterialCalendarData.setDayContent(date, setDayHtml(dayValue));
        });
    }

    function setDayHtml(dayValue) {
        if (dayValue == 0) {
            return '';
        } else {
            return '<div class="activity activity' + dayValue + '" layout-align="center center"></div>';
        }
    }

   // var holidays = {"2015-01-01":[{"name":"Last Day of Kwanzaa","country":"US","date":"2015-01-01"},{"name":"New Year's Day","country":"US","date":"2015-01-01"}],"2015-01-06":[{"name":"Epiphany","country":"US","date":"2015-01-06"}],"2015-01-07":[{"name":"Orthodox Christmas","country":"US","date":"2015-01-07"}],"2015-01-19":[{"name":"Martin Luther King, Jr. Day","country":"US","date":"2015-01-19"}],"2015-02-02":[{"name":"Groundhog Day","country":"US","date":"2015-02-02"}],"2015-02-14":[{"name":"Valentine's Day","country":"US","date":"2015-02-14"}],"2015-02-16":[{"name":"Washington's Birthday","country":"US","date":"2015-02-16"}],"2015-02-18":[{"name":"Ash Wednesday","country":"US","date":"2015-02-18"}],"2015-03-08":[{"name":"International Women's Day","country":"US","date":"2015-03-08"}],"2015-03-17":[{"name":"Saint Patrick's Day","country":"US","date":"2015-03-17"}],"2015-03-29":[{"name":"Palm Sunday","country":"US","date":"2015-03-29"}],"2015-04-01":[{"name":"April Fools' Day","country":"US","date":"2015-04-01"}],"2015-04-03":[{"name":"Good Friday","country":"US","date":"2015-04-03"}],"2015-04-05":[{"name":"Easter","country":"US","date":"2015-04-05"}],"2015-04-22":[{"name":"Earth Day","country":"US","date":"2015-04-22"}],"2015-04-24":[{"name":"Arbor Day","country":"US","date":"2015-04-24"}],"2015-05-01":[{"name":"May Day","country":"US","date":"2015-05-01"}],"2015-05-04":[{"name":"Star Wars Day","country":"US","date":"2015-05-04"}],"2015-05-05":[{"name":"Cinco de Mayo","country":"US","date":"2015-05-05"}],"2015-05-10":[{"name":"Mother's Day","country":"US","date":"2015-05-10"}],"2015-05-25":[{"name":"Memorial Day","country":"US","date":"2015-05-25"}],"2015-06-14":[{"name":"Flag Day","country":"US","date":"2015-06-14"}],"2015-06-21":[{"name":"Father's Day","country":"US","date":"2015-06-21"}],"2015-06-27":[{"name":"Helen Keller Day","country":"US","date":"2015-06-27"}],"2015-07-04":[{"name":"Independence Day","country":"US","date":"2015-07-04"}],"2015-08-26":[{"name":"Women's Equality Day","country":"US","date":"2015-08-26"}],"2015-09-07":[{"name":"Labor Day","country":"US","date":"2015-09-07"}],"2015-09-11":[{"name":"Patriot Day","country":"US","date":"2015-09-11"}],"2015-09-13":[{"name":"Grandparent's Day","country":"US","date":"2015-09-13"}],"2015-09-17":[{"name":"Constitution Day","country":"US","date":"2015-09-17"}],"2015-10-06":[{"name":"German-American Day","country":"US","date":"2015-10-06"}],"2015-10-09":[{"name":"Leif Erkson Day","country":"US","date":"2015-10-09"}],"2015-10-12":[{"name":"Columbus Day","country":"US","date":"2015-10-12"}],"2015-10-31":[{"name":"Halloween","country":"US","date":"2015-10-31"}],"2015-11-03":[{"name":"Election Day","country":"US","date":"2015-11-03"}],"2015-11-11":[{"name":"Veterans Day","country":"US","date":"2015-11-11"}],"2015-11-26":[{"name":"Thanksgiving Day","country":"US","date":"2015-11-26"}],"2015-11-27":[{"name":"Black Friday","country":"US","date":"2015-11-27"}],"2015-12-07":[{"name":"Pearl Harbor Remembrance Day","country":"US","date":"2015-12-07"}],"2015-12-08":[{"name":"Immaculate Conception of the Virgin Mary","country":"US","date":"2015-12-08"}],"2015-12-24":[{"name":"Christmas Eve","country":"US","date":"2015-12-24"}],"2015-12-25":[{"name":"Christmas","country":"US","date":"2015-12-25"}],"2015-12-26":[{"name":"First Day of Kwanzaa","country":"US","date":"2015-12-26"}],"2015-12-27":[{"name":"Second Day of Kwanzaa","country":"US","date":"2015-12-27"}],"2015-12-28":[{"name":"Third Day of Kwanzaa","country":"US","date":"2015-12-28"}],"2015-12-29":[{"name":"Fourth Day of Kwanzaa","country":"US","date":"2015-12-29"}],"2015-12-30":[{"name":"Fifth Day of Kwanzaa","country":"US","date":"2015-12-30"}],"2015-12-31":[{"name":"New Year's Eve","country":"US","date":"2015-12-31"},{"name":"Sixth Day of Kwanzaa","country":"US","date":"2015-12-31"}],"2016-01-01":[{"name":"Last Day of Kwanzaa","country":"US","date":"2016-01-01"},{"name":"New Year's Day","country":"US","date":"2016-01-01"}],"2016-01-06":[{"name":"Epiphany","country":"US","date":"2016-01-06"}],"2016-01-07":[{"name":"Orthodox Christmas","country":"US","date":"2016-01-07"}],"2016-01-18":[{"name":"Martin Luther King, Jr. Day","country":"US","date":"2016-01-18"}],"2016-02-02":[{"name":"Groundhog Day","country":"US","date":"2016-02-02"}],"2016-02-10":[{"name":"Ash Wednesday","country":"US","date":"2016-02-10"}],"2016-02-14":[{"name":"Valentine's Day","country":"US","date":"2016-02-14"}],"2016-02-15":[{"name":"Washington's Birthday","country":"US","date":"2016-02-15"}],"2016-03-08":[{"name":"International Women's Day","country":"US","date":"2016-03-08"}],"2016-03-17":[{"name":"Saint Patrick's Day","country":"US","date":"2016-03-17"}],"2016-03-20":[{"name":"Palm Sunday","country":"US","date":"2016-03-20"}],"2016-03-25":[{"name":"Good Friday","country":"US","date":"2016-03-25"}],"2016-03-27":[{"name":"Easter","country":"US","date":"2016-03-27"}],"2016-04-01":[{"name":"April Fools' Day","country":"US","date":"2016-04-01"}],"2016-04-22":[{"name":"Earth Day","country":"US","date":"2016-04-22"}],"2016-04-29":[{"name":"Arbor Day","country":"US","date":"2016-04-29"}],"2016-05-01":[{"name":"May Day","country":"US","date":"2016-05-01"}],"2016-05-04":[{"name":"Star Wars Day","country":"US","date":"2016-05-04"}],"2016-05-05":[{"name":"Cinco de Mayo","country":"US","date":"2016-05-05"}],"2016-05-08":[{"name":"Mother's Day","country":"US","date":"2016-05-08"}],"2016-05-30":[{"name":"Memorial Day","country":"US","date":"2016-05-30"}],"2016-06-14":[{"name":"Flag Day","country":"US","date":"2016-06-14"}],"2016-06-19":[{"name":"Father's Day","country":"US","date":"2016-06-19"}],"2016-06-27":[{"name":"Helen Keller Day","country":"US","date":"2016-06-27"}],"2016-07-04":[{"name":"Independence Day","country":"US","date":"2016-07-04"}],"2016-08-26":[{"name":"Women's Equality Day","country":"US","date":"2016-08-26"}],"2016-09-05":[{"name":"Labor Day","country":"US","date":"2016-09-05"}],"2016-09-11":[{"name":"Grandparent's Day","country":"US","date":"2016-09-11"},{"name":"Patriot Day","country":"US","date":"2016-09-11"}],"2016-09-17":[{"name":"Constitution Day","country":"US","date":"2016-09-17"}],"2016-10-06":[{"name":"German-American Day","country":"US","date":"2016-10-06"}],"2016-10-09":[{"name":"Leif Erkson Day","country":"US","date":"2016-10-09"}],"2016-10-10":[{"name":"Columbus Day","country":"US","date":"2016-10-10"}],"2016-10-31":[{"name":"Halloween","country":"US","date":"2016-10-31"}],"2016-11-08":[{"name":"Election Day","country":"US","date":"2016-11-08"},{"name":"Super Tuesday","country":"US","date":"2016-11-08"}],"2016-11-11":[{"name":"Veterans Day","country":"US","date":"2016-11-11"}],"2016-11-24":[{"name":"Thanksgiving Day","country":"US","date":"2016-11-24"}],"2016-11-25":[{"name":"Black Friday","country":"US","date":"2016-11-25"}],"2016-12-07":[{"name":"Pearl Harbor Remembrance Day","country":"US","date":"2016-12-07"}],"2016-12-08":[{"name":"Immaculate Conception of the Virgin Mary","country":"US","date":"2016-12-08"}],"2016-12-24":[{"name":"Christmas Eve","country":"US","date":"2016-12-24"}],"2016-12-25":[{"name":"Christmas","country":"US","date":"2016-12-25"}],"2016-12-26":[{"name":"First Day of Kwanzaa","country":"US","date":"2016-12-26"}],"2016-12-27":[{"name":"Second Day of Kwanzaa","country":"US","date":"2016-12-27"}],"2016-12-28":[{"name":"Third Day of Kwanzaa","country":"US","date":"2016-12-28"}],"2016-12-29":[{"name":"Fourth Day of Kwanzaa","country":"US","date":"2016-12-29"}],"2016-12-30":[{"name":"Fifth Day of Kwanzaa","country":"US","date":"2016-12-30"}],"2016-12-31":[{"name":"New Year's Eve","country":"US","date":"2016-12-31"},{"name":"Sixth Day of Kwanzaa","country":"US","date":"2016-12-31"}]};

    // You would inject any HTML you wanted for
    // that particular date here.
    var numFmt = function(num) {
        num = num.toString();
        if (num.length < 2) {
            num = "0" + num;
        }
        return num;
    };

    $scope.setDayContent = function(date) {
        dayValue = getRating(date, 'start-trade-negotiations');
        return setDayHtml(dayValue);
    };

}); 