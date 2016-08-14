<?php
	header('Content-type: text/plain; charset=utf-8');
	header('Cache-Control: no-store, no-cache');
	header('Expires: ' . date('r'));

	$x = $_POST['x'];
	$y = $_POST['y'];

	$str = $x.':'.$y;
	$file = fopen("../games/game.txt","w");
	fputs ($file,$str);
	fclose($file);

?>
