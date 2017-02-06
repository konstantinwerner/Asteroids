<?php

function cmp($a, $b)
{
  if ($a['score'] == $b['score'])
  {
    if ($a['hits'] == $b['hits'])
    {
      if ($a['shots'] == $b['shots'])
      {
        return 0;
      } else {
        return ($a['shots'] < $b['shots']) ? -1 : 1;  // Less Shots is better
      }
    } else {
      return ($a['hits'] > $b['hits']) ? -1 : 1;  // More Shots is better
    }
  }
  return ($a['score'] > $b['score']) ? -1 : 1;
}

if(!empty($_POST['highscore']))
{
  $newScore = json_decode($_POST['highscore'], true);

  if ($newScore != NULL)
  {
    $file_text = file_get_contents("highscore.json");
    $data = json_decode($file_text, true);

    array_push($data['scores'], $newScore);

    usort($data['scores'], 'cmp');

    $file = fopen(getcwd() . "/highscore.json", "w");

    fwrite($file, json_encode($data));

    fclose($file);
  }
}

?>
