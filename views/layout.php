<!DOCTYPE HTML>

<!--
// sadasant.com
// by Daniel R.
// c) 2012
-->

<?
$minified = $_GET['development'] ? '' : '.min';
?>

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no"/>
  <title>sadasant.com</title>
  <link rel="icon" type="image/x-icon" href="/images/sadasant.ico" />
  <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="sadasant's RSS" />
  <link rel="stylesheet" href="/css/yui-reset-min.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script type="text/javascript" src="/js/Shade<?=$minified?>.js"></script>
</head>
<body>

  <div id="main">
    <h1>sadasant</h1>
    <em>Daniel Rodríguez</em>
    <i>Open Sorcerer</i>
  </div>

  <div id="left">
    <a href="/<?=$_GET['development']?'?development=1':''?>"><img id="logo" src="/images/whiteskull.png" alt="" /></a>
    <ul id="filter">
      <li>
        <input type="text" placeholder="Filter..." autocomplete="off"/>
      </li>
<?
      // Listing the tags
      if ($p['active_tags']) {
        foreach ($p['active_tags'] as $k => $v) {
          echo '<li class="active"><a href="/?filter=' . $v . '">' . $v . '</a></li>';
        }
      }
      if ($p['tags']) {
        foreach ($p['tags'] as $k => $v) {
          if ($p['active_tags'] && in_array($v, $p['active_tags'])) {
            continue;
          } else {
            echo '<li><a href="/?filter=' . $v . '">' . $v . '</a></li>';
          }
        }
      }
?>
    </ul>
  </div>
  <div id="trunk">
<?
    // Rendering the view
    self::view($p['view'], $p);
?>
  </div>

</body>
<script type="text/javascript" src="/js/site<?=$minified?>.js"></script>
</html>
