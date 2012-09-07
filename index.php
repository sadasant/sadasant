<?PHP
// By Daniel Rodríguez (sadasant.com)
// sadasant.com/license

session_start();

// Including the Shade MVC.
include('modules/Shade.php');
$Shade = new Shade();

// Function routes.
include('modules/routes.php');

// Parsing the requested URL
$req = $Shade->parseURL();

// If we have that route, render the page.
// else, show the forbidden announce.
if (function_exists($req['page'])) {
  $req['page']($Shade, $req);
}

// Check if this is a blog post,
// for which it must have a syntax like this: 0000/00/00/some-thing.html
elseif (preg_match('/\d{4}\/\d{2}\/\d{2}\/[\w-]*.html/', $req['path'])) {
  showPost($Shade, $req);
}

// Check posts per date,
// within this url: 0000/*
// it could mean: 0000/00/00/ too.
elseif (is_numeric($req['page'])) {
  postsPerDate($Shade, $req);
}

else {
  forbidden($Shade);
}

?>
