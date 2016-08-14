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
	if (block) { //посылает запросы только во время хода противника	
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
	}
}

/*
**Запрос к серверу при загрузке страницы. 
**Если координаты последнего хода (0,0) - считает, что соперник начал игру крестиками. Начинает игру ноликами.
**Если координаты не (0,0) - считает, что координаты остались с прошлой игры, и начинает новую игру крестиками с клетки (0,0).  
*/
function ajax_start() {
	var req=getXMLHttpRequest();
	var req_move;	
	req.open("HEAD","/php_scripts/read.php",true);
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200 && req.getResponseHeader("MOVE")!='') {
			req_move=req.getResponseHeader("MOVE");
			if(req_move=='0:0') {
				your_side = 'O'; // смена стороны на нолики
				enemy_side = 'X';
				var ar_td = document.getElementsByTagName('td');
				for(var i=0;i<ar_td.length;i++) { // смена цвета текста клеток на нолики. Цвет устанавливается в board.css				
					ar_td[i].classList.remove (enemy_side);	
					ar_td[i].classList.add (your_side); 
				}
				enemy_move('0:0'); //первый ход соперника
				setInterval(ajax_head,1000); // проверка изменений на сервере каждые 1000 мс. 
			}
			else {
				var td = table.firstChild.children[num>>1].children[num>>1]; //ищем клетку(0,0) и ставим туда крестик
				td.innerHTML = your_side;
				ajax_post(0,0); // отправка данных на сервер
				block=true; // блокировка до конца хода соперника
				setInterval(ajax_head,1000); // проверка изменений на сервере каждые 1000 мс. 
			}
		}
	}
	req.send();


}

