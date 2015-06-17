/**
 * App global mediator. We will use this a global storage for events, objects, and data
 * This allows plugins to communicate with each other without leaking variables and 
 * events into the window namespace
 *
 * Example: require(['mediator'], function(mediator) {
 *              $(mediator).trigger('event.name', {'data':'data'}); 
 *              mediator.userName = 'foo';
 *          });
 *
 */
define(function () {
    return this;
});