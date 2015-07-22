// This is just in here temporarily for testing/fast development

import $ from 'jquery';
import Handlebars from 'handlebars';

export default {
    defaults: {
        templateKey: '_template',
        templatePath: '/render/',
        templateExtension: '.hbs'
    },

    data: false,

    fetchingData: false,

    // we need to do this dynamically. Rusty, thoughts?
    partials: {
        'helpers/attributes' : {
            checked: true, 
            registered: false,
            content: '{{#each this}}{{@key}}{{#if this}}="{{this}}"{{/if}}{{/each}}'
        }
    },

    template: false,

    init($el, options) {        
        this.$el = $el;
        this.options = $.extend(true, {}, this.defaults, options);
        return this;
    },

    fetch(dataUrl = this.options.dataUrl) {
        this.done = new $.Deferred();
        this.fetchData();
        return this.done.promise();
    },

    fetchData() {
        var self = this;

        // grab the data from the URL we were given
        if (this.options.dataUrl && !this.fetchingData) {
            this.fetchingData = $.get(this.options.dataUrl);

            // once done, go through and find the templates we need. They are all essentially "partials"
            this.fetchingData.then((data) => {
                self.data = data;
                self.findPartials();
            });
        }
    },

    // runs recursive search through the data object that comes back. Picks up any _templates that 
    // are specified and adds them to the matches object. Then loads them. 
    findPartials() {
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

        self.template = (self.data[self.options.templateKey]);

        recursiveSearch(self.data);

        if (matches.size) {
            this.loadPartials(matches);
        } 
    },

    // takes the list of partials, gets them, and when we are done getting all of them
    // registers them with Handlebars
    loadPartials(partials) {
        var promises = {};

        var self = this;

        var promisesResolved = 0;

        partials.forEach((value) => {
            if (!promises[value] && !self.partials[value]) {

                promises[value] = $.get( self.templateUrl(value) );

                promises[value].then((template) => {
                    self.partials[value] = {
                        registered: false,
                        content: template
                    };

                    promisesResolved++;

                    if (promisesResolved === partials.size) {
                        self.registerPartials();
                    }

                });
            }
        });
    },

    // register all the partials we have found and not registered yet. When done, compile
    registerPartials() {
        var self = this;

        $.each(this.partials, (key, value) => {
            if (!Handlebars.partials[key]) {
                Handlebars.registerPartial(key, value.content);
            }
        });

        self.compileTemplate();
    },

    // the actual "template" is the top level template that is defined in the JSON. Compile that sucker
    compileTemplate() {
        var self = this;

        self.template = self.partials[self.template].content;

        self.template = Handlebars.compile(self.template);

        self.done.resolve();
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