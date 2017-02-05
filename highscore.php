<pre>
<?php

if(!empty($_POST['highscore']))
{
  $newScore = json_decode($_POST['highscore'], true);

  if ($newScore != NULL)
  {
    $file_text = file_get_contents("highscore.json");
    $data = json_decode($file_text, true);

    array_push($data['scores'], $newScore);

    $file = fopen(getcwd() . "/highscore.json", "w");

    fwrite($file, json_encode($data));

    fclose($file);
  }
}

?>
</pre>
