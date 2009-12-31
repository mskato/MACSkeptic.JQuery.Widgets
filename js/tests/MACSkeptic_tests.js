MACSkeptic.tests = (function () {
    module('MACSkeptic');
    
    test("It should be defined", function () {
        ok(MACSkeptic, 'MACSkeptic');
    });
    
    test("It should define the properties: 'widgets' and 'helpers'", function() {
        ok(typeof(MACSkeptic.widgets) == 'object', 'widgets');
        ok(typeof(MACSkeptic.helpers) == 'object', 'helpers');
    });
});

MACSkeptic.widgets.tests = (function () {
    module('MACSkeptic.widgets');

    test("It should be defined", function () {
        ok(MACSkeptic.widgets, 'MACSkeptic.widgets');
    });
    test("It should define the functions: 'load', 'reload', 'get', and 'createAjaxWidget'", function() {
        ok(typeof(MACSkeptic.widgets.load) == 'function', 'load');
        ok(typeof(MACSkeptic.widgets.reload) == 'function', 'reload');
        ok(typeof(MACSkeptic.widgets.get) == 'function', 'get');
        ok(typeof(MACSkeptic.widgets.createAjaxWidget) == 'function', 'createAjaxWidget');
    });
    
    (function fromJson(){
        module('MACSkeptic.widgets.fromJson');
        
        test("It should be defined", function() {        
            ok(typeof(MACSkeptic.widgets.fromJson) == 'function', 'fromJson');
        });
        
        test("It should create the widgets based on the json parameters", function () {
            var testData = {
                widgets: [
                    {
                        id: 'lumberWidget', 
                        resource: { name: 'wood' }, 
                        parentContainer: 'div#left_column', 
                        BaseUri: 'http://mywidgets.com/' 
                    },
                    {
                        Id: 'hungerWidget', 
                        Resource: { name: 'food', Id: 'pizza' }, 
                        ParentContainer: 'div#right_column', 
                        title: 'Widget' 
                    },
                    {
                        Id: 'fullWidget', 
                        ParentContainer: 'div#middle_column', 
                        fullUri: 'http://my.widget.is.here.org/' 
                    }
                ]
            };
            
            MACSkeptic.widgets.fromJson(testData);
            
            ok(MACSkeptic.widgets.get('lumberWidget'), 'lumberWidget');
            ok(MACSkeptic.widgets.get('hungerWidget'), 'hungerWidget');
            ok(MACSkeptic.widgets.get('fullWidget'), 'fullWidget');
        });
    })();
    
    (function all() {
        module('MACSkeptic.widgets.all');
    
        test("It should be defined", function () {
            ok(MACSkeptic.widgets.all, 'all');
        });
        test("It should define the functions: 'load', 'reload', 'render', and 'sortable'", function() {
            ok(typeof(MACSkeptic.widgets.all.load) == 'function', 'load');
            ok(typeof(MACSkeptic.widgets.all.reload) == 'function', 'reload');
            ok(typeof(MACSkeptic.widgets.all.render) == 'function', 'render');
            ok(typeof(MACSkeptic.widgets.all.sortable) == 'function', 'sortable');
        });
    })();
});

MACSkeptic.helpers.tests = (function () {
    module('MACSkeptic.helpers.lowerize');
    
    test("It should lowerize the properties of a hashlike object", function () {
        var testData = { Id: 10, name: 'John' };
        ok(MACSkeptic.helpers.lowerize(testData).id == 10, 'Id => id');
        ok(MACSkeptic.helpers.lowerize(testData).name == 'John', 'name => name');
    });
    
    test("It should lowerize the properties of nested hashlike objects", function () {
        var testData = { 
            Id: 10, 
            name: 'John', 
            Child: { 
                Name: 'Pete',
                aggregated: {
                    Age: 10,
                    Heigh: 10.666
                }
            } 
        };
        ok(MACSkeptic.helpers.lowerize(testData).child, 'Child => child');
        ok(MACSkeptic.helpers.lowerize(testData).child.name == 'Pete', 'Child.Name => child.name');
        ok(MACSkeptic.helpers.lowerize(testData).child.aggregated, 'Child.aggregated => child.aggregated');
        ok(MACSkeptic.helpers.lowerize(testData).child.aggregated.age = 10, 'Child.aggregated.Age => child.aggregated.age');
    });
    
});