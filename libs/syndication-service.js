(function(){window.SyndicationService=typeof SyndicationService!=="undefined"&&SyndicationService!==null?SyndicationService:{}}).call(this);(function(){var a;window.SyndicationService.FeedEntry=a=(function(){function b(){}b.prototype._title=null;b.prototype._url=null;b.prototype._author=null;b.prototype._pubDate=null;b.prototype._content=null;b.prototype._categories=[];b.prototype.getTitle=function(){return this._title};b.prototype.setTitle=function(c){this._title=c;return this};b.prototype.getUrl=function(){return this._url};b.prototype.setUrl=function(c){this._url=c;return this};b.prototype.getAuthor=function(){return this._author};b.prototype.setAuthor=function(c){this._author=c;return this};b.prototype.getPublicationDate=function(){return this._pubDate};b.prototype.setPublicationDate=function(c){this._pubDate=c;return this};b.prototype.getContent=function(){return this._content};b.prototype.setContent=function(c){this._content=c;return this};b.prototype.getCategories=function(){return this._categories};b.prototype.addCategory=function(c){this._categories.push(c);return this};b.prototype.setCategories=function(c){this._categories=c!=null?c:[];return this};return b})()}).call(this);(function(){window.SyndicationService.FeedReader={getTitle:function(){},getUrl:function(){},getEntries:function(){},getRecentEntries:function(){},getLastEntry:function(){}}}).call(this);