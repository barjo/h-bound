(function(){window.SyndicationService=typeof SyndicationService!=="undefined"&&SyndicationService!==null?SyndicationService:{}}).call(this);(function(){var a;window.SyndicationService.FeedEntry=a=(function(){function b(){}b.prototype._title=null;b.prototype._url=null;b.prototype._author=null;b.prototype._pubDate=null;b.prototype._content=null;b.prototype._categories=[];b.prototype.getTitle=function(){return this._title};b.prototype.setTitle=function(c){this._title=c;return this};b.prototype.getUrl=function(){return this._url};b.prototype.setUrl=function(c){this._url=c;return this};b.prototype.getAuthor=function(){return this._author};b.prototype.setAuthor=function(c){this._author=c;return this};b.prototype.getPublicationDate=function(){return this._pubDate};b.prototype.setPublicationDate=function(c){this._pubDate=c;return this};b.prototype.getContent=function(){return this._content};b.prototype.setContent=function(c){this._content=c;return this};b.prototype.getCategories=function(){return this._categories};b.prototype.addCategory=function(c){this._categories.push(c);return this};b.prototype.setCategories=function(c){this._categories=c!=null?c:[];return this};return b})()}).call(this);(function(){window.SyndicationService.FeedReader={getTitle:function(){},getUrl:function(){},getEntries:function(){},getRecentEntries:function(){},getLastEntry:function(){}}}).call(this);;
(function() {
  var FeedReaderImpl, scope, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  scope = typeof global !== "undefined" && global !== null ? global : this;

  scope.SyndicationService = typeof SyndicationService !== "undefined" && SyndicationService !== null ? SyndicationService : {};

  scope.SyndicationService.JFeed = (_ref = SyndicationService.JFeed) != null ? _ref : {};

  scope.SyndicationService.JFeed.FeedReaderImpl = FeedReaderImpl = (function() {

    function FeedReaderImpl() {
      this._loaded = __bind(this._loaded, this);

      this._retrieve = __bind(this._retrieve, this);

    }

    FeedReaderImpl.prototype._url = null;

    FeedReaderImpl.prototype._name = null;

    FeedReaderImpl.prototype._useGoogleFeedAPI = false;

    FeedReaderImpl.prototype._period = -1;

    FeedReaderImpl.prototype._intervalReference = null;

    FeedReaderImpl.prototype._async = true;

    FeedReaderImpl.prototype._hub = null;

    /*
      # We register the service ourself as we wait the first retrieval and processing.
    */


    FeedReaderImpl.prototype._reg = null;

    FeedReaderImpl.prototype._logger = null;

    FeedReaderImpl.prototype.configure = function(hub, configuration) {
      var _ref1, _ref2, _ref3;
      this._url = (function() {
        if (configuration["feed.url"] != null) {
          return configuration["feed.url"];
        } else {
          throw new Extension("feed.url missing in configuration");
        }
      })();
      this._name = (_ref1 = configuration["feed.name"]) != null ? _ref1 : configuration["feed.url"];
      this._useGoogleFeedAPI = (_ref2 = configuration["feed.useGoogleFeedAPI"]) != null ? _ref2 : false;
      this._hub = hub;
      this._async = (_ref3 = configuration["feed.async"]) != null ? _ref3 : true;
      this._logger = new Logger(this._name);
      if ((configuration["feed.period"] != null)) {
        return this._period = configuration["feed.period"];
      }
    };

    FeedReaderImpl.prototype.start = function() {
      this._logger.info("Starting...");
      this._retrieve();
      if (this._period !== -1) {
        this._logger.info("Registering periodic call (" + this._period + ")");
        return this._intervalReference = setInterval(this._retrieve, this._period);
      }
    };

    FeedReaderImpl.prototype.stop = function() {
      if (this._intervalReference != null) {
        clearInterval(this._intervalReference);
        this._intervalReference = null;
      }
      this._reg = null;
      return this._feed = null;
    };

    FeedReaderImpl.prototype._retrieve = function() {
      var apiHost, apiProtocol, apiUrl, self,
        _this = this;
      this._logger.info("Retrieving feed : " + this._url);
      self = this;
      if (this._useGoogleFeedAPI) {
        apiProtocol = "https";
        apiHost = apiProtocol + "://ajax.googleapis.com/ajax/services/feed/load";
        apiUrl = apiHost + "?v=1.0&num=-1&output=json&callback=?&q=" + encodeURIComponent(this._url);
        this._logger.info("Configuring Feed Reader with " + apiUrl);
        this._logger.info("Update Period : " + this._period + ", Asynchronous : " + this._async);
        return $.ajax({
          url: apiUrl,
          dataType: 'json',
          async: this._async
        }).done(function(data) {
          return self._JSONloaded(data);
        });
      } else {
        return jQuery.getFeed({
          url: this._url,
          success: function(feed) {
            return _this._loaded(feed);
          }
        });
      }
    };

    FeedReaderImpl.prototype._loaded = function(feed) {
      var oldEntries;
      oldEntries = this._feed != null ? HUBU.UTILS.clone(this._feed.items) : [];
      this._feed = feed;
      this._registerServiceIfNotDoneYet();
      return this._detectNewEntries(this._feed, oldEntries);
    };

    FeedReaderImpl.prototype._JSONloaded = function(data) {
      var feed, i, item, oldEntries, _i, _len, _ref1;
      oldEntries = this._feed != null ? HUBU.UTILS.clone(this._feed.items) : [];
      if (!(data != null) || data.responseStatus === 400 || !data.responseData) {
        throw new Exception("Cannot load feed from " + this._url);
      }
      feed = data.responseData.feed;
      this._feed = {
        title: feed.title,
        link: feed.link,
        description: feed.description,
        language: feed.language,
        updated: new Date(),
        items: []
      };
      _ref1 = feed.entries;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        i = _ref1[_i];
        item = new JFeedItem();
        item.title = i.title;
        item.link = i.link;
        item.description = i.content;
        item.updated = new Date(i.publishedDate);
        item.author = i.author;
        item.categories = i.categories;
        this._feed.items.push(item);
      }
      this._registerServiceIfNotDoneYet();
      return this._detectNewEntries(this._feed, oldEntries);
    };

    FeedReaderImpl.prototype._registerServiceIfNotDoneYet = function() {
      if (this._reg === null) {
        this._logger.info("Registering feed reader service for " + this.getTitle());
        return this._reg = this._hub.registerService(this, SyndicationService.FeedReader, {
          'org.nanoko.syndication.feed.title': this.getTitle(),
          'org.nanoko.syndication.feed.url': this.getUrl()
        });
      }
    };

    FeedReaderImpl.prototype._detectNewEntries = function(feed, oldEntries) {
      var entry, item, _i, _len, _ref1, _results;
      _ref1 = feed.items;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        if (!(!this._contains(item, oldEntries))) {
          continue;
        }
        entry = new scope.SyndicationService.FeedEntry().setTitle(item.title).setUrl(item.link).setPublicationDate(item.updated).setContent(item.description).setCategories(item.categories).setAuthor(item.author);
        this._logger.info("Sending event for new feed entry " + item.title + " from " + this.getTitle());
        _results.push(hub.publish(this, "org/nanoko/syndication", {
          'feed.url': this._url,
          'feed.title': this._feed.title,
          'entry.title': item.title,
          'entry.url': item.link,
          'entry.content': item.description,
          'entry.date': item.updated,
          'entry.categories': item.categories,
          'entry.author': item.author,
          'entry': entry
        }));
      }
      return _results;
    };

    FeedReaderImpl.prototype._contains = function(item, oldEntries) {
      var entry, _i, _len;
      for (_i = 0, _len = oldEntries.length; _i < _len; _i++) {
        entry = oldEntries[_i];
        if (!(entry.title === item.title)) {
          continue;
        }
        if ((!(entry.updated != null)) && (!(item.updated != null))) {
          return true;
        }
        if ((entry.updated != null) && (item.updated != null) && item.updated.getTime() === entry.updated.getTime()) {
          return true;
        }
      }
      return false;
    };

    FeedReaderImpl.prototype.getComponentName = function() {
      return this._name;
    };

    /* Feed Reader Implementation
    */


    FeedReaderImpl.prototype.getTitle = function() {
      return this._feed.title;
    };

    FeedReaderImpl.prototype.getUrl = function() {
      return this._url;
    };

    FeedReaderImpl.prototype.getEntries = function() {
      var entries, item, items, _i, _len;
      items = this._feed.items;
      entries = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        entries.push(new scope.SyndicationService.FeedEntry().setTitle(item.title).setUrl(item.link).setPublicationDate(item.updated).setContent(item.description).setCategories(item.categories).setAuthor(item.author));
      }
      return entries;
    };

    FeedReaderImpl.prototype.getRecentEntries = function() {
      return this.getEntries();
    };

    FeedReaderImpl.prototype.getLastEntry = function() {
      if (this.getEntries().length !== 0) {
        return this.getEntries()[0];
      }
      return null;
    };

    return FeedReaderImpl;

  })();

}).call(this);
;
