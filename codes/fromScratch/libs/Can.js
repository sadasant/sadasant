/* Title: Can.js
 * Sub: Canvas
 * By: Daniel R. (sadasant.com)
 * Version: 0.01
 * License: http://opensource.org/licenses/mit-license.php
 */

var Can = (function(){
  /* CANVAS & VECTORS */
  /* INFO  */
  var info = ""+
    "CV.js \n"+
    "Canvas and Vectors \n"+
    "Author: Daniel R. (sadasant.com) \n"+
    "Version: 0.01"
  ;
  /* PRIVATE */
  var layers = [],
      obj = [];
  /* TOOLS */
  function setCan(id,d,width,height){
    this.can = d0.gEBI(id || "canvas");
    this.con = this.can.getContext(d || "2d");
    this.can.width = width || this.can.width;
    this.can.height = height || this.can.height;
    /* INHERIT CONTEXT
    (function (){
      for (var i in this.con.prototype){
        this.F.prototype[m] = d0.ref(this.con.prototype,this.con.prototype[i]);
      }
    }());
    */
  }
  function addToLayer(n,obj){
    return true;
  }
  function draw(obj,clear){
    var con = this.con,
        can = this.can;
    if (clear) {
      this.draw(this.rect(0, 0, can.width, can.height, clear));
    }
    con.save();
    if (obj.fill) con.fillStyle = obj.fill;
    if (obj.stroke) con.strokeStyle = obj.stroke;
    for (var i in obj.acts) {
      obj.acts[i].call(obj,con);
    }
    if (obj.fill) con.fill();
    con.restore();
    return 1;
  }
  /* MOTHERS */
  function F(args){
    this.move(args.x,args.y);
    for (var i in args) {
      if (i !== "x" && i !== "y") {
        this[i] = this[i] || args[i] || 0;
      }
    }
    this.acts = [];
  }
  F.prototype.addAct = function(type,args){
    var A = null;
    switch(type){
      case "trans":
        A = function (con){ con.translate(this.x,this.y); };
        break;
      case "arc":
        A = function (con){
          con.beginPath();
          con.arc(0,0,this.r,args.start,args.end);
          con.closePath();
        };
        break;
      case "rect":
        A = function (con){ con.fillRect(this.x, this.y, this.width, this.height); };
        break;
      case "line":
        A = function (con){
          var moves = this.moves;
          con.beginPath();
          d0.bug(moves.length);
          con.moveTo(moves[0][0],moves[0][1]);
          for(var i = 1; i < moves.length; i++){
            con.lineTo(moves[i][0],moves[i][1]);
          }
          con.stroke();
        };
        break;
    }
    A.dad = this;
    this.acts.push(A);
  };
  F.prototype.move = function(x,y){
    this.x = x || this.x || 0;
    this.y = y || this.y || 0;
  };
  /* SONS */
  _F = {};
  _F.circle = function (x,y,r,fill){
    /* var c = Can.circle(x,y,r,fill); */
    var f = new F({x:x,y:y,r:r,fill:fill});
    f.addAct("trans");
    f.addAct("arc",{start:0,end:Math.PI*2});
    return f;
  };
  _F.rect = function (x,y,width,height,fill){
    /* var c = Can.rect(x,y,width,height,fill); */
    var f = new F({x:x,y:y,width:width,height:height,fill:fill});
    f.addAct("rect");
    return f;
  };
  _F.line = function (x,y,stroke,moves){
    /* var c = Can.line(x,y,stroke,moves); */
    var f = new F({x:x,y:y,stroke:stroke,moves:moves});
    f.addAct("trans");
    f.addAct("line");
    return f;
  };
  /* PUBLIC */
  return {
    can: null, //canvas
    con: null, //context
    setCan: setCan,
    draw: draw,
    circle: _F.circle,
    rect: _F.rect,
    line: _F.line
  };
}());
 