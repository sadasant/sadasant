<?PHP
// Shade.php, a small MVC
// by Daniel Rodríguez
// sadasant.com/license

class Shade {

  // What to do if the url is empty.
  public $ifEmpty = 'index';

  // Function Routes
  private $PATH = '';
  private $FUNS = '';
  private $U404 = 'views/404';

  // Constructor
  function __construct($PATH) {
    $this->PATH = $PATH;
    $this->FUNS = file_get_contents($PATH);
  }

  // View method, it renders a view.
  // It's good becuase each view is loaded
  // inside the scope of this method.
  function view($path, $p = null) {
    include($path.'.php');
  }

  // parseURL
  // Getting the url appendix: /?
  // and all the sub-directories as params: /?/?/?/?
  function parseURL() {
    $path = ($path = explode('.php/', strtolower($_SERVER['PHP_SELF']))) ? $path[1] : '';
    $page = explode('/', $path);
    return array(
      'params' => array_slice($page, 1)
    , 'page'   => $page[0] ? $page[0] : 'index'
    , 'path'   => $path
    );
  }

  function callURL() {
    // Parsing the url...
    $req = $this->parseURL();
    include($this->PATH);

    // The function exists in our functions file?
    if (strpos($this->FUNS, 'function ' . $req['page']) !== false) {
      return $req['page']($this, $req);
    }
    // Check if this is a blog post,
    // for which it must have a syntax like this: 0000/00/00/some-thing.html
    elseif (preg_match('/\d{4}\/\d{2}\/\d{2}\/[\w-]*.html/', $req['path'])) {
      showPost($this, $req);
    }
    // Check posts per date,
    // within this url: 0000/*
    // it could mean: 0000/00/00/ too.
    elseif (is_numeric($req['page'])) {
      postsPerDate($this, $req);
    }
    // Call 404
    else {
      $this->forbidden();
    }
  }

  // Forbidden
  function forbidden() {
    $this->view($this->U404);
  }
}

?>
