// Shade.js
// by Daniel Rodríguez
// http://sadasant.com/license

(function(W, D, U) { // window, document, undefined

  // Type checker
  function typeOf(object) {
    return object === U || object === null ? object : Object.prototype.toString.call(object).slice(8, -1)
  }


  // Storage
  function DB() {
    var storage = W.localStorage || {}
    this.get = function(key) {
      return storage[key] ? JSON.parse(storage[key]) : storage[key]
    }
    this.set = function(key, value) {
      if (!value) {
        return false
      }
      storage[key] = typeOf(value) === 'String' ? value : JSON.stringify(value)
    }
    this.drop = function(key) {
      for (key in storage) {
        delete storage[key]
      }
    }
  }


  // DOM doggie
  function find(str, node) {
    node = node || D;
    var type  = typeOf(node)
      , strip = str.split(' ')
      , head  = strip.shift()
      , tail  = strip.join(' ')
      , index = 0
      , _node = []
      , found
    if (!~type.indexOf('HTML') || type === 'HTMLCollection' && !node.length) {
      return
    }
    switch (head[0]) {
      case '.' : node = node.getElementsByClassName(head.slice(1)) ; break;
      case '#' : node = node.getElementById(head.slice(1))         ; break;
      default  : node = node.getElementsByTagName(head)            ; break;
    }
    if (tail.length) {
      if (node.length) {
        _node = []
        for (; node[index] ; index+=1) {
          found = find(tail, node[index])
          if (found.length) {
            _node = _node.concat(found)
          } else {
            if (found.name !== U) {
              _node[_node.length] = found
            }
          }
        }
        index = 0
        node = [];
        for (; _node[index] ; index += 1) {
          node = node.concat(_node[index])
        }
        return node
      } else {
        return find(tail, node)
      }
    } else {
      if (node.length) {
        return node.length === 1 ? node[0] : _node.slice.call(node)
      } else {
        return node
      }
    }
  }


  // Cross browser class helpers
  function hasClass(className, node) {
    if (node.classList) {
      return node.classList.contains(className)
    } else {
      return !!~node.className.indexOf(className)
    }
  }
  function addClass(className, node) {
    if (node.classList) {
      node.classList.add(className)
    } else {
      node.className += ' ' + className + ' '
    }
  }
  function removeClass(className, node) {
    if (node.classList) {
      node.classList.remove(className)
    } else {
      node.className = node.className.replace(new RegExp(className, 'g'), '')
    }
  }


  // Events helper
  function addEvent(node, type, callback) {
    if (node.addEventListener) {
      node.addEventListener(type, callback, false)
    } else {
      node.attachEvent('on' + type, callback)
    }
  }


  // Object To URL
  function urlify(object) {
    var url = []
      , key
    for (key in object) {
      url[url.length] = encodeURIComponent(key) + '=' + encodeURIComponent(object[key])
    }
    return url.join('&')
  }


  // AJAX
  function http(type, url, headers, data, callback) {
    var xhr   = new XMLHttpRequest()
      , index = 4
      , key
      , value
    for (; ; index--) {
      value = arguments[index]
      if (value && typeOf(value) === 'Function') {
        callback = value
        break
      }
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && typeOf(callback) === 'Function') {
        callback(xhr.status < 300, xhr.responseText, xhr)
      }
    }
    xhr.open(type, url, true)
    if (headers || (data && (headers = { 'Content-Type': 'application/x-www-form-urlencoded' }))) {
      for (key in headers) {
        xhr.setRequestHeader(key, headers[key])
      }
    }
    xhr.send(typeOf(data) === 'Object' ? urlify(data) : data)
    return xhr
  }


  // Setting the shade
  W.Shade = {
    typeOf      : typeOf
  , db          : new DB()
  , find        : find
  , hasClass    : hasClass
  , addClass    : addClass
  , removeClass : removeClass
  , addEvent    : addEvent
  , http        : http
  }

})(window, document)
