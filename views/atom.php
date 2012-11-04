<?
// Libraries
include('lib/Markdown.php');

// Parammeters
$page = $_GET['page'];

// Parsing the source files
$glob = glob('source/*');
rsort($glob);

$maxPerPage = 8;
$countDown  = $page ? $maxPerPage * $page : 0;

$items = '';

$updated = '';

foreach ($glob as $k => $filename) {

  if ($countDown) {
    $countDown -= 1;
    continue;
  }
  if (!$maxPerPage) {
    break;
  }
  $maxPerPage -= 1;

  // Extracting the values
  $newname  = strtolower(str_replace('.md', '.html', substr($filename, 7)));
  $date     = explode('-', $newname);
  $content  = explode('--- ', file_get_contents($filename));
  $raw_data = array_shift($content);
  $data     = json_decode($raw_data);
  $parts    = array();
  foreach ($content as $kk => $content_value) {
    $content_value = preg_split("/ ---\n/", $content_value);
    $parts[$content_value[0]] = Markdown($content_value[1]);
  }

  // URL name
  $urlname     = $newname;
  $urlname[4]  = '/';
  $urlname[7]  = '/';
  $urlname[10] = '/';

  $date = date("r", strtotime($date[0].'-'.$date[1].'-'.$date[2]));
  if (!$updated) {
    $updated = $date;
  }

  $items .= '
  <item>
    <title>'. $data->title .'</title>
    <link>http://sadasant.com/'. $urlname .'</link>
    <pubDate>'. $date .'</pubDate>
    <dc:creator>Daniel Rodríguez</dc:creator>
    ';

  foreach ($data->tags as $i => $v) {
    $items .= '<category domain="http://sadasant.com/?filter='. $v .'"><![CDATA['. $v .']]></category>';
  }

  $items .= '
    <content:encoded>
      <![CDATA[';

  // Image at the title
  if ($parts['image_title']) {
    $items .= str_replace('.jpg"', '-mobile.jpg"', $parts['image_title']);
  }
  $items .= $parts['content'].'
        <br/>
        <div class="by">
          <small>License: <a href="http://sadasant.com/license">by-nc-sa</a></small>
        </div>
      ]]>
    </content:encoded>
  </item>';
}

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
  <rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
    >
  <channel>
    <title>sadasant</title>
    <link href="http://sadasant.com/" />
    <link href="http://sadasant.com/atom<?= $page ? '?page='.$page : '' ?>" rel="self" type="application/rss+xml" />
    <?
    if ($page) {
      echo '<link rel="prev" href="http://sadasant.com/atom?page='. ($page - 1) .'"/>';
    }
    if ($maxPerPage == 0) {
      echo '<link rel="next" href="http://sadasant.com/atom?page='. ($page + 1) .'"/>';
    }
    ?>
    <description>Conjeturas</description>
    <language>es-VE</language>
    <updated><?= $updated ?></updated>
    <sy:updatePeriod>weekly</sy:updatePeriod>
    <sy:updateFrecuency>1</sy:updateFrecuency>
    <?= $items ?>
  </channel>
</rss>
