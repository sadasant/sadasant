var S = {
  author: "Daniel R. (sadasant.com)",
  debug: _.bind(console.debug, console),

  /* PAGE OBJECT */
  Page: Backbone.Model.extend({
    initialize: function(args) {
      S.debug("Started page: "+args.name);
    },
    defaults: {
      name: "ERROR",
      data: "Nothing here, move away"
    }
  }),

  /* MAIN PAGES */
  Pages: Backbone.Collection.extend({
    model: this.page,
    url: 'http://jsbin.com/eyiyus',
    find: function(name){
      return this.filter(function(game) {  
        return game.get('name') == name;  
      });
    }
  })
};

//var testpage = new S.Page({name: "about",data: _json.about});
//S.debug(testpage.get('data'));

var testPages = new S.Pages();
testPages.fetch();
S.debug(testPages);

