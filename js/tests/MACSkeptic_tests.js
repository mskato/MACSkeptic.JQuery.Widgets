"use strict";
/*!
 * MACSkeptic Widgets JavaScript Library v1.0
 *
 * Copyright (c) 2010 Mozair Alves do Carmo Junior, http://codevil.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Date: 2010-01-06 22:11:01 -0300 (Wed, 06 Jan 2010)
 */

QUnit.reset = function () {
    MACSkeptic.widgets.all.clear();
};

String.tests = function () {
    module('String');
    
    (function lowerize() {
        module('String.lowerize');
        
        test("It should be defined", function () {
            ok(typeof(''.lowerize) === 'function', 'lowerize');
        });
        
        test("It should return itself if empty", function () {
            ok(''.lowerize() === '');
        });
        
        test("It should return itself lower if one char long", function () {
            ok('A'.lowerize() === 'a', 'A');
            ok('Z'.lowerize() === 'z', 'Z');
            ok('G'.lowerize() === 'g', 'G');
            ok('a'.lowerize() === 'a', 'a');
            ok('z'.lowerize() === 'z', 'z');
            ok('i'.lowerize() === 'i', 'i');
        });
        
        test("It should only lower the first char", function () {
            ok('ABCDEFG'.lowerize() === 'aBCDEFG', 'ABCDEFG');
            ok('AbCdEfG'.lowerize() === 'abCdEfG', 'AbCdEfG');
            ok('Abcdefg'.lowerize() === 'abcdefg', 'Abcdefg');
        });
    }());    
    
    (function supplant() {
        module('String.supplant');
        
        test("It should be defined", function () {
            ok(typeof(''.supplant) === 'function', 'supplant');
        });
        
        test("It should replace the tokens with the arguments", function () {
            ok('{a}a{b}b{c}c{a}'.supplant({a: 'x', b: 'y', c: 'z'}) === 'xaybzcx');
        });
        
        test("It should leave missing keys alone", function () {
            ok('{a}a{b}b{c}c'.supplant({a: 'x', b: 'y'}) === 'xayb{c}c');
        });
        
        test("It should ignore extra keys", function () {
            ok('{a}a{b}b{c}c'.supplant({a: 'x', b: 'y', gundam: 'zgmfx20a'}) === 'xayb{c}c');
        });
    }());    
};

MACSkeptic = MACSkeptic || {};
MACSkeptic.tests = function () {
    module('MACSkeptic');
};

MACSkeptic.widgets = MACSkeptic.widgets || {};
MACSkeptic.widgets.tests = function () {
    module('MACSkeptic.widgets');

    test("It should be defined", function () {
        ok(typeof(MACSkeptic.widgets) === 'object', 'widgets');
    });

    (function load() {
        module('MACSkeptic.widgets.load');
        
        test("It should be defined", function () {
            ok(typeof(MACSkeptic.widgets.load) === 'function', 'load');
        });
    }());
    
    (function reload() {
        module('MACSkeptic.widgets.reload');
        
        test("It should be defined", function () {
            ok(typeof(MACSkeptic.widgets.reload) === 'function', 'reload');
        });
    }());
    
    (function get() {
        module('MACSkeptic.widgets.get');
        
        test("It should be defined", function () {
            ok(typeof(MACSkeptic.widgets.get) === 'function', 'get');
        });
    }());
    
    (function create() {
        module('MACSkeptic.widgets.create');
        
        test("It should be defined", function () {
            ok(typeof(MACSkeptic.widgets.create) === 'function', 'create');
        });
    }());
    
    (function toJson() {
        module('MACSkeptic.widgets.toJson');
        
        test("It should be defined", function () {        
            ok(typeof(MACSkeptic.widgets.toJson) === 'function', 'toJson');
        });
        
        test("It should return the json representation of a widget", function () {
            MACSkeptic.widgets.create({
                id: 'lumberWidget', 
                resource: { name: 'wood', id: 'oak' }, 
                parentContainer: 'div#left_column', 
                baseUri: 'http://mywidgets.com/',
                fullUri: 'http://my.widget.is.here.org/',
                title: 'Woodstock'
            });
            
            MACSkeptic.widgets.all.render().sortable();
            
            var jsonifiedWidget = $.parseJSON(MACSkeptic.widgets.toJson('lumberWidget'));
            ok(jsonifiedWidget, 'lumberWidget');
            ok(jsonifiedWidget.id === 'lumberWidget', 'lumberWidget.id');
            ok(jsonifiedWidget.resource, 'lumberWidget.resource');
            ok(jsonifiedWidget.resource.name === 'wood', 'lumberWidget.resource.name');
            ok(jsonifiedWidget.resource.id === 'oak', 'hungerWidget.resource.id');
            ok(jsonifiedWidget.parentContainer === 'div#left_column', 'lumberWidget.parentContainer');
            ok(jsonifiedWidget.baseUri === 'http://mywidgets.com/', 'lumberWidget.baseUri');
            ok(jsonifiedWidget.fullUri === 'http://my.widget.is.here.org/', 'thunderWidget.fullUri');
            ok(jsonifiedWidget.title === 'Woodstock', 'thunderWidget.title');
        });
    }());
    
    (function fromJson() {
        module('MACSkeptic.widgets.fromJson');
        
        test("It should be defined", function () {        
            ok(typeof(MACSkeptic.widgets.fromJson) === 'function', 'fromJson');
        });
        
        test("It should create the widgets based on the (parsed) json parameters", function () {
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
        
        test("It should create the widgets based on the (string) json parameters", function () {
            var testData = [
                '{',
                'widgets: [',
                '{',
                'id: "lumberWidget", ',
                'resource: { name: "wood" }, ',
                'parentContainer: "div#left_column", ',
                'BaseUri: "http://mywidgets.com/"',
                '},',
                '{',
                'Id: "hungerWidget", ',
                'Resource: { name: "food", Id: "pizza" }, ',
                'ParentContainer: "div#right_column", ',
                'title: "Pasta" ',
                '},',
                '{',
                '"Id": "thunderWidget", ',
                '"ParentContainer": "div#middle_column", ',
                '"fullUri": "http://my.widget.is.here.org/" ',
                '}]}'
            ].join('');
            
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
            
        (function load() {
            module('MACSkeptic.widgets.all.load');
            
            test("It should be defined", function () {
                ok(typeof(MACSkeptic.widgets.all.load) === 'function', 'load');
            });
        }());
        
        (function reload() {
            module('MACSkeptic.widgets.all.reload');
            
            test("It should be defined", function () {
                ok(typeof(MACSkeptic.widgets.all.reload) === 'function', 'reload');
            });
        }());
        
        (function render() {
            module('MACSkeptic.widgets.all.render');
            
            test("It should be defined", function () {
                ok(typeof(MACSkeptic.widgets.all.render) === 'function', 'render');
            });
        }());
        
        (function sortable() {
            module('MACSkeptic.widgets.all.sortable');
            
            test("It should be defined", function () {
                ok(typeof(MACSkeptic.widgets.all.sortable) === 'function', 'sortable');
            });
        }());
            
        (function clear() {
            module('MACSkeptic.widgets.all.clear');
            
            test("It should be defined", function () {
                ok(typeof(MACSkeptic.widgets.all.clear) === 'function', 'clear');
            });
            
            test("It should clear the database", function () {
                MACSkeptic.widgets.create({
                    id: 'lumberWidget', 
                    resource: { name: 'wood' }, 
                    parentContainer: 'div#left_column', 
                    baseUri: 'http://mywidgets.com/' 
                });
                MACSkeptic.widgets.create({
                    id: 'hungerWidget', 
                    resource: { name: 'food', Id: 'pizza' }, 
                    parentContainer: 'div#right_column', 
                    title: 'Pasta' 
                });
                MACSkeptic.widgets.create({
                    id: 'thunderWidget', 
                    parentContainer: 'div#middle_column', 
                    fullUri: 'http://my.widget.is.here.org/' 
                });
                
                MACSkeptic.widgets.all.clear();
                
                ok(!MACSkeptic.widgets.get('lumberWidget'), 'lumberWidget');
                ok(!MACSkeptic.widgets.get('hungerWidget'), 'hungerWidget');
                ok(!MACSkeptic.widgets.get('thunderWidget'), 'thunderWidget');
            });
        }());
        
        (function toJson() {
            module('MACSkeptic.widgets.all.toJson');
            
            test("It should be defined", function () {        
                ok(typeof(MACSkeptic.widgets.all.toJson) === 'function', 'toJson');
            });
            
            test("It should return the json representation of the widgets", function () {
                MACSkeptic.widgets.create({
                    id: 'lumberWidget', 
                    resource: { name: 'wood' }, 
                    parentContainer: 'div#left_column', 
                    baseUri: 'http://mywidgets.com/' 
                });
                MACSkeptic.widgets.create({
                    id: 'hungerWidget', 
                    resource: { name: 'food', id: 'pizza' }, 
                    parentContainer: 'div#right_column', 
                    title: 'Pasta' 
                });
                MACSkeptic.widgets.create({
                    id: 'thunderWidget', 
                    parentContainer: 'div#middle_column', 
                    fullUri: 'http://my.widget.is.here.org/' 
                });
                MACSkeptic.widgets.create({
                    id: 'dummyWidget', 
                    parentContainer: 'div#middle_column'
                });
                
                MACSkeptic.widgets.all.render().sortable();
                var jsonifiedWidgets = MACSkeptic.widgets.all.toJson();

                ok(typeof(jsonifiedWidgets) === 'string', 'jsonifiedWidgets as string');
                
                var parsedWidgets = $.parseJSON(jsonifiedWidgets);
                
                ok(typeof(parsedWidgets) === 'object', 'parsedWidgets');
                ok(typeof(parsedWidgets.widgets) === 'object', 'widgets');
                
                var widgets = parsedWidgets.widgets;
                ok(widgets.length === 4, 'widgets.length');
                
                (function checkLumberWidget() {
                    ok(widgets[0].id === 'lumberWidget', 
                        'parsedWidgets[0].id');
                    ok(typeof(widgets[0].resource) === 'object', 
                        'parsedWidgets[0].resource');
                    ok(widgets[0].resource.name === 'wood', 
                        'parsedWidgets[0].resource.name');
                    ok(widgets[0].parentContainer === 'div#left_column', 
                        'parsedWidgets[0].parentContainer');
                    ok(widgets[0].baseUri === 'http://mywidgets.com/', 
                        'parsedWidgets[1].baseUri');
                }());
                
                (function checkThunderWidget() {
                    ok(widgets[1].id === 'thunderWidget', 
                        'parsedWidgets[1].id');
                    ok(widgets[1].parentContainer === 'div#middle_column', 
                        'parsedWidgets[1].parentContainer');
                    ok(widgets[1].fullUri === 'http://my.widget.is.here.org/', 
                        'parsedWidgets[1].fullUri');
                }());    
                
                (function checkDummyWidget() {
                    ok(widgets[2].id === 'dummyWidget', 
                        'parsedWidgets[2].id');
                    ok(widgets[2].parentContainer === 'div#middle_column', 
                        'parsedWidgets[2].parentContainer');
                }());
                
                (function checkHungerWidget() {                
                    ok(widgets[3].id === 'hungerWidget', 
                        'parsedWidgets[3].id');
                    ok(typeof(widgets[3].resource) === 'object', 
                        'parsedWidgets[3].resource');
                    ok(widgets[3].resource.name === 'food', 
                        'parsedWidgets[3].resource.name');
                    ok(widgets[3].resource.id === 'pizza', 
                        'parsedWidgets[3].resource.id');
                    ok(widgets[3].parentContainer === 'div#right_column', 
                        'parsedWidgets[3].parentContainer');
                    ok(widgets[3].title === 'Pasta', 
                        'parsedWidgets[3].title');
                }());
            });
        }());
    }());
};

MACSkeptic.helpers = MACSkeptic.helpers || {};
MACSkeptic.helpers.tests = function () {
    module('MACSkeptic.helpers');
    
    (function lowerize() {
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
            ok(MACSkeptic.helpers.lowerize(testData).child.aggregated.age === 10,
                'Child.aggregated.Age => child.aggregated.age');
        });
    }());
};

MACSkeptic.widget = MACSkeptic.widget || {};
MACSkeptic.widget.tests = function () {
    module('MACSkeptic.widget');
    
    (function composeUri() {
        module('MACSkeptic.widget.composeUri');
        
        test("It should return the fullUri if it is present", function () {
            var thorWidget = MACSkeptic.widgets.create({
                id: 'thorWidget', 
                parentContainer: 'div#middle_column', 
                fullUri: 'http://my.widget.is.here.org/',
                resource: { name: 'some', id: 'other' }, 
                baseUri: 'http://it.doesnt.matter.com/'
            });
            
            ok(thorWidget.composeUri() === 'http://my.widget.is.here.org/');
        });
        
        test('It should return the baseUri + resource(name/id)', function () {
            var thorWidget = MACSkeptic.widgets.create({
                id: 'thorWidget', 
                parentContainer: 'div#middle_column', 
                resource: { name: 'some', id: 'other' }, 
                baseUri: 'http://it.doesnt.matter.com/'
            });
            
            ok(thorWidget.composeUri() === 'http://it.doesnt.matter.com/some/other');
        });
        
        test('It should return the baseUri + resource(name)', function () {
            var thorWidget = MACSkeptic.widgets.create({
                id: 'thorWidget', 
                parentContainer: 'div#middle_column', 
                resource: { name: 'some' }, 
                baseUri: 'http://it.doesnt.matter.com/'
            });
            
            ok(thorWidget.composeUri() === 'http://it.doesnt.matter.com/some');
        });
        
        test('It should return the baseUri + id', function () {
            var thorWidget = MACSkeptic.widgets.create({
                id: 'thorWidget', 
                parentContainer: 'div#middle_column', 
                baseUri: 'http://it.doesnt.matter.com/'
            });
            
            ok(thorWidget.composeUri() === 'http://it.doesnt.matter.com/thorWidget');
        });
        
        test('It should return Widgets + id', function () {
            var thorWidget = MACSkeptic.widgets.create({
                id: 'thorWidget', 
                parentContainer: 'div#middle_column'
            });
            
            ok(thorWidget.composeUri() === 'Widgets/thorWidget');
        });
        
        test('It should return Widgets + resource(name)', function () {
            var thorWidget = MACSkeptic.widgets.create({
                id: 'thorWidget', 
                parentContainer: 'div#middle_column',
                resource: { name: 'some' }
            });
            
            ok(thorWidget.composeUri() === 'Widgets/some');
        });
        
        test('It should return Widgets + resource(name/id)', function () {
            var thorWidget = MACSkeptic.widgets.create({
                id: 'thorWidget', 
                parentContainer: 'div#middle_column',
                resource: { name: 'some', id: 'other' }
            });
            
            ok(thorWidget.composeUri() === 'Widgets/some/other');
        });
    }());
};