<?PHP
$filename = 'js/poems.json';
@ $fp = fopen($filename, 'wb');
if(!empty($_POST['data'])){
	$data = $_POST['data'];
	fwrite($fp, $data);
}
?>