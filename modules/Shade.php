<?PHP
// Shade.php, a small MVC
// by Daniel Rodríguez
// sadasant.com/license

class Shade {

  // What to do if the url is empty.
  public $ifEmpty = 'index';

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

}

$Shade = new Shade();

?>
