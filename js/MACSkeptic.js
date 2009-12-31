"use strict";

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
    return this.charAt(0).toLowerCase() + this.substring(1);
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
                else {
                    var result = {};
                    forEach(obj, function (name, property) {
                        result[name.lowerize()] = 
                            MACSkeptic.helpers.lowerize(property);
                    });
                    return result;
                }
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
                '<p><strong>Status Code:</strong>{status}</p>',
                '<p><strong>Status Description:</strong>{description}</p>'
            ].join('\n')
        };
        
        var theSort = [];
        var widgetDatabase = {};    
        var callbacks = callbackParameters || {};

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
                var createdWidgets = [];
                for (var i = 0; i < data.widgets.length; i++)
                {
                    var lowerizedData = MACSkeptic.helpers.lowerize(data.widgets[i]);
                    createdWidgets.push(MACSkeptic.widgets.create(lowerizedData));
                }
                return createdWidgets;
            },
            all: {
                clear: function () {
                    widgetDatabase = {};
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
                            handle: 'span.widget_handle'
                        });
                        $('span.widget_handle').disableSelection();
                    });
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
                            $(widgetObject.contentSelector).load(
                                widgetObject.composeUri(), 
                                '', 
                                function (responseText, textStatus, req) {
                                    var successfulRequest = textStatus !== 'error';
                                    if (!successfulRequest) {
                                        $(widgetObject.contentSelector).html(
                                            templates.error.supplant({
                                                status: req.status,
                                                description: req.statusText
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

