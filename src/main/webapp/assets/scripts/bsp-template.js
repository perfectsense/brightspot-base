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

    // when we go through _template definitions to AJAX them in, we want to keep track of them
    templatePromises: 0,

    init($el, options) {
        var self = this;

        self.$el = $el;
        self.options = $.extend(true, {}, self.defaults, options);

        // our main object. This keeps track of partials we have found, their values, whether they have been
        // checked or not, and their content
        self.partials = {};

        // we start off by going through our initial JSON object, and crawling through of it to gather any external data specified in it
        var fullDataReady = self._createFullJSON();

        // once the full data is ready, we will get all the templates dynamically and eventually register them
        fullDataReady.done(() => {
            self._startGettingTemplatesFromJSON();
        });

        // finally when we are registered and we have a template loaded into Handlebars, do the rendering
        self.handlebarsReady = $.Deferred();

        self.handlebarsReady.done(() => {
            self._render();
        });



        // TODO: need to find a better way around this hack
        // we are recursively ajaxing templates. We don't know how deep we go, because templates that we ajax in
        // can have more templates, and since we are ajaxing everything, there could be promises outstanding
        // while we think we are done. Need a good way of stopping and determining that we are truly done

        // for now, we just check to see if all partials that we know of have been checked and reiterated through
        // once no unchecked partials exist, this interval gets cancelled and we render the page
        function checkPartials() {
            self._checkPartials();
        }

        checkPartials();
        self.checkPartialInterval = setInterval(checkPartials, 100);

        return self;
    },


    // this is our hack documented at the bottom of init()
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


    // This helper function kicks off the process of ajaxing templates that are specified in the JSON
    // Then once we load all those, we go through all the templates we have and see what kind of partials
    // they might have within themselves
    _startGettingTemplatesFromJSON() {

        var self = this;

        var partialMatches = new Set();

        // this crawls through the JSON and gathers any _templates and gets them ready for loading
        partialMatches = self._getTemplatesFromJSON();

        // Here we go ahead and load all those partials and resolve the promise when done
        self.loadingJSONPartials = new $.Deferred();

        self._loadPartials(partialMatches, self.loadingJSONPartials);

        // once we are done loading the partials from the JSON, we then go through the templates 
        // to see what kind of partials they have
        self.loadingJSONPartials.done(() => {

            $.each(self.partials, function(key, value) {
                if (!self.partials[key].checked) {

                    self._findPartialsInTemplate(self.partials[key].content, key);

                }
            });

        });

    },

    // This helper function goes through a template, finds any partials in it, loads them, and 
    // once that loading is done, reiterates through until everything is checked
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
        // if there are no matches, we are done with the template
        if (matches.size) {
            self.templatePromises++;
            self._loadPartials(matches, currentTemplateDone);
        } else {
            self.partials[partialsKey].checked = true;
        }

        // when the current template/partial is done, which means all the partials for it have been loaded
        // mark it and see if there are promises left for this template. If there aren't it means we are done loading this
        // template and we can iterate back through to see if we need get THEIR embedded partials
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

    // helper function for fetching only
    _fetch(dataUrl) {

        var self = this;
        var fetching;

        fetching = $.get(dataUrl);
        
        return fetching;

    },

    // helper function which ajaxes the initial JSON, then does a recursive get to gather all the other _dataURL specified
    // JSON objects which might be referred to inside our JSON. It will keep going until we have a full JSON object
    _createFullJSON() {

        var self = this;

        var fullDataReady = $.Deferred();
        var dataToGet = new Set();

        // we start by fetching the initial dataUrl from the HTML
        var getData = self._fetch(self.options.dataUrl);

        // once the data is here.....
        getData.done((data) => {

            self.data = data;

            // go through the data and pull out and JSON we need to retrieve and make a set of values
            self._recursiveSearch(self.data, self.options.dataKey, dataToGet);

            // go through the data set, ajax in the actual JSON and refull
            recursiveGet();

        });

        function recursiveGet() {

            // if there is nothing left, we are done
            if(dataToGet.size === 0) {

                fullDataReady.resolve();

            } else {

                // otherwise, go through the data we found through the recursive search
                dataToGet.forEach((value) => {

                    // get the JSON 
                    var getData = self._fetch(value);

                    // once we are done, we replace the _dataUrl entry in the JSON with the actual data to 
                    // create a nice and pretty JSON object
                    getData.done((data) => {

                        self.data = self._replaceUrlWithData(self.data, self.options.dataKey, value, data);

                        dataToGet = new Set();

                        // once we have clean data, we rerun the search and create a new dataToGet set
                        // then if there is stuff to get, we get it. Otherwise, resolve, as we are done
                        self._recursiveSearch(self.data, self.options.dataKey, dataToGet);

                        if (dataToGet.size) {
                            //recursiveGet();
                        }
                        else {
                            fullDataReady.resolve();
                        }
                    });

                });
            }
        }

        return fullDataReady;

    },

    // helper function to go into an object and replace a key/value with an object
    // This will crawl the whole object looking for the key/value with the object
    // It will take an object, the key and value, and return the new pretty object
    _replaceUrlWithData(theObject, theKey, value, replacementData) {
        var self = this;

        function recursiveReplace(theObject) {

            for (var key in theObject) {

                if (typeof theObject[key] == "object" && theObject[key] !== null) {

                    if(theObject[key][theKey] === value) {
                        theObject[key] = replacementData;
                    } else {

                        for (var deepKey in theObject[key]) {

                            if(theObject[key][deepKey][theKey] === value) {
                                theObject[key][deepKey] = replacementData;
                            } else {
                                recursiveReplace(theObject[key]);
                            }

                        }
                    }

                }

            }

        }

        recursiveReplace(theObject);

        return theObject;

    },

    // helper function to do a recursive search throughout the object and return the matches
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

    // helper function to go into the JSON, run a search and return the templates/partials found
    _getTemplatesFromJSON() {
        var self = this;

        var templates = new Set();

        self._recursiveSearch(self.data, self.options.templateKey, templates);

        return templates;
    },

    // helper function to create a full URL from the template name
    _templateUrl(templateName = '') {
        var self = this;

        return self.options.templatePath + templateName + self.options.templateExtension;
    },

    // helper function to go through the final list of partials and register them with Handlebars
    // when done, we will compile the template
    _registerPartials() {
        var self = this;

        $.each(self.partials, (key, value) => {
            if (!Handlebars.partials[key]) {
                Handlebars.registerPartial(key, value.content);
            }
        });

        this._compileTemplate();
    },

    // helper to compile the template. Once we are done, we tell the parent that Handlebars is ready to roll
    _compileTemplate() {
        var self = this;

        var mainTemplateName = self.data._template;
        var mainTemplate = self.partials[mainTemplateName].content;

        self.template = Handlebars.compile(mainTemplate);

        self.handlebarsReady.resolve();
    },

    // helper function to render the Handlebar template with our full set of data
    _render() {
        var self = this;
        self.$el.html( self.template( self.data ) );
    },
   
};