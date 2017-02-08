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

$success = false;
// Check if data available in cache
if (apcu_exists('highscore'))
{
  $data = apcu_fetch('highscore', $success);
}

if (!$success || ($_GET['get'] == "refresh"))
{
  // Get JSON from file
  $file_text = file_get_contents("highscore.json");
  // Decode to JSON Object
  $data = json_decode($file_text, true);
  // Store in Caches
  apcu_store('highscore', $data);
}

// Set new highscore
if(!empty($_POST['highscore']))
{
  $newScore[] = json_decode($_POST['highscore'], true);

  if ($newScore[0] != NULL)
  {
    // Check JSON for illegal fields
    foreach ($newScore[0] as $key => $field)
    {
      if (strlen($field) > 36)
      {
        header('HTTP/1.0 403 Forbidden', true, 403);
        exit("Thou shalt not cheat!");
      }

      switch ($key)
      {
        case "guid":
        case "timestamp":
        case "name":
        case "score":
        case "hits":
        case "shots":
        case "duration":
        case "frames":
        break;
        default:
          header('HTTP/1.0 403 Forbidden', true, 403);
          exit("Thou shalt not cheat!");
        break;
      }
    }

    // Count played games
    if (isset($data["games_played"]))
    {
      $data["games_played"]++;
    } else
    {
      $data["games_played"] = 1;
    }

    $inserted = false;

    // Walk through existing scores
    for ($i = 0; $i < count($data['scores']); $i++)
    {
      // If newScore has a higher score than the p-th
      if ($newScore[0]['score'] > $data['scores'][$i]['score'])
      {
        // Insert it above the p-th
        array_splice($data['scores'], $i, 0, $newScore);
        $inserted = true;
        break;
      }
    }

    // Lower than all other scores -> push at the end
    if (!$inserted)
    array_push($data['scores'], $newScore[0]);

    // Add new highscore to the list
//    array_push($data['scores'], $newScore);

    // Sort the list
//    usort($data['scores'], 'cmp');

    // Truncate array to 100 entries
    if (count($data['scores']) > 100)
      $data['scores'] = array_slice($data['scores'], 0, 100);

    // Store new data in cache
    apcu_store('highscore', $data);

    // ...and store it in file, too
    $file = fopen(getcwd() . "/highscore.json", "w");
    fwrite($file, json_encode($data));
    fclose($file);
  }
}

// Request Highscores
if (($_GET['get'] == "highscore"))
{
  header('Content-Type: application/json');
  print_r(json_encode($data));
}

?>
