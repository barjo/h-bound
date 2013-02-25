/**
 * Global Model
 *
 * @type {*}
 */
var globalcontext = dust.makeBase({
    title : "H-Ubu Bound",
    pagename : "h-bound",

    location : {
        current : undefined
    },

    components : [
        {
            name : "GenericDustPresenter",
            description : "Simple component that provides a PresenterService " +
                "that allows to render a dust view with a given context."
        },
        {
            name : "FeedController",
            description : "Track a feed reader, store the entries in a given model, " +
                "and use a PresenterService to render the feed view."
        },
        {
            name : "HashLocationController",
            description : "Track all PresenterService that has an hash property and render their view when " +
                "location.hash change, the context property is used as the model."
        }


    ],

    home : {
        about : 'Just a bunch of H-Ubu components to ease the development of a single page based web site. View are' +
            ' made and render thanks to dustjs.',
        twlink : 'https://twitter.com/notbarjo',
        ghlink : 'https://github.com/barjo/h-bound'
    },


    footer : {
        name : "J. M. Bardin",
        year : "2013"
    }
});