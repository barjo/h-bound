/**
 * Presenter contract.
 * @type {Object}
 */
var PresenterService = {

    /**
     * Render the view thanks to this presenter service.
     * @param context the model to be injected in the view.
     */
    renderView:function (context) {}
};

/**
 * Component which provides a PresenterService,
 * that allows to render view created with dust template.
 */
function GenericDustPresenter(name) {
    var self= this;
    var _hub = null;
    var _name=name;

    /**
     * The dust template name use to create the view.
     * @type {String}
     */
    var _dustview = null;

    /**
     * Selector function with return an HTML element where the view will be rendered.
     * the body is return by default.
     * @return {HTMLElement}
     */
    var _selector = function(){return document.body};

    /**
     * @return {String} component_name.
     */
    self.getComponentName = function(){
        return _name;
    };

    /**
     * Configure the component, call by hubu.
     * @param {hub} theHub
     * @param conf the component configuration.
     */
    self.configure = function(theHub,conf){
        _hub = theHub;
        _hub.provideService({
            component : this,
            contract : PresenterService,
            properties : {
                hash : conf.hash
            }
        });

        _dustview=conf.dustview;
        _selector=conf.selector;
    };

    self.start = function() {
    };

    self.stop = function() {
    };

    self.renderView = function(context){
        dust.render(_dustview,context,function(err,out){
            if (err){
                console.log(err);
            }else{
                try{
                    _selector().innerHTML=out;
                }catch (err){
                    HUBU.logger.warn("#" + self.getComponentName()+" - "+err);
                }

            }
        });
    };
}