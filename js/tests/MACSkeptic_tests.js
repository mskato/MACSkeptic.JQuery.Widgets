﻿"use strict";

MACSkeptic.tests = function () {
    module('MACSkeptic');
    
    test("It should be defined", function () {
        ok(MACSkeptic, 'MACSkeptic');
    });
    
    test("It should define the properties: 'widgets' and 'helpers'", function () {
        ok(typeof(MACSkeptic.widgets) === 'object', 'widgets');
        ok(typeof(MACSkeptic.helpers) === 'object', 'helpers');
    });
};

MACSkeptic.widgets.tests = function () {
    module('MACSkeptic.widgets');

    test("It should be defined", function () {
        ok(MACSkeptic.widgets, 'MACSkeptic.widgets');
    });
    test("It should define the functions: 'load', 'reload', 'get', and 'create'", 
        function () {
            ok(typeof(MACSkeptic.widgets.load) === 'function', 'load');
            ok(typeof(MACSkeptic.widgets.reload) === 'function', 'reload');
            ok(typeof(MACSkeptic.widgets.get) === 'function', 'get');
            ok(typeof(MACSkeptic.widgets.create) === 'function', 'create');
        });
    (function fromJson() {
        module('MACSkeptic.widgets.fromJson');
        
        test("It should be defined", function () {        
            ok(typeof(MACSkeptic.widgets.fromJson) === 'function', 'fromJson');
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
                        title: 'Pasta' 
                    },
                    {
                        Id: 'thunderWidget', 
                        ParentContainer: 'div#middle_column', 
                        fullUri: 'http://my.widget.is.here.org/' 
                    }
                ]
            };
            
            var createdWidgets = MACSkeptic.widgets.fromJson(testData);
            
            ok(createdWidgets, 'return the created widgets');
            ok(createdWidgets.length === 3, 'correct number of widgets');
            
            (function assertThatLumberWidgetWasCreatedAsExpected() {
                ok(createdWidgets[0], 'lumberWidget');
                ok(createdWidgets[0].id === 'lumberWidget', 'lumberWidget.id');
                ok(createdWidgets[0].resource, 'lumberWidget.resource');
                ok(createdWidgets[0].resource.name === 'wood', 'lumberWidget.resource.name');
                ok(createdWidgets[0].parentContainer === 'div#left_column', 'lumberWidget.parentContainer');
                ok(createdWidgets[0].baseUri === 'http://mywidgets.com/', 'lumberWidget.baseUri');
            }());
            (function assertThatHungerWidgetWasCreatedAsExpected() {
                ok(createdWidgets[1], 'hungerWidget');
                ok(createdWidgets[1].id === 'hungerWidget', 'hungerWidget.id');
                ok(createdWidgets[1].resource, 'hungerWidget.resource');
                ok(createdWidgets[1].resource.name === 'food', 'hungerWidget.resource.name');
                ok(createdWidgets[1].resource.id === 'pizza', 'hungerWidget.resource.id');
                ok(createdWidgets[1].parentContainer === 'div#right_column', 'hungerWidget.parentContainer');
                ok(createdWidgets[1].title === 'Pasta', 'hungerWidget.title');
            }());
            (function assertThatFullWidgetWasCreatedAsExpected() {
                ok(createdWidgets[2], 'thunderWidget');
                ok(createdWidgets[2].id === 'thunderWidget', 'thunderWidget.id');
                ok(createdWidgets[2].parentContainer === 'div#middle_column', 'thunderWidget.parentContainer');
                ok(createdWidgets[2].fullUri === 'http://my.widget.is.here.org/', 'thunderWidget.fullUri');
            }());
            (function assertThatAllWidgetsWereAddedToTheMACSkepticObject() {
                ok(MACSkeptic.widgets.get('lumberWidget'), 'get(lumberWidget)');
                ok(MACSkeptic.widgets.get('hungerWidget'), 'get(hungerWidget)');
                ok(MACSkeptic.widgets.get('thunderWidget'), 'get(thunderWidget)');
            }());
        });
    }());
    
    (function all() {
        module('MACSkeptic.widgets.all');
    
        test("It should be defined", function () {
            ok(MACSkeptic.widgets.all, 'all');
        });
        test("It should define the functions: 'load', 'reload', 'render', and 'sortable'", 
            function () {
                ok(typeof(MACSkeptic.widgets.all.load) === 'function', 'load');
                ok(typeof(MACSkeptic.widgets.all.reload) === 'function', 'reload');
                ok(typeof(MACSkeptic.widgets.all.render) === 'function', 'render');
                ok(typeof(MACSkeptic.widgets.all.sortable) === 'function', 'sortable');
            });
    }());
};

MACSkeptic.helpers.tests = function () {
    module('MACSkeptic.helpers.lowerize');
    
    test("It should lowerize the properties of a hashlike object", function () {
        var testData = { Id: 10, name: 'John' };
        ok(MACSkeptic.helpers.lowerize(testData).id === 10, 'Id => id');
        ok(MACSkeptic.helpers.lowerize(testData).name === 'John', 'name => name');
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
        ok(MACSkeptic.helpers.lowerize(testData).child,
            'Child => child');
        ok(MACSkeptic.helpers.lowerize(testData).child.name === 'Pete',
            'Child.Name => child.name');
        ok(MACSkeptic.helpers.lowerize(testData).child.aggregated,
            'Child.aggregated => child.aggregated');
        ok(MACSkeptic.helpers.lowerize(testData).child.aggregated.age = 10,
            'Child.aggregated.Age => child.aggregated.age');
    });
    
};