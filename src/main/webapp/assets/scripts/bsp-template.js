import $ from 'jquery';
import Handlebars from 'handlebars';

export default {

    defaults: {
        dataUrl: false,
        partialsRegexp: /\{\{>\s(?!\(lookup)+([^\s]+)[\S\s]+?\}\}/g,
        templateKey: '_template',
        dataKey: '_dataUrl',
        templatePath: '/render/',
        templateExtension: '.hbs',
        templateName: ''
    },

    templatePromises: 0,

    templateRecursion: 0,

    init($el, options) {
        var self = this;

        self.$el = $el;
        self.options = $.extend(true, {}, self.defaults, options);

        self.partialMatches = new Set();

        self.partials = {};

        var fullDataReady = self._createFullJSON();

        fullDataReady.done(() => {

            self.partialMatches = self._getTemplatesFromJSON();

            self.loadingJSONPartials = new $.Deferred();

            self._loadPartials(self.partialMatches, self.loadingJSONPartials);

            self.loadingJSONPartials.done(() => {

                $.each(self.partials, function(key, value) {
                    if (!self.partials[key].checked) {

                        self._findPartialsInTemplate(self.partials[key].content, key);

                    }
                });

            });

        });

        self.handlebarsReady = $.Deferred();

        self.handlebarsReady.done(() => {
            self._render();
        });

        // need to find a better way around this hack
        function checkPartials() {
            self._checkPartials();
        }

        checkPartials();

        self.checkPartialInterval = setInterval(checkPartials, 100);

        return self;
    },

    _checkPartials() {  
        var self = this;

        var isEmpty = $.isEmptyObject(self.partials);
        var unchecked = 0;

        if (!isEmpty) {
            $.each(self.partials, function() {
                if(!this.checked) {
                    unchecked++;
                }
            });
            if(unchecked === 0) {
                clearInterval(self.checkPartialInterval);
                self._registerPartials();
            }
        } 
        
    },

    _findPartialsInTemplate(template = '', partialsKey = '') {
        var matches = new Set();
        var match = null;
        var self = this;

        var currentTemplateDone = $.Deferred();

         // go through the template and if you find any new partials, add them to the list
        while(match = self.options.partialsRegexp.exec(template)) { // jshint ignore:line
            if (!self.partials[match[1]]) {
                matches.add(match[1]);
            }
        }

        // if we found matches, load them, but also keep track of how many times we have fetched
        if (matches.size) {
            self.templatePromises++;
            self._loadPartials(matches, currentTemplateDone);
        } else {
            self.partials[partialsKey].checked = true;
        }

        // when the current template is done, which means all the partials for it have been loaded
        // see if there are promises left. If there aren't it means we are done loading and we 
        // can iterate back through to see if we need get THEIR embedded partials
        currentTemplateDone.done(function() {

            self.partials[partialsKey].checked = true;

            self.templatePromises = self.templatePromises - 1;

            if(self.templatePromises === 0) {

                $.each(self.partials, function(key, value) {
                    if (!self.partials[key].checked) {
                        self._findPartialsInTemplate(self.partials[key].content, key);
                    }
                });

            }

        });

    },


    // helper function that loads partials and adds them into our global object
    // once all the partials in the list are loaded it resolves the promise
    _loadPartials(partials, promise) {
        var self = this;
        var promises = {};
        var promisesResolved = 0;

        partials.forEach((value) => {

            // try to make sure we do not load the same partial multiple times if not necessary
            if (!promises[value] && !self.partials[value]) {
                promises[value] = $.get( self._templateUrl(value) );

                promises[value].then((template) => {

                    self.partials[value] = {
                        checked: false,
                        registered: false,
                        content: template
                    };

                    promisesResolved++;

                    if (promisesResolved === partials.size) {
                        promise.resolve();
                    }
                });
            }
        });

    },

    _fetch(dataUrl) {

        var self = this;
        var fetching;

        fetching = $.get(dataUrl);
        
        return fetching;

    },


    _createFullJSON() {

        var self = this;

        var fullDataReady = $.Deferred();

        var getData = self._fetch(self.options.dataUrl);

        var dataToGet = new Set();

        function recursiveGet() {

            if(dataToGet.size === 0) {

                fullDataReady.resolve();

            } else {

                dataToGet.forEach((value) => {

                    var getData = self._fetch(value);

                    getData.done((data) => {
                        
                        self.data = self._replaceUrlWithData(self.data, self.options.dataKey, value, data);

                            dataToGet = new Set();

                            self._recursiveSearch(self.data, self.options.dataKey, dataToGet);

                            if (dataToGet.size) {
                                recursiveGet();
                            }
                            else {
                                fullDataReady.resolve();
                            }
                    });

                });
            }
        }

        getData.done((data) => {

            self.data = data;

            // go through the data and pull out and JSON we need to retrieve and make a set of values
            self._recursiveSearch(self.data, self.options.dataKey, dataToGet);

            // go through the data set, ajax in the actual JSON and refull
            recursiveGet();

        });

        return fullDataReady;

    },

    _replaceUrlWithData(theObject, theKey, value, data) {
        var self = this;

        function recursiveReplace(theObject) {

            for (var key in theObject) {

                if (typeof theObject[key] == "object" && theObject[key] !== null) {

                    for (var deepKey in theObject[key]) {

                        if(theObject[key][deepKey][theKey] === value) {
                            theObject[key][deepKey] = data;
                        } else {
                            recursiveReplace(theObject[key]);
                        }

                    }

                }

            }

        }

        recursiveReplace(theObject);

        return theObject;

    },

    _recursiveSearch(theObject, theKey, matches) {
        var self = this;

        function recursiveSearch(theObject) {
            for (var key in theObject)
            {
                if (typeof theObject[key] == "object" && theObject[key] !== null) {
                    recursiveSearch(theObject[key]);
                }
                else {
                     if(theObject[theKey]) {
                        if (!matches[theObject[theKey]]) {
                            matches.add(theObject[theKey]);
                        }
                    }
                }
            }
        }

        recursiveSearch(theObject);

        return matches;
    },


    _getTemplatesFromJSON() {
        var self = this;

        var templates = new Set();

        self._recursiveSearch(self.data, self.options.templateKey, templates);

        return templates;
    },

    _templateUrl(templateName = '') {
        var self = this;

        return self.options.templatePath + templateName + self.options.templateExtension;
    },


    _registerPartials() {
        var self = this;

        $.each(self.partials, (key, value) => {
            if (!Handlebars.partials[key]) {
                Handlebars.registerPartial(key, value.content);
            }
        });

        this._compileTemplate();
    },

    _compileTemplate() {
        var self = this;

        var mainTemplateName = self.data._template;
        var mainTemplate = self.partials[mainTemplateName].content;

        self.template = Handlebars.compile(mainTemplate);

        self.handlebarsReady.resolve();
    },

    _render() {
        var self = this;
        self.$el.html( self.template( self.data ) );
    },
   
};