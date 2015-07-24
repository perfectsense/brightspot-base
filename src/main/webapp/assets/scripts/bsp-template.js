import $ from 'jquery';
import Handlebars from 'handlebars';

export default {
    defaults: {
        dataUrl: false,
        partialsRegexp: /\{\{>\s(?!\(lookup)+([^\s]+)[\S\s]+?\}\}/g,
        templateKey: '_template',
        templatePath: '/render/',
        templateExtension: '.hbs',
        templateName: ''
    },

    data: false,
    fetchingTemplate: false,
    fetchingData: false,
    partials: {},
    partialsAllFound: false,
    template: false,
    fetchingJson: false,
    templateFetchPromises: 0,
    templateRecursion: 0,

    init($el, options) {
        this.$el = $el;
        this.options = $.extend(true, {}, this.defaults, options);
        return this;
    },

    fetch(dataUrl = this.options.dataUrl) {
        var self = this;

        self.done = new $.Deferred();

        self.fetchData();

        return self.done.promise();
    },

    // goes and gets the initial JSON which kicks everything off
    fetchData() {
        var self = this;
        if (this.options.dataUrl) {

            this.fetchingData = $.get(this.options.dataUrl);

            this.fetchingData.then((data) => {
                self.data = data;

                // we have the template name
                self.templateName = self.data[self.options.templateKey];

                // lets go get it
                self.fetchTemplate();
            });
        }
    },

    fetchTemplate() {
        var self = this;

        this.fetchingTemplate = $.get(this.templateUrl(self.templateName));

        // once we retreive the main template, we add it to the list of partials. 
        this.fetchingTemplate.then((template) => {

            self.template = template;

            self.partials[self.templateName] = {
                checked: true,
                registered: false,
                content: template
            };

        });

        // we also need to go through the JSON and find the other partials in there
        this.findPartialsInJSON();
    },


    findPartialsInJSON() {
        var self = this;

        var matches = new Set();

        function recursiveSearch(theObject) {
            for (var key in theObject)
            {
                if (typeof theObject[key] == "object" && theObject[key] !== null) {
                    recursiveSearch(theObject[key]);
                }
                else {
                    if(theObject[self.options.templateKey]) {
                        if (!self.partials[theObject[self.options.templateKey]]) {
                            matches.add(theObject[self.options.templateKey]);
                        }
                    }
                }
            }
        }

        // we do a recursive search through the JSON object and pull put and templates we found
        // add them to a list of matches and load them with a deferred that is called when thy are loaded
        recursiveSearch(self.data);

        self.loadingJSONPartials = new $.Deferred();

        if (matches.size) {
           this.loadPartials(matches, self.loadingJSONPartials);
        } 

        // once the partials are loaded and they are in our partials object
        // we will go through those partials and try to find templates in each of them
        self.loadingJSONPartials.done(function() {

            $.each(self.partials, function() {

                self.findPartialsInTemplate(this.content);
                this.checked = true;

            });

        });

    },


    // helper function that loads partials and adds them into our global object
    // once all the partials in the list are loaded it resolves the promise
    loadPartials(partials, promise) {
        var self = this;
        var promises = {};
        var promisesResolved = 0;

        partials.forEach((value) => {
            if (!promises[value] && !self.partials[value]) {
                promises[value] = $.get( self.templateUrl(value) );

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


    // recursive function that goes into a hbs template and finds all the specified partials
    // and their partials, loads them all, and once everything is done, calls to register the partials
    findPartialsInTemplate(template = '') {
        var matches = new Set();
        var match = null;
        var self = this;
        // we keep a global count of how many templates we go through
        self.templateRecursion++;

        var currentTemplateDone = $.Deferred();

        // go through the template and if you find any new partials, add them to the list
        while(match = this.options.partialsRegexp.exec(template)) { // jshint ignore:line
            if (!self.partials[match[1]]) {
                matches.add(match[1]);
            }
        }

        // if we found matches, load them, but also keep track of how many times we have fetched
        if (matches.size) {
            self.templateFetchPromises++;
            this.loadPartials(matches, currentTemplateDone);
        } else {
            // if there are no matches, we are done with this template
            self.templateRecursion--;
        }

        // when the current template is done, which means all the partials have been loaded
        currentTemplateDone.done(function() {

            // we are done with this template and done fetchings. 
            self.templateFetchPromises--;
            self.templateRecursion--;

            // if we are done fetching all the templates and they are loaded in our partials object
            // we go through them again to see if there any partials we missed
            if(self.templateFetchPromises === 0) {
                
                $.each(self.partials, function() {

                    // we also mark it checked so we won't check it again
                    if(!this.checked) {
                        self.findPartialsInTemplate(this.content);
                        this.checked = true;
                    }

                });

            }

            // once we have gone through all the recursion, then register partials with handlebars and continue
            if(self.templateRecursion === 0) {
                self.registerPartials();
            }

        });


    },


    registerPartials() {
        var self = this;

        $.each(self.partials, (key, value) => {
            if (!Handlebars.partials[key]) {
                Handlebars.registerPartial(key, value.content);
            }
        });

        self.compileTemplate();
    },


    compileTemplate() {
        var self = this;
    
        self.template = Handlebars.compile(self.template);

        this.done.resolve();
    },

    render() {
        var self = this;

        this.fetchingData.then((data) => {
            self.$el.html( self.template( data ) );
        });
    },

    templateUrl(templateName = '') {
        return this.options.templatePath + templateName + this.options.templateExtension;
    }
};