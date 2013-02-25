/**
 * Track all PresenterService that has an hash property and render their view when the window location hash change,
 * the context property is used as the model.
 *
 * @constructor
 */
function HashLocationController() {
    var self= this;
    var _hub = null;
    var _context = null;
    var _default_hash = "#home";

    var _presenters = {};

    self.getComponentName = function () {
        return "main-mediator";
    };

    self.configure = function(hub,conf){
        _hub = hub;
        _context = conf.context;

        _hub.requireService({
            component : this,
            contract: PresenterService,
            bind : self.bindControllerService,
            unbind : self.unbindControllerService,
            filter : function(ref){
                return ref.getProperty("hash") !== undefined;
            },
            aggregate : true,
            optional : false
        });

        if (typeof conf.default_hash === 'string'){
            _default_hash=conf.default_hash;
        }
    };

    self.start = function() {
        //track hash change event
        $(window).on('hashchange', function() {
            if (_presenters[location.hash] !== undefined){
                _context.location['current'] = location.hash;
                _presenters[location.hash].renderView(_context);
            }
        });
    };

    self.stop = function() {};

    self.bindControllerService = function(service,sref){
        if(sref.getProperty("hash") === location.hash || sref.getProperty("hash") === _default_hash){
            _context.location['current'] = sref.getProperty("hash");
            service.renderView(_context);
        }
        _presenters[sref.getProperty("hash")] = service;
    };

    self.unbindControllerService = function(service,sref){
        _presenters[sref.getProperty("hash")] = undefined;
    };
}