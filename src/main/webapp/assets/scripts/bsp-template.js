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

    fetchData() {
        var self = this;
        if (this.options.dataUrl) {

            this.fetchingData = $.get(this.options.dataUrl);

            this.fetchingData.then((data) => {
                self.data = data;

                self.templateName = self.data[self.options.templateKey];

                self.fetchTemplate();
            });
        }
    },

    fetchTemplate() {
        var self = this;

        this.fetchingTemplate = $.get(this.templateUrl(self.templateName));

        this.fetchingTemplate.then((template) => {

            self.template = template;

            self.partials[self.templateName] = {
                checked: true,
                registered: false,
                content: template
            };

        });


        this.findPartialsInJSON();

        // this.fetchPartials();
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

        recursiveSearch(self.data);

        self.loadingJSONPartials = new $.Deferred();

        if (matches.size) {
           this.loadPartials(matches, self.loadingJSONPartials);
        } 

        self.loadingJSONPartials.done(function() {

            $.each(self.partials, function() {

                self.findPartialsInTemplate(this.content);

                this.checked = true;

            });

            // self.partials.forEach((value) => {

            //     console.log(this);

            //     self.findPartialsInTemplate();

            // });
            

        });

    },


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


    findPartialsInTemplate(template = '') {
        var matches = new Set();
        var match = null;
        var self = this;
        self.templateRecursion++;

        var currentTemplateDone = $.Deferred();

        while(match = this.options.partialsRegexp.exec(template)) { // jshint ignore:line
            if (!self.partials[match[1]]) {
                matches.add(match[1]);
            }
        }

        currentTemplateDone.done(function() {

            self.templateFetchPromises--;
            self.templateRecursion--;

            if(self.templateFetchPromises === 0) {
                
                $.each(self.partials, function() {

                    if(!this.checked) {
                        self.findPartialsInTemplate(this.content);
                        this.checked = true;
                    }

                });

            }

            if(self.templateRecursion === 0) {
                self.registerPartials();
            }

        });

        if (matches.size) {
            self.templateFetchPromises++;
            this.loadPartials(matches, currentTemplateDone);
        } else {
            self.templateRecursion--;
        }

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