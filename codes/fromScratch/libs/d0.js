/* Title: d0.js
 * Desc: d0 IT 4 FUN
 * By: Daniel R. (sadasant.com)
 * Version: 0.01
 * License: http://opensource.org/licenses/mit-license.php
 */

var d0 = (function(){
  /* d0 IT 4 FUN */
  /* START */
  var R = {};
  /* INFO  */
  R.info = ""+
    "d0.js \n"+
    "d0 IT 4 FUN \n"+
    "Author: Daniel R. (sadasant.com) \n"+
    "Version: 0.01"
  ;
  /* REFERENCE (or return function) */
  R.ref = function (dad,son,args){
    return function (){
      return son.apply(dad,Array.prototype.slice.call(args || arguments));
    };
  };
  /* DOCUMENTS */
  (function (){
    for (var i in document){
      var m = i.match(/[A-Z]/g);
      if (!m || (m[0] === i[0] && i[0] !== m[1])){ continue; }
      m = (m) ? i[0] + m.join("") : i;
      if (m.length < 8){
        R[m] = R.ref(document,document[i]);
      }
    }
  }());
  /* MOUSE */
  R.mouse = {
    x: 0, y: 0,
    detectMove: function(log){
      document.onmousemove = function(e) {
        x = (document.all && event.clientX)? event.clientX +
          (document.documentElement.scrollLeft || document.body.scrollLeft) :
          (e.pageX)? e.pageX : null;
        y = (document.all && event.clientY)? event.clientY +
          (document.documentElement.scrollTop || document.body.scrollTop) :
          (e.pageY)? e.pageY : null;
        d0.mouse.x = x;
        d0.mouse.y = y;
        var text = ""+
            "d0.mouse.x: "+x+"<br/>"+
            "d0.mouse.y: "+y;
        d0.gEBI(log).innerHTML = text;
      };
    }
  };
  R.getWindowSize = function() {
    var winW = 630, winH = 460;
    if (document.body && document.body.offsetWidth) {
     winW = document.body.offsetWidth;
     winH = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
     winW = document.documentElement.offsetWidth;
     winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
     winW = window.innerWidth;
     winH = window.innerHeight;
    }
    return {w:winW,h:winH};
  };
  /* LOGS */
  R.bug = R.ref(console,console.debug);
  R.log = R.ref(console,console.log);
  /* END */
  return R;
}());
//d0.bug("done");
//d0.bug(d0.doc);
//d0.bug(d0.gEBI("canvas"));
d0.bug(d0.info);
