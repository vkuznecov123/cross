<?php

$file = fopen("../games/game.txt", "r");
$move = fgets($file);
fclose($file);
header("MOVE:$move");
?>
