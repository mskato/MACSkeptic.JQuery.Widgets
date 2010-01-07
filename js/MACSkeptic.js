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
 
String.prototype.supplant = function (o) { 
    return this.replace(/\{([^{}]*)\}/g, 
        function (a, b) {  
            var r = o[b];
            return typeof r === 'string' ? 
                r : a; 
        }
    ); 
}; 

String.prototype.lowerize = function () {
    return !this ? this : (this.length <= 1 ? this.toLowerCase() : (
        this.charAt(0).toLowerCase() + this.substring(1)));
};

var MACSkeptic = { 
    helpers: (function () {
        function forEach(obj, action)
        {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    action(name, obj[name]);
                }
            }
        }
        return {
            lowerize: function (obj) {
                if (!obj || typeof(obj) !== 'object') {
                    return obj;
                }
                var result = {};
                forEach(obj, function (name, property) {
                    result[name.lowerize()] = 
                        MACSkeptic.helpers.lowerize(property);
                });
                return result;

            },
            explode: function (array, numberOfColumns) {
                if (!array || !(array instanceof Array)) {
                    return array;
                }
                var length = array.length;
                var lists = [];
                var stepDelta = [];
                for (var h = 0; h < numberOfColumns; h++) {
                    lists[h] = [];
                    stepDelta[h] = 0;
                }
                if (length < numberOfColumns) {
                    for (var i = 0; i < length; i++) {
                        lists[i].push(array[i]);
                    }
                    return lists;
                }
                var step = parseInt(length / numberOfColumns, 0);
                var mod = length % numberOfColumns;
                for (var j = 0; j < mod; j++) {
                    stepDelta[j]++;
                }
                var startPoint = 0;
                for (var k = 0; k < numberOfColumns; k++) {
                    var currStep = step + stepDelta[k];
                    lists[k] = $(array).slice(startPoint, startPoint + currStep);
                    startPoint += currStep; 
                }
                return lists;
            }
        };
    }()),
    widgets: (function (callbackParameters) {
        var templates = {
            widget: [
                '<div class="ajax_widget" id="{id}">',
                '<fieldset>',
                '<span class="legend widget_handle">{title}</span>',
                '<button class="ajax_widget_refresh" onclick="MACSkeptic.widgets.reload(\'{id}\')">',
                'Refresh',
                '</button>',
                '<span class="loading" />',
                '<div class="ajax_widget_content"></div>',
                '</fieldset>',
                '</div>'
            ].join('\n'),
            error: [
                '<p>An error has occurred!</p>',
                '<p><strong>Status Code:</strong> {status} </p>',
                '<p><strong>Status Description:</strong> {description} </p>',
                '<p><strong>Uri:</strong> {uri} </p>'
            ].join('\n')
        },
            theSort = [],
            widgetDatabase = {},
            callbacks = callbackParameters || {};

        function store(widgetToBeStored)
        {
            return widgetToBeStored && (widgetDatabase[widgetToBeStored.id] = widgetToBeStored);
        }
        
        function theWidgetIdentifiedByThis(id)
        {
            return widgetDatabase[id];
        }

        return {
            get: function getTheWidgetIdentifiedByThis(id) {
                return theWidgetIdentifiedByThis(id);
            },
            load: function loadTheWidgetIdentifiedByThis(id) {
                var selectedWidget = theWidgetIdentifiedByThis(id);
                return selectedWidget && selectedWidget.loadContent();
            },
            reload: function reloadTheWidgetIdentifiedByThis(id) {
                return this.load(id);
            },
            fromJson: function createAjaxWidgetBasedOnJason(data) {
                var parsedData = typeof(data) === 'string' ? $.parseJSON(data) : data,
                    createdWidgets = [];
                for (var i = 0; i < parsedData.widgets.length; i++) {
                    var lowerizedData = MACSkeptic.helpers.lowerize(parsedData.widgets[i]);
                    createdWidgets.push(MACSkeptic.widgets.create(lowerizedData));
                }
                return createdWidgets;
            },
            toJson: function jsonRepresentationOfTheAjaxWidgetIdentifiedByThis(id) {
                var selectedWidget = theWidgetIdentifiedByThis(id);
                return selectedWidget && selectedWidget.toJson();
            },
            all: {
                clear: function () {
                    for (var name in widgetDatabase) {
                        if (widgetDatabase.hasOwnProperty(name)) {
                            $(widgetDatabase[name].parentContainer).html('');
                        }
                    }
                    widgetDatabase = {};
                    
                    if (theSort && theSort.destroy) {
                        theSort.destroy();
                    }
                },
                render: function () {
                    for (var name in widgetDatabase) {
                        if (widgetDatabase.hasOwnProperty(name)) {
                            var currentWidget = theWidgetIdentifiedByThis(name);
                            currentWidget.renderContainer();
                        }
                    }
                    return this;
                },
                load: function () {
                    for (var name in widgetDatabase) {
                        if (widgetDatabase.hasOwnProperty(name)) {
                            var currentWidget = theWidgetIdentifiedByThis(name);
                            currentWidget.loadContent();
                        }
                    }
                    return this;
                },
                reload: function () {
                    return this.load();
                },
                sortable: function (specs) {
                    var options = specs || {};
                    $(function makeWidgetsSortable() {
                        theSort = $(options.container || "div.widget_container").sortable({
                            connectWith: options.alternative_container || options.container || 'div.widget_container',
                            cursor: 'move',
                            handle: 'span.widget_handle',
                            receive: function (ev, ui) {
                                MACSkeptic.widgets.get(ui.item.context.id).parentContainer = 
                                    '#' + ui.item.context.parentNode.id;
                            }
                        });
                        $('span.widget_handle').disableSelection();
                    });
                    return this;
                },
                toJson: function () {
                    var jsonifiedWidgets = { widgets: [] };
                    for (var i = 0; i < theSort.length; i++) {
                        var container = theSort[i];
                        for (var j = 0; j < container.children.length; j++) {
                            var widgetHtml = container.children[j];
                            jsonifiedWidgets.widgets.push(MACSkeptic.widgets.get(widgetHtml.id));
                        }
                    }
                    return $.toJSON(jsonifiedWidgets);
                },
                setResourceId: function (id) {
                     for (var name in widgetDatabase) {
                        if (widgetDatabase.hasOwnProperty(name)) {
                            var currentWidget = theWidgetIdentifiedByThis(name);
                            currentWidget.resource.id = id;
                        }
                    }
                    return this;
                }
            },
            create: function createWidgetBasedOnPresetProperties(widgetPrototype) {
                (function validateParameters(widgetPrototypeToBeValidated) {
                    if (!widgetPrototypeToBeValidated || !widgetPrototypeToBeValidated.id)
                    {
                        var missingIdError = 'every ajax widget must specify an id!';
                        this.alert(missingIdError);
                        throw missingIdError;
                    }
                    if (theWidgetIdentifiedByThis(widgetPrototypeToBeValidated.id))
                    {
                        var duplicatedIdError = 'each widget id must be unique! [{id}]'.
                            supplant({ id: widgetPrototypeToBeValidated.id });
                        this.alert(duplicatedIdError);
                        throw duplicatedIdError;
                    }
                }(widgetPrototype));
                
                (function setupDefaults(widgetToSetup) {
                    widgetToSetup.parentContainer = widgetToSetup.parentContainer || "div#left_column";
                    widgetToSetup.title = widgetToSetup.title || widgetToSetup.id;
                    widgetToSetup.baseUri = widgetToSetup.baseUri || "Widgets/"; 
                    widgetToSetup.fullUri = widgetToSetup.fullUri;
                    widgetToSetup.resource = widgetToSetup.resource || { name: widgetToSetup.id, id: undefined };
                    widgetToSetup.contentSelector = widgetToSetup.contentSelector || 
                        "div#{id} fieldset div.ajax_widget_content".supplant({
                        id: widgetToSetup.id
                    });
                    widgetToSetup.selectorForLoading = '#{id} fieldset span.loading'.supplant({ 
                        id: widgetToSetup.id 
                    });
                }(widgetPrototype));
                
                (function definePublicMethods(widgetObject) {
                    widgetObject.composeUri = function () {
                        return widgetObject.fullUri || widgetObject.baseUri + widgetObject.resource.name +
                            (widgetObject.resource.id ? ('/' + widgetObject.resource.id) : '');
                    };
                
                    widgetObject.loadContent = function () {
                        if (callbacks.widgetStartedLoading) {
                            callbacks.widgetStartedLoading(widgetObject);
                        }
                        if (callbacks.widgetFinishedLoading) {
                            var calledUri = widgetObject.composeUri();
                            $(widgetObject.contentSelector).load(
                                calledUri, 
                                '', 
                                function (responseText, textStatus, req) {
                                    var successfulRequest = textStatus !== 'error';
                                    if (!successfulRequest) {
                                        $(widgetObject.contentSelector).html(
                                            templates.error.supplant({
                                                status: '' + req.status,
                                                description: req.statusText,
                                                uri: calledUri
                                            })
                                        );
                                    }
                                    callbacks.widgetFinishedLoading(widgetObject, successfulRequest);
                                }
                            );
                        }
                        else {
                            $(widgetObject.contentSelector).load(widgetObject.composeUri());
                        }
                    };
                
                    widgetObject.renderContainer = function () {
                        $(widgetObject.parentContainer).append(templates.widget.supplant({ 
                            id: widgetObject.id, 
                            title: widgetObject.title
                        }));
                        widgetObject.markAsFinishedLoading();
                    };
                    
                    widgetObject.highlight = function (time, specs) {
                        $('#' + widgetObject.id).effect("highlight", specs || {}, time);  
                    };
                    
                    widgetObject.markAsLoading = function () {
                        $(widgetObject.selectorForLoading).
                            addClass('visible_loading').
                            removeClass('invisible_loading');
                    };
                    
                    widgetObject.markAsFinishedLoading = function () {
                        $(widgetObject.selectorForLoading).
                            addClass('invisible_loading').
                            removeClass('visible_loading');
                    };
                    
                    widgetObject.toJson = function () {
                        return $.toJSON(widgetObject);
                    };
                    
                    widgetObject.simplify = function () {
                        return {
                            parentContainer: widgetObject.parentContainer,
                            title: widgetObject.title,
                            id: widgetObject.id,
                            baseUri: widgetObject.baseUri,
                            fullUri: widgetObject.fullUri,
                            resource: widgetObject.resource
                        };
                    };
                }(widgetPrototype));
                
                return store(widgetPrototype);
            }
        };
    }({
        widgetFinishedLoading: function (widget, success) { 
            widget.markAsFinishedLoading();
            widget.highlight(1000, success ? { color: '#ffff99' } : { color: '#ff0000' });
        },
        widgetStartedLoading: function (widget) {
            widget.markAsLoading();
        }
    }))
};