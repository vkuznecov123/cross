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
			x=-(-x); y=-(-y); //преобразование x и y в числа	

			if (last_move=='0:0') ajax_post(x,y); // при начале игры - сразу отправка данных на сервер			
			else ajax_check_post(x,y); // если игра уже шла - перед отправкой проверяет, не было ли сброса игры.			
			
			ar_add (x,y,your_side)//запись хода в массив			
			last_move=x+':'+y; //запоминание хода
			// по краям всегда должны быть минимум 4 свободные клетки
			add_fields(x,y); // добавление необходимых клеток.
			
			reposition(); // перепозиционирование поля и скроллбаров
			
			// отмена выделения клетки последнего хода противника
			var last_td = document.getElementsByClassName('last')[0];
			if (last_td) last_td.classList.remove('last');

			check_win (x,y,your_side);	
			
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
	x=-(-x); y=-(-y); //преобразование x и y в числа	
	
	var tbody = document.getElementsByTagName('tbody')[0];
	var td = tbody.children[y-tind].children[x-lind];
	
	td.classList.remove (your_side);	
	td.classList.add (enemy_side); // смена цвета текста клетки. Цвет устанавливается в board.css	
	td.classList.add ('last'); //	смена цвета фона клетки последнего хода противника. Цвет устанавливается в board.css	
	td.innerHTML = enemy_side;
	ar_add (x,y,enemy_side)//запись хода в массив
	add_fields (x,y);
	reposition(); 
	if(!check_win (x,y,enemy_side))  block=false; //снятие блокировки
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

/*
** Добавление хода в массив
*/

function ar_add (x,y,side) {
	if(!M[y]) M[y]=[];
	M[y][x]=side;	
}
/*
** Проверка победы
*/
function check_win (x,y,side) {
	//переменные для подсчета символов (относительно рассматриваемого элемента)
	var vt=0,vb=0,hl=0,hr=0, //сверху и снизу по вертикали, слева и справа по горизонтали
		dlt=0,drb=0,drt=0,dlb=0; //сверху-слева, снизу-справа, сверху-справа и снизу-слева по диагоналям	
	var tempX, tempY; //нужны для изменения х и у в ходе проверок 
	
	console.log(M);	
	// Поиск выигрыша по горизонтали
	tempX=x-1;
	while (M[y][tempX] && M[y][tempX]==side) {hl++; tempX--;}
	tempX=x+1;
	while (M[y][tempX] && M[y][tempX]==side) {hr++; tempX++;}				
	if (hl+hr+1>=5) {
		win(x,y,'H',hl,hr) 
		return true;
	}
	//Поиск выигрыша по вертикали
	tempY=y-1;
	while  (M[tempY] && M[tempY][x] && M[tempY][x]==side) {vt++; tempY--;}
	tempY=y+1;
	while  (M[tempY] && M[tempY][x] && M[tempY][x]==side) {vb++; tempY++;}	
	if (vt+vb+1>=5) {
		win(x,y,'V',vt,vb) 
		return true;
	}

	//Поиск выигрыша по диагонали из левого верхнего угла
	tempX=x-1; 
	tempY=y-1;
	while  (M[tempY] && M[tempY][tempX] && M[tempY][tempX]==side) {dlt++; tempX--; tempY--;}
	tempX=x+1; 
	tempY=y+1;
	while  (M[tempY] && M[tempY][tempX] && M[tempY][tempX]==side) {drb++; tempX++; tempY++;}	
	if (dlt+drb+1>=5) {
		win(x,y,'DLT',dlt,drb) 
		return true;
	}

	//Поиск выигрыша по диагонали из правого верхнего угла
	tempX=x+1; 
	tempY=y-1;
	while  (M[tempY] && M[tempY][tempX] && M[tempY][tempX]==side) {drt++; tempX++; tempY--;}
	tempX=x-1; 
	tempY=y+1;
	while  (M[tempY] && M[tempY][tempX] && M[tempY][tempX]==side) {dlb++; tempX--; tempY++;}	
	if (drt+dlb+1>=5) {
		win(x,y,'DRT',drt,dlb) 
		return true;
	}
			
	return false; //выигрыш не найден	
}
/*
** Перекраска полей при победе
*/
function win (x,y,dir,a,b) { //dir - направление перекраски. a и b - количество элементов с 2-х сторон  
	var tbody = document.getElementsByTagName('tbody')[0];
	var td = tbody.children[y-tind].children[x-lind];
	var i, tempTd ;
	td.classList.add ('win'); // перекраска клеток в цвет класса win. Определяется в board.css
	switch (dir) {
		case 'H': {  // перекраска в случае выигрыша по горизонтали
			tempTd=td;
			for(i=0;i<a;i++) {
				tempTd=tempTd.previousSibling;
				tempTd.classList.add ('win');
			}
			tempTd=td;
			for(i=0;i<b;i++) {
				tempTd=tempTd.nextSibling;
				tempTd.classList.add ('win');
			}				 
		}
		break;
		case 'V': { // перекраска в случае выигрыша по вертикали
			tempTd=td;
			for(i=0;i<a;i++) {
				tempTd=tempTd.parentNode.previousSibling.children[x-lind]; //клетка выше 
				tempTd.classList.add ('win');
			}
			tempTd=td;
			for(i=0;i<b;i++) {
				tempTd=tempTd.parentNode.nextSibling.children[x-lind]; //клетка ниже
				tempTd.classList.add ('win');
			}				 
		}
		break;	
		case 'DLT': { // перекраска в случае выигрыша по диагонали из левого верхнего угла
			tempTd=td;
			for(i=0;i<a;i++) {
				tempTd=tempTd.parentNode.previousSibling.children[x-lind-1-i]; //клетка выше и левее
				tempTd.classList.add ('win');
			}
			tempTd=td;
			for(i=0;i<b;i++) {
				tempTd=tempTd.parentNode.nextSibling.children[x-lind+1+i]; //клетка ниже и правее
				tempTd.classList.add ('win');
			}				 
		}
		break;
		case 'DRT': { // перекраска в случае выигрыша по диагонали из правого верхнего угла
			tempTd=td;
			for(i=0;i<a;i++) {
				tempTd=tempTd.parentNode.previousSibling.children[x-lind+1+i]; //клетка выше и правее
				tempTd.classList.add ('win');
			}
			tempTd=td;
			for(i=0;i<b;i++) {
				tempTd=tempTd.parentNode.nextSibling.children[x-lind-1-i]; //клетка ниже и левее
				tempTd.classList.add ('win');
			}				 
		}
					
	}


	clearInterval(timer); //остановка посылки запросов к серверу
}

