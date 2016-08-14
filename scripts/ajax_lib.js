/*
** Функция возвращат объект XMLHttpRequest
*/
function getXMLHttpRequest(){
	if (window.XMLHttpRequest) {
		try {
			return new XMLHttpRequest();
		} catch (e){}
	} else if (window.ActiveXObject) {
		try {
			return new ActiveXObject('Msxml2.XMLHTTP');
		} catch (e){}
		try {
			return new ActiveXObject('Microsoft.XMLHTTP');
		} catch (e){}
	}
	return null;
}

/*
**Отправка данных о сделанном ходе на сервер
*/
function ajax_post(x,y) { 
	var req=getXMLHttpRequest();
	req.open("POST","/php_scripts/write.php",true);
	req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var str="x="+x+"&y="+y;
//	req.onreadystatechange = function(){
//		if(req.readyState!=4) return;
//		console.log('ajax resp'+req.responseText);
//	};

	req.send(str);
}

/*
**Запрос последнего хода с сервера
*/
function ajax_head() {
//	if (block) { //посылает запросы только во время хода противника	
		var req=getXMLHttpRequest();
		var req_move; //полученный с сервера ход	
		req.open("HEAD","/php_scripts/read.php",true);
		req.onreadystatechange = function(){
			if(req.readyState==4 && req.status==200 && req.getResponseHeader("MOVE")!='') {
				req_move=req.getResponseHeader("MOVE");
				if(req_move!=last_move) {
					last_move=req_move;				
					enemy_move(req_move);
				}
			}
		}
		req.send();
//	}
}

