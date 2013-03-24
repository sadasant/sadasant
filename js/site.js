// site.js
// by Daniel Rodríguez
// http://sadasant.com/license

(function(W, D, Shade) { // window, document, Shade.js

  var $filter  = Shade.find('#filter')
    , $items   = Shade.find('li', $filter)
    , $clone   = $items[0].cloneNode(true)
    , $first   = $items.shift()
    , $input   = Shade.find('input', $first)
    , $trunk   = Shade.find('#trunk')
    , all_tags = {}
    , active_tags = []
    , started
    , filtering
    , resetting
    , query
    , last_scroll
    , rock_bottom
    , current_page = 0
    , class_active = 'active'


  $items.map(function(e) {
    e.onclick = activateTag
    e.firstChild.onclick = disableClick
  })


  saveIndex()
  bindTitles()
  Shade.addEvent(W, 'popstate', changeState)
  Shade.addEvent($input, 'keyup', startLoop)
  Shade.addEvent(W, 'scroll', detectBottom)


  function saveIndex() {
    if (!history.replaceState) {
      return
    }
    var $articles = Shade.find('.article', $trunk)
      , $headlines = Shade.find('.headline', $trunk)
      , $item
      , active_tags = []
      , data
      , index = 0
    for (; $item = $items[index++] ;) {
      if (Shade.hasClass($item, class_active)) {
        active_tags[active_tags.length] = $item.firstChild.innerHTML
      }
    }
    index = 0
    data = {
      posts       : []
    , className   : $articles.length ? 'article' : 'headline'
    , active_tags : active_tags
    }
    if (!$articles.length) {
      $articles = $headlines
    }
    for (; $articles[index]; index++) {
      data.posts[index] = $articles[index].innerHTML
    }
    history.replaceState(data, '', W.location.pathname + W.location.search)
  }


  function startLoop() {
    if (query === $input.value) {
      return
    }
    query = $input.value
    query = query.replace(/[^\w ]/g, '').toLowerCase()
    $input.value = query
    var $item
      , index = 0
      , tag
    if (query.length < 3) {
      if (started) {
        // Remove unactive tags
        for (tag in all_tags) {
          if (!Shade.hasClass(all_tags[tag], class_active)) {
            $filter.removeChild(all_tags[tag])
            ;delete all_tags[tag]
          }
        }
      }
      if (query) {
        return
      }
    } else
    if (!started) {
      started = true
      for (; $item = $items[index++] ;) {
        if (!Shade.hasClass($item, class_active)) {
          $filter.removeChild($item)
        } else {
          all_tags[$item.firstChild.innerHTML] = $item
        }
      }
      $items.length = 0
    }
    if (!filtering) {
      filtering = true
      filterTags(query)
    }
  }


  function filterTags(query) {
    query = query ? '/?tags=' + query : '/json/top_tags.json'
    Shade.http('GET', query, function(ok, data) {
      var tags
        , tag
        , $tag
        , index = 0
      if (ok) {
        tags = JSON.parse(data)
        if (tags.length) {
          for (tag in all_tags) {
            if (!Shade.hasClass(all_tags[tag], class_active) && !~tags.indexOf(tag)) {
              $filter.removeChild(all_tags[tag])
              ;delete all_tags[tag]
            }
          }
          for (; tag = tags[index++] ;) {
            if (!all_tags[tag]) {
              $tag = $clone.cloneNode(true)
              $tag.innerHTML = '<a href="/?filter=' + tag + '">' + tag + '</a>'
              $tag.onclick   = activateTag
              $tag.firstChild.onclick = disableClick
              all_tags[tag]  = $tag
              $filter.appendChild($tag)
            }
          }
        }
        filtering = false
      }
    })
  }


  function activateTag() {
    if (Shade.hasClass(this, class_active)) {
      Shade.removeClass(this, class_active)
    } else {
      Shade.addClass(this, class_active)
    }
    resetPosts()
  }


  function disableClick(e) {
    e.preventDefault()
  }


  function resetPosts() {
    if (resetting) {
      return
    }
    resetting = true
    var $active = $filter.getElementsByClassName(class_active)
      , $item
      , index = 0
      , tags  = ''
      , url
    if (!$active.length) {
      resetting = false
      return
    }
    $trunk.style.opacity = 0.3
    for (; $item = $active[index++] ;) {
      tags += $item.firstChild.innerHTML + ' '
    }
    active_tags = tags
    url = '/?filter=' + tags
    if (!history.pushState) {
      window.location = url
    }
    Shade.http('GET', url + '&json=1', gotHeadlines)
  }


  function gotHeadlines(ok, data) {
    if (ok) {
      data = JSON.parse(data)
      data.active_tags = active_tags
      data.className = 'article'
      history.pushState(data, '', '/?filter=' + active_tags)
      history.forward()
      changeState({ state : data })
    } else {
      $trunk.style.opacity = 1
    }
    resetting = false
  }


  function changeState(e) {
    rock_bottom  = false
    current_page = 0
    var state = e ? e.state : history.state
      , index = 0
      , $item
      , tag
    if (!state) {
      return
    }
    $trunk.innerHTML = ''
    if (state.active_tags) {
      active_tags = state.active_tags
      for (; $item = $items[index++] ;) {
        tag = $item.firstChild.innerHTML
        if (~active_tags.indexOf(tag)) {
          if (!Shade.hasClass($item, class_active)) {
            Shade.addClass($item, class_active)
          }
        } else {
          if (Shade.hasClass($item, class_active)) {
            Shade.removeClass($item, class_active)
          }
        }
      }
      orderActives()
    }
    appendPosts(state.posts, state.className)
  }


  function orderActives() {
    var $actives      = []
      , $first_parent = $first.parentNode
      , $first_next
      , $item = $first
      , index = 0
    while ($item = $item.nextSibling) {
      if ($item.tagName === 'LI') {
        if (Shade.hasClass($item, class_active)) {
          $actives[$actives.length] = $item
        } else {
          if (!$first_next) {
            $first_next = $item
          }
        }
      }
    }
    for (; $item = $actives[index++] ;) {
      $first_parent.insertBefore($item, $first_next)
    }
  }


  function appendPosts(posts, className) {
    var index = 0
      , post
      , div
    if (!posts.length) {
      return
    }
    if (posts.length === 1) {
      posts = [posts]
    }
    addPost()
    function addPost() {
      if (post = posts[index++]) {
        div = D.createElement('div')
        Shade.addClass(div, className)
        div.innerHTML = post
        $trunk.appendChild(div)
        setTimeout(addPost, 100)
      } else {
        bindTitles()
        $trunk.style.opacity = 1
      }
    }
  }


  function bindTitles() {
    if (!history.pushState) {
      return
    }
    var title_links = Shade.find('h1 a', $trunk)
      , link
      , index = 0
    if (!title_links) {
      return
    }
    for (; link = title_links[index++] ;) {
      link.onclick = loadPost
    }
  }


  function loadPost(e) {
    e.preventDefault()
    var href = this.href
    $trunk.style.opacity = 0.3
    Shade.http('GET', href + '?json=1', function(ok, data) {
      if (ok) {
        data = JSON.parse(data)
        data.className = 'article'
        history.pushState(data, '', href)
        history.forward()
        changeState({ state : data })
      }
    })
  }


  function detectBottom() {
    if (rock_bottom) {
      return
    }
    var pathname = W.location.pathname
    if (!(pathname && !~pathname.indexOf('.html'))) {
      return
    }
    var node   = D.documentElement.clientHeight ? D.documentElement : D.body
      , scroll = W.scrollY
            || W.pageYOffset
            || node.scrollTop
      , className = pathname === '/' ? 'article' : 'headline'
      , href
    if (last_scroll === scroll) {
      return
    }
    last_scroll = scroll
    if (node.scrollHeight === scroll + node.clientHeight) {
      href = pathname + (W.location.search || '?')
      href = href.split('&')[0] + '&json=1&page=' + (current_page + 1)
      Shade.http('GET', href, function(ok, data) {
        if (ok && data) {
          current_page += 1
          data = JSON.parse(data)
          if (!data.posts.length) {
            rock_bottom = true
            return
          }
          appendPosts(data.posts, className)
        }
      })
    }
  }

})(window, document, window.Shade)
