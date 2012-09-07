<?
// digest.php
// by Daniel Rodríguez
// for sadasant.com

// Awaking
// -------

// Libraries
include('../lib/Markdown.php');

// Simple write file handler
function writeFile($filename, $content) {
  $file = fopen($filename, 'w+');
  fwrite($file, $content);
  fclose($file);
}

$months = array(
  "01" => "January"
, "02" => "February"
, "03" => "March"
, "04" => "April"
, "05" => "May"
, "06" => "June"
, "07" => "July"
, "08" => "August"
, "09" => "September"
, "10" => "October"
, "11" => "November"
, "12" => "December"
);
?>

<body style="background:black; font-family:Palatino; color: white;">
<br> Good day master!
<br> Any great new?
<br> <br> <hr>
<br> <b>*Scratches*</b>
<br>
<br> Ok I'm hungryyyyyyyyyy!
<br>
<br> (As always)
<br>
<br> <b>*Taking a look to what you've got*</b>
<br>

<?
// Looking for food
// ----------------

$glob  = glob('../feed/*');

// No food.
if (!$glob) {
  echo "<br> :/ you gave me no food.";
  echo "<br>";
  echo "<br> <b>*Goes to sleep*</b>";
  die();
}

$count = count($glob);

// Food!!!
echo "<br> $count pieces of FOOOOD :D";
echo "<br>";
echo "<br> <b>*OM NOM NOM*</b>";
echo "<br>";

foreach ($glob as $k => $filename) {
  echo "<br> (Eating: $filename)";

  // Extracting the values
  $newname  = strtolower(str_replace('.md', '.html', substr($filename, 8)));
  $date     = explode('-', $newname);
  $source   = file_get_contents($filename);
  $content  = explode('--- ', $source);
  $raw_data = array_shift($content);
  $data     = json_decode($raw_data);
  $parts    = array();
  foreach ($content as $kk => $content_value) {
    $content_value = preg_split("/ ---\n/", $content_value);
    $parts[$content_value[0]] = Markdown($content_value[1]);
  }

  echo "<br> (As: $newname)";

  // URL name
  $urlname     = $newname;
  $urlname[4]  = '/';
  $urlname[7]  = '/';
  $urlname[10] = '/';

  // Resetting $content
  $content  = '';
  $content .= '<div class="data">' . $raw_data . '</div>';
  $content .= '<div class="title">';

  // Image at the title
  if ($parts['image_title']) {
    $content .= $parts['image_title'];
  }

  // Date
  $content .= '<div class="date">';
  $content .=   "<div class='day'  ><a href='/$date[0]/$date[1]/$date[2]/'> $date[2] </a></div>";
  $content .=   "<div class='month'><a href='/$date[0]/$date[1]/'> " . $months[$date[1]] . " </a></div>";
  $content .=   "<div class='year' ><a href='/$date[0]/'> $date[0] </a></div>";
  $content .= '</div>';

  // Writing the title
  $content .= '<h1><a href="/' . $urlname . '">' . $data->title . '</a></h1>';
  $content .= '</div>';

  // Opening, writing and closing the content
  $content .= '<div class="content">';
  $content .= $parts['content'];
  $content .= '</div>';
  // echo $content;

  // Appending the acknowledgements and share buttons
  $post_url   = urlencode('http://sadasant.com/' . $urlname);
  $post_title = urlencode('"' . $data->title . '" by @sadasant');
  $content .= '<div class="by">';
  $content .=   '<a href="http://sadasant.com/license">by-nc-sa</a>';
  $content .= '</div>';
  $content .= '<div class="share">';
  $content .=   '<b>Share on:</b>';
  $content .=   '<ul>';
  $content .=     '<li><a href="#" onclick="window.open(\'https://twitter.com/intent/tweet?original_referer=' . $post_url . '+&text=' . $post_title . '+&url=' . $post_url . '\',\'\',\'toolbar=0,status=0,resizable=1,width=626,height=436\'); return false">Twitter</a></li>';
  $content .=     '<li><a href="#" onclick="window.open(\'https://plus.google.com/share?url=' . $post_url . '\', \'\', \'toolbar=0,status=0,resizable=1,width=626,height=436\'); return false">Google+</a></li>';
  $content .=     '<li><a href="#" onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?s=100&p[url]=' . $post_url . '+&p[title]=' . $post_title . '\', \'\', \'toolbar=0,status=0,resizable=1,width=626,height=436\'); return false">Facebook</a></li>';
  $content .=   '</ul>';
  $content .=   '<b>Send me your comments:</b>';
  $content .=   '<ul>';
  $content .=     '<li><a href="#" onclick="var user = \'sadasant\', host =\'sadasant.com\'; window.location = \'mailto:\' + user + \'@\' + host; return false">by Email</a></li>';
  $content .=   '</ul>';
  $content .= '</div>';

  // Writing the public file
  writeFile('../posts/' . $newname, $content);

  // Writing the source file
  writeFile(str_replace('/feed/', '/source/', $filename), $source);

  // Removing the food
  unlink($filename);

  echo "<br> (Ate: $filename)";
  echo "<br>";
}

echo "<br> <br> <hr>";
echo "<br> <b>*Asimilating the food*</b>";
echo "<br>";

// Parsing the source files
$glob = glob('../source/*');
rsort($glob);

echo "<br> (Remembering I've had at least ".count($glob)." foods 'til date)";
echo "<br>";

$total         = array();
$featured_json = array();
$tags          = array();

foreach ($glob as $k => $filename) {

  // Extracting the values
  $newname  = strtolower(str_replace('.md', '.html', substr($filename, 10)));
  $content  = explode('--- ', file_get_contents($filename));
  $raw_data = array_shift($content);
  $data     = json_decode($raw_data);

  // Adding the name to the total array
  array_push($total, $newname);

  echo "<br> Reading: $newname";

  // Saving the tags count
  foreach ($data->tags as $kk => $tag) {
    if (!$tags[$tag]) {
      $tags[$tag] = array();
    }
    array_push($tags[$tag], $newname);
  }

}

echo "<br>";
echo "<br>";

// Writing the last 5 posts
$last = json_encode(array_slice($total, 0, 5));
echo "<br> <b>*The last 5 posts to date were:*</b>";
echo "<br>";
echo "<br>" . $last;
echo "<br>";

// Sorting the $tags
function comparator($a, $b) {
  return count($b) - count($a);
}
uasort($tags, 'comparator');

echo "<br> <b>*Writing the tagged jsons:*</b>";
echo "<br>";

// Removing old tagged jsons
$tagged = glob('../json/tagged_*');
foreach ($tagged as $k => $filename) {
  unlink($filename);
}

// Writing the tags into their specific files.
$top_tags = array();
$count = 0;
foreach ($tags as $k => $v) {
  $count += 1;

  // Picking the first 20 more common
  if ($count < 21) {
    array_push($top_tags, $k);
  }

  $tagged = '../json/tagged_' . $k . '.json';
  echo "<br> Writing: $tagged";

  // Saving the tags count
  $k = preg_replace('/[\/ -]/', '_', $k);
  // Writing tagged_$k.json
  writeFile($tagged, json_encode($v));
}

echo "<br>";
echo "<br> <b>*The twenty most used tags were:*</b>";
echo "<br>";

// Writing top_tags.json
var_dump($top_tags);
$top_tags = json_encode($top_tags);
writeFile('../json/top_tags.json', $top_tags);
echo "<br>";
echo "<br>";

echo "<br> Bye bye sir!";
?>
