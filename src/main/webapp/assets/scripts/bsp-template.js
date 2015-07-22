// This is just in here temporarily for testing/fast development

import $ from 'jquery';
import Handlebars from 'handlebars';

export default {
    defaults: {
        dataUrl: false,
        partialsRegexp: /\{\{>\s(?!\(lookup)+([^\s]+)[\S\s]+?\}\}/g, 
        removeCompileRegexp: /\{\{>\s+([^\s]+)[\S\s]compile\s?\}\}/g,
        templatePath: '/render/',
        templateExtension: '.hbs'
    },
    data: false,
    fetchingTemplate: false,
    fetchingData: false,
    partials: {},
    partialsAllFound: false,
    template: false,

    init($el, options) {        
        this.$el = $el;
        this.options = $.extend(true, {}, this.defaults, options);
        return this;
    },
    fetch(template = this.options.template, data = this.options.data, dataUrl = this.options.dataUrl) {
        this.done = new $.Deferred();
        this.fetchTemplate();
        this.fetchData();
        return this.done.promise();
    },
    fetchData() {
        var fakeDataGet;
        var fakeResolveData = {};
        var self = this;
        if (this.options.dataUrl && !this.options.data && !this.fetchingData) {
            this.fetchingData = $.get(this.options.dataUrl);
            this.fetchingData.then((data) => {
                self.data = data;
            });
        } else if (!this.fetchingData) {
            if (this.options.data) {
                fakeResolveData = this.options.data;
            }
            fakeDataGet = new $.Deferred();
            fakeDataGet.resolve(fakeResolveData);
            this.fetchingData = fakeDataGet.promise();
        }
    },
    fetchTemplate(template = this.options.template) {
        this.fetchingTemplate = $.get(this.templateUrl(template));
        this.fetchPartials();
    },
    fetchPartials() {
        var self = this;
        $.when(this.fetchingTemplate, this.fetchingData).then((template, data) => {
            if (!self.template) {
                self.template = template[0];
                self.partials[self.options.template] = {
                    checked: true,
                    registered: false,
                    content: template[0]
                };
            }
            self.findPartials(template[0]);
        });
    },
    findPartials(template = '') {
        var matches = new Set();
        var match = null;
        var self = this;
        while(match = this.options.partialsRegexp.exec(template)) { // jshint ignore:line            
            if (!self.partials[match[1]]) {
                matches.add(match[1]);
            }
        }
        if (matches.size) {
            this.loadPartials(matches);
        } else {
            this.checkNextPartial();
        }
    },
    loadPartials(partials) {
        var promises = {};
        var self = this;
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
                        self.checkNextPartial();
                    }
                });
            }
        });
    },
    checkNextPartial() {
        var partialFound = false;
        var self = this;
        $.each(this.partials, (key, value) => {
            if (!value.checked) {
                if (!partialFound) {
                    self.partials[key].checked = true;
                    self.findPartials(value.content);
                }
                partialFound = true;
            }
        });
        if (!partialFound) {
            self.registerPartials();
        }
    },
    registerPartials() {
        $.each(this.partials, (key, value) => {
            if (!Handlebars.partials[key]) {
                Handlebars.registerPartial(key, value.content);
            }
        });
        this.compileTemplate();
    },
    compileTemplate() {
        this.template = this.template.replace(this.options.removeCompileRegexp,'');

        this.template = Handlebars.compile(this.template);
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