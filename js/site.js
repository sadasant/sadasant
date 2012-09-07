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
    , active_tags
    , started
    , filtering
    , resetting
    , query
    , last_scroll
    , rock_bottom
    , current_page = 0


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
      if (Shade.hasClass('active', $item)) {
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
          if (!Shade.hasClass('active', all_tags[tag])) {
            $filter.removeChild(all_tags[tag])
            ;delete all_tags[tag]
          }
        }
      }
      return
    }
    if (!started) {
      started = true
      for (; $item = $items[index++] ;) {
        if (!Shade.hasClass('active', $item)) {
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
    Shade.http('GET', '/?tags=' + query, function(ok, data) {
      var tags
        , tag
        , $tag
        , index = 0
      if (ok) {
        tags = JSON.parse(data)
        if (tags.length) {
          for (tag in all_tags) {
            if (!Shade.hasClass('active', all_tags[tag]) && !~tags.indexOf(tag)) {
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
    if (Shade.hasClass('active', this)) {
      Shade.removeClass('active', this)
    } else {
      Shade.addClass('active', this)
    }
    $trunk.style.opacity = 0.3
    setTimeout(resetPosts, 1000)
  }


  function disableClick(e) {
    e.preventDefault()
  }


  function resetPosts() {
    if (resetting) {
      return
    }
    resetting = true
    var $active = $filter.getElementsByClassName('active')
      , $item
      , index = 0
      , tags  = ''
      , url
    if (!$active.length) {
      resetting = false
      return
    }
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
          Shade.addClass('active', $item)
        } else {
          Shade.removeClass('active', $item)
        }
      }
    }
    appendPosts(state.posts, state.className)
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
        Shade.addClass(className, div)
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
