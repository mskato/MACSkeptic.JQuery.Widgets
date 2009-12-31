MACSkepticWidgets.runTests = (function () {
    module('MACSkepticWidgets');

    test("It should be defined", function () {
        ok(MACSkepticWidgets, 'MACSkepticWidgets');
    });

    test("It should define the functions: 'load', 'reload', 'get', and 'createAjaxWidget'", function() {
        ok(typeof(MACSkepticWidgets.load) == 'function', 'load');
        ok(typeof(MACSkepticWidgets.reload) == 'function', 'reload');
        ok(typeof(MACSkepticWidgets.get) == 'function', 'get');
        ok(typeof(MACSkepticWidgets.createAjaxWidget) == 'function', 'createAjaxWidget');
    });
    
    module('MACSkepticWidgets.all');
    
    test("It should be defined", function () {
        ok(MACSkepticWidgets.all, 'all');
    });
    
    test("It should define the functions: 'load', 'reload', 'render', and 'sortable'", function() {
        ok(typeof(MACSkepticWidgets.all.load) == 'function', 'load');
        ok(typeof(MACSkepticWidgets.all.reload) == 'function', 'reload');
        ok(typeof(MACSkepticWidgets.all.render) == 'function', 'render');
        ok(typeof(MACSkepticWidgets.all.sortable) == 'function', 'sortable');
    });
    
});