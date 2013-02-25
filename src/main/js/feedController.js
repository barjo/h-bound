/**
 * Track a feed reader, store the entries in a given model,
 * and use a PresenterService to render the feed view.
 *
 * @constructor
 */
function FeedController() {
    var self= this;
    var _hub = null;
    var _presenter = new Object(); //injected, use this.presenter
    var _contextKey;
    var _context;
    var _count = 1;
    var _mapper = function(entry){
        return {
            author: entry.getAuthor(),
            content :entry.getContent(),
            title :entry.getTitle(),
            url : entry.getUrl(),
            date : new Date(entry.getPublicationDate()).toDateString()
        }
    };

    /*
     * @return {String} The component name.
     */
    self.getComponentName = function(){
        return "feed-controller";
    };

    /**
     * Configure the component, call by hubu.
     * @param theHub
     * @param conf the component configuration.
     */
    self.configure = function(theHub,conf){
        _hub = theHub;

        _hub.requireService({
            component: self,
            contract: SyndicationService.FeedReader,
            filter : function(ref){
                return ref.getProperty("service.publisher").getComponentName() === conf.feed;
            },
            bind : self.bindReader,
            optional: false
        });

        _hub.requireService({
            component : self,
            contract: PresenterService,
            filter : function(ref){
                return ref.getProperty("service.publisher").getComponentName() === conf.presenter;
            },
            bind : self.bindPresenter,
            optional: false
        });

        _context = conf.context;

        if(!(typeof conf.contextKey === 'string')){
            throw new Exception('The property contextKey is not optional and must be a valid string.');
        }
        _contextKey=conf.contextKey;

        if(typeof conf.mapper === 'function'){
            _mapper=conf.mapper;
        }

        if(typeof conf.count === 'number' ){
            _count = conf.count;
        }

    };

    self.start = function() {

    };

    self.stop = function() {
    };

    self.bindReader = function(reader){
        _context[_contextKey] = { count : _count, entries : reader.getEntries().map(_mapper)};
        _presenter.renderView(_context[_contextKey]);
    };

    self.bindPresenter = function(presenter){
        _presenter=presenter;
        presenter.renderView(_context[_contextKey]);
    };
}

