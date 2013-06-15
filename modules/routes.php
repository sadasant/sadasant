<?PHP

// Thanks to: http://detectmobilebrowsers.com/
function isMobile() {
  $useragent = $_SERVER['HTTP_USER_AGENT'];
  return preg_match('/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4));
}

// The index
// Route: /
function index($Shade) {
  // Check if the user is filtering articles
  if ($_GET['filter']) {
    return filter($Shade);
  }
  // Check if the user is filtering tags
  if ($_GET['tags']) {
    return tags($Shade);
  }
  $glob = array_reverse(glob('posts/*'));
  $last = array();
  $countDown  = $_GET['page'] ? 5 * $_GET['page'] : 0;
  $maxPerPage = 5;
  foreach ($glob as $k => $v) {
    if ($countDown) {
      $countDown -= 1;
      continue;
    }
    if (!$maxPerPage) {
      break;
    }
    $v = file_get_contents($v);
    if (isMobile()) {
      $v = str_replace('.jpg"', '-mobile.jpg"', $v);
    }
    array_push($last, $v);
    $maxPerPage -= 1;
  }
  if ($_GET['json']) {
    die(json_encode(array(
      'posts' => $last
    )));
  }
  $Shade->view('views/layout', array(
    'view' => 'views/index'
  , 'tags' => json_decode(file_get_contents('json/top_tags.json'))
  , 'last' => $last
  ));
}


// The filter
// Route: /?filter=
function filter($Shade) {
  $filter     = array_filter(array_unique(explode(' ', $_GET['filter'])));
  $files      = array();
  $tagged     = array();
  $headlines  = array();
  $countDown  = $_GET['page'] ? 10 * $_GET['page'] : 0;
  $maxPerPage = 10;
  foreach ($filter as $k => $tag) {
    $tagged[$tag] = json_decode(file_get_contents("json/tagged_$tag.json"));
    foreach ($tagged[$tag] as $kk => $filename) {
      if ($countDown) {
        $countDown -= 1;
        continue;
      }
      if (!$maxPerPage) {
        break;
      }
      $maxPerPage -= 1;
      if (in_array($filename, $files)) {
        continue;
      }
      array_push($files, $filename);
      $post = file_get_contents('posts/' . $filename);
      $data = explode('data">', $post);
      $data = explode('</div>', $data[1]);
      $data = json_decode($data[0]);
      $active_tags = $data->tags;
      foreach ($filter as $kk => $tagcheck) {
        if (!in_array($tagcheck, $active_tags)) {
          continue 2;
        }
      }
      $post      = array_shift(explode('<div class="content', $post));
      $headline  = preg_replace('/<img src.*\/>/', '', $post);
      array_push($headlines, $headline);
    }
  }
  if ($_GET['json']) {
    die(json_encode(array(
      'posts'       => $headlines
    , 'active_tags' => $filter
    )));
  }
  $Shade->view('views/layout', array(
    'view'        => 'views/headlines'
  , 'headlines'   => $headlines
  , 'active_tags' => $filter
  , 'tags'        => json_decode(file_get_contents('json/top_tags.json'))
  ));
}


// The tag filter (for the sidebar)
function tags($Shade) {
  $filter = explode(' ', $_GET['tags']);
  $tags   = array();
  foreach ($filter as $value) {
    if (!$value || strlen($value) < 3) {
      continue;
    }
    $glob = glob("json/tagged_$value*.json");
    if (!$glob) {
      break;
    }
    foreach ($glob as $file) {
      $file = explode('/', $file);
      $file = explode('_', array_pop($file));
      array_shift($file);
      $file = explode('.', join($file));
      array_push($tags, array_shift($file));
    }
  }
  echo json_encode(array_unique($tags));
}


// One of the posts.
// Route: 0000/00/00/some-thing.html
function showPost($Shade, $req) {
  $post = str_replace('/', '-', $req['path']);
  $post = file_get_contents('posts/' . $post);
  $data = explode('data">', $post);
  $data = explode('</div>', $data[1]);
  $data = json_decode($data[0]);
  $active_tags = $data->tags;
  if ($_GET['json']) {
    die(json_encode(array(
      'posts'       => array($post)
    , 'active_tags' => $active_tags
    )));
  }
  if (isMobile()) {
    $post = str_replace('.jpg"', '-mobile.jpg"', $post);
  }
  $Shade->view('views/layout', array(
    'view' => 'views/post'
  , 'post' => $post
  , 'tags' => json_decode(file_get_contents('json/top_tags.json'))
  , 'active_tags' => $active_tags
  , 'post_url' => urlencode('http://sadasant.com/' . $req['path'])
  ));
}


// Posts per date.
// Route: 0000/*
function postsPerDate($Shade, $req) {
  $path  = str_replace('/', '-', $req['path']);
  $glob  = glob('posts/' . $path . '*');
  if ($glob == false) {
    return $Shade->forbidden();
  }
  rsort($glob);
  $posts      = array();
  $count      = 0;
  $countDown  = $_GET['page'] ? 10 * $_GET['page'] : 0;
  $maxPerPage = 10;
  foreach ($glob as $k => $filename) {
    if ($countDown) {
      $countDown -= 1;
      continue;
    }
    if (!$maxPerPage) {
      break;
    }
    $posts[$count] = array_shift(explode('<div class="content', file_get_contents($filename)));
    $posts[$count] = preg_replace('/<img src.*\/>/', '', $posts[$count]);
    $count += 1;
  }
  if ($_GET['json']) {
    die(json_encode(array(
      'posts' => $posts
    )));
  }
  $Shade->view('views/layout', array(
    'view'      => 'views/headlines'
  , 'headlines' => $posts
  , 'tags'      => json_decode(file_get_contents('json/top_tags.json'))
  ));
}

// RSS Feed
function atom($Shade) {
  $Shade->view('views/atom');
}
function rss($Shade) {
  atom($Shade);
}
function feed($Shade) {
  atom($Shade);
}

// About
function about($Shade) {
  $Shade->view('views/layout', array(
    'view'      => 'views/post'
  , 'post'      => file_get_contents('about.html')
  , 'tags'      => json_decode(file_get_contents('json/top_tags.json'))
  ));
}

// Projects
function projects($Shade) {
  $Shade->view('views/layout', array(
    'view'      => 'views/post'
  , 'post'      => file_get_contents('projects.html')
  , 'tags'      => json_decode(file_get_contents('json/top_tags.json'))
  ));
}

// Hobbies
function hobbies($Shade) {
  $Shade->view('views/layout', array(
    'view'      => 'views/post'
  , 'post'      => file_get_contents('hobbies.html')
  , 'tags'      => json_decode(file_get_contents('json/top_tags.json'))
  ));
}

?>
