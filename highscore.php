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
      return ($a['hits'] > $b['hits']) ? -1 : 1;      // More Shots is better
    }
  }
  return ($a['score'] > $b['score']) ? -1 : 1;
}

if(!empty($_POST['highscore']))
{
  $newScore = json_decode($_POST['highscore'], true);

  if ($newScore != NULL)
  {
    // Get JSON from file
    $file_text = file_get_contents("highscore.json");
    $data = json_decode($file_text, true);

    // Count played games
    if (isset($data["games_played"]))
    {
      $data["games_played"]++;
    } else
    {
      $data["games_played"] = 1;
    }

    // Add new highscore to the list
    array_push($data['scores'], $newScore);

    // Sort the list
    usort($data['scores'], 'cmp');

    // Truncate array to 100 entries
    if (count($data['scores']) > 100)
      $data['scores'] = array_slice($data['scores'], 0, 100);

    // (Over)write JSON to file
    $file = fopen(getcwd() . "/highscore.json", "w");
    fwrite($file, json_encode($data));
    fclose($file);
  }
}

?>
