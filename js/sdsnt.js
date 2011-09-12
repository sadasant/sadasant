/* sdsnt.js
 * By Daniel R. (sadasant.com)
 * License: http://opensource.org/licenses/mit-license.php
 */

$(function(){
  var S = (function(){
    var author = "Daniel R. (sadasant.com)";
  
    /* BACKBONES */
    var Page = Backbone.Model.extend({
      /*initialize: function(args) {
        //S.debug("Started page: "+args.name);
      },*/
      defaults: {
        name: "ERROR",
        data: "Nothing here."
      }
    });
    var Pages = Backbone.Collection.extend({
      model: Page,
      getData: function(name){
        var page = this.find(function(page) { 
          return page.get('name') === name;  
        });
        return page.get('data');
      }
    });
    var Content = Backbone.View.extend({
      events: {
        "click img": "expand",
        "click .email": "email"
      },
      render: function(page,data,title,parent){
        $(this.el).fadeOut(140,function(){
          //S.debug(page);
          $("a").removeClass("active");
          if (S.menu !== null) {
            $("menu").html(S.menu);
            S.menu = null;
          }
          if (!title) {
            $("#"+page).addClass("active"); }
          else {
            S.menu = $("menu").html(); 
            $("menu").html(title+". <a href='#/"+parent+"'>Go back</a>.");
          }
          var html = "<p>"+data.content+"</p>";
          if (data.comments) html += "<small>"+data.comments+"</small></br></br>";
          if (data.linksTitle) {
            html += "<b>"+data.linksTitle+"</b>";
          }
          if (data.links && typeof(data.links) !== "string") {
            html += "<ul>";
            for (var i in data.links){
              var di = data.links[i];
              var link = (i.match(/https*:\/\//g))? i : "#/"+page+"/"+i;
              if (di.title) html += "<li><a href='"+link+"' title='"+di.title+"'>"+di.list+"</a></li>";
              else html += "<li>"+di.list+"</li>";
            }
          }
          $(this).html(html);
          $(this).fadeIn(140);
        });
      },
      expanded: null,
      expand: function(e){
        $("#content img").each(function(){
          $(this).animate({
            width:50
          });
        });
        if (this.expanded !== e.target){
          this.expanded = e.target;
          $(e.target).animate({
            width:200
          });
        } else {
          this.expanded = null;
        }
      },
      email: function(e){
        var my = "djrs",
          mail = "sadasant",
          html = "email: "+my+"@"+mail+".com";
          $(".email").fadeOut(140,function(){
            $(this).html(html).fadeIn();
          });
      }
    
    });
    var Router = Backbone.Router.extend({
      initialize: function(options){
        this.collection = options.collection;
        this.view = options.view;
      },
      routes: {
        "/:page": "pages",
        "/:page/:subpage": "subpages"
      },
      pages: function(page){
        var data = this.collection.getData(page);
        this.view.render(page,data);
      },
      subpages: function(page,subpage){
        var data = this.collection.getData(page);
        this.view.render(page+"/"+subpage,data.links[subpage],data.links[subpage].title,page);
      }
    });
    /**/
    
    function start(){
      $.ajax({
        type:"GET",
        url: 'http://sadasant.com/json/sdsnt.json',
        //url: 'http://jsbin.com/eyiyus/38',
        success: function (json){
          //json = $.parseJSON(json);
          for (var i in json) {
            S.Pages.add({ name:i, data:json[i] });
          }
          S.Router = new Router({ collection:S.Pages, view: S.Content });
          Backbone.history.start();
        }
      });
    }

    return {
      //debug: _.bind(console.debug, console),
      Pages: new Pages(),
      Content: new Content({ el: $("#content") }),
      Router: null, //later
      start: start,
      menu: null
    };
  })();
  
  S.start();

});