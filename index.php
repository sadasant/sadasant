<?PHP
// By Daniel Rodríguez (sadasant.com)
// sadasant.com/license

session_start();

// Routes Path
$RPATH  = 'modules/routes.php';

// Including the Shade MVC.
include('modules/Shade.php');
$Shade = new Shade($RPATH);

// Parsing the requested URL
$req = $Shade->callURL();
?>
