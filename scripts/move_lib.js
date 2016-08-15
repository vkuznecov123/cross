/*
** Обработка клика на клетке
*/
function click(e){	
	if(!block) {  //если не ход противника	
		e = e || event;
		var td = e.target || e.srcElement;
		if (td.innerHTML=="") {

			td.innerHTML = your_side;
	
			var x = td.getAttribute('data-x'); // координаты клетки
			var y = td.getAttribute('data-y');
			
			if (last_move=='0:0') ajax_post(x,y); // при начале игры - сразу отправка данных на сервер			
			else ajax_check_post(x,y); // если игра уже шла - перед отправкой проверяет, не было ли сброса игры.			
			
			last_move=x+':'+y; //запоминание хода
			// по краям всегда должны быть минимум 4 свободные клетки
			add_fields(x,y); // добавление необходимых клеток.
			
			reposition(); // перепозиционирование поля и скроллбаров
			
			// отмена выделения клетки последнего хода противника
			var last_td = document.getElementsByClassName('last')[0];
			if (last_td) last_td.classList.remove('last');

			block=true; // блокировка до конца хода соперника
				
			
		}
	} else return false; 
}

/*
** Обработка хода соперника
*/
function enemy_move (move){ // в качестве параметра передается строка с координатами хода с сервера
	var ar,x,y;
	
	ar=move.split(":");
	x=ar[0];
	y=ar[1];
	
	var tbody = document.getElementsByTagName('tbody')[0];
	var td = tbody.children[y-tind].children[x-lind];
	
	td.classList.remove (your_side);	
	td.classList.add (enemy_side); // смена цвета текста клетки. Цвет устанавливается в board.css	
	td.classList.add ('last'); //	смена цвета фона клетки последнего хода противника. Цвет устанавливается в board.css	
	td.innerHTML = enemy_side;
	add_fields (x,y);
	reposition(); 
	block=false; //снятие блокировки
	console.log('x='+x+' y='+y);
}

/*
** Добавление полей после хода
*/

function add_fields (x,y) { // в качестве параметров передаются координаты хода

	var old_rind=rind, old_lind=lind, old_tind=tind, old_bind=bind;
	
	if(x>rind-4) for(var i=0;i<4-(old_rind-x);i++)td_add_r();
	if(x<lind+4) for(var i=0;i<4-(x-old_lind);i++)td_add_l();
	
	if(y>bind-4) for(var i=0;i<4-(old_bind-y);i++)td_add_b();
	if(y<tind+4) for(var i=0;i<4-(y-old_tind);i++)td_add_t();
}
