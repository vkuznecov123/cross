/*
******************************************************
*****  Класс Board - игровое поле
******************************************************
*/
function Board (num,click,your_side) {
	if (num) this.num = num; else this.num=9; //начальный размер поля. Должен быть нечетным и не меньше 9.
	this.click = click; //ссылка на метод обработки клика по клетке
	this.your_side = your_side; //за какую сторону выступает игрок	
	if(your_side==='X') this.enemy_side = 'O'; else this.enemy_side = 'X'; //за какую сторону выступает соперник	

	this.w; //размер ячейки в пикселях. Устанавливается в "board.css".
	this.bord; //размер бордюра клетки. Устанавливается в "board.css".

	//При изменении вышеуказанных параметров - не забыть поменять минимальные
	//размеры контейнера в CSS
			
	this.wn=this.num,this.hn=this.num;//количество клеток по ширине и высоте
			
	this.bw; // ширина таблицы.
	this.bh; // высота таблицы.
	
	this.num_w; //количество мест под клетки по ширине 
	this.num_h; //количество мест под клетки по высоте
			
	//клетки и их координаты считаются слева направо и СВЕРХУ ВНИЗ.	
	this.rind = this.num>>1; //текущий индекс крайнего правого столбца
	this.lind = -this.rind; //текущий индекс крайнего левого столбца
	this.bind = this.num>>1; //текущий индекс нижнего ряда
	this.tind = -this.bind; //текущий индекс верхнего ряда

	this.scroll_w=0; //на сколько клеток нужно прокрутить страницу вправо
	this.scroll_h=0; //на сколько клеток нужно прокрутить страницу вниз
			
	this.ffb=true; //нужны для исправления бага firefox со сдвигом скроллбара
	this.ffb_scroll=false;
	
	this.fr=window.top.document.getElementById('frame'); //сам фрейм, содержащий окно с полем
	this.table; //таблица
}

/*
**Создание нового поля 
*/
Board.prototype.create = function() {
	var board = document.getElementById('board');
	this.table = document.createElement('table'); // инициализируем свойство table
	var tr, td, i, j;
	for(i=-(this.num>>1);i<=(this.num>>1);i++) {
		tr = this.table.insertRow(-1);	
		for(j=-(this.num>>1);j<=(this.num>>1);j++) {
			td = tr.insertCell(-1);	
			this.td_properties(td,j,i);
		}			
	}
	board.appendChild(this.table);

	this.w=td.clientWidth; // добавляем объекту свойство w - размер клетки
	this.bord=parseInt(getComputedStyle(td).borderLeftWidth); // добавляем объекту свойство bord - ширина рамки клетки
	this.bw=(this.w+this.bord)*this.num; // добавляем объекту свойство bw - ширина таблицы.
	this.bh=(this.w+this.bord)*this.num; //  добавляем объекту свойство bh - высота таблицы.

	this.frame_resize();//Подгон размера iframe под целое нечетное число клеток
					
	this.reposition(); //перерасчет позиции поля
		
}

/*
** Добавление свойств клеткам
*/
Board.prototype.td_properties = function(td,x,y) {
	td.addEventListener('click',this.click); // метод click привязан к контексту объекта класса Board
	td.classList.add (this.your_side);

	td.style.minWidth=this.w+'px';
	td.style.height=this.w+'px';
	td.style.maxWidth=this.w+'px';
	td.style.maxHeight=this.w+'px';
	td.style.borderWidth=this.bord+'px';

	td.setAttribute("data-x",x);
	td.setAttribute("data-y",y);

}

/*
** Подгон размера iframe под целое нечетное число клеток
*/
Board.prototype.frame_resize = function() {  

	var fr_w = this.fr.clientWidth;
	var fr_h = this.fr.clientHeight;
		
	this.num_w=Math.floor(fr_w/(this.w+this.bord*2));
	if(this.num_w%2==0) this.num_w--; // нечетное количество клеток, помещающееся по ширине
	
	this.num_h=Math.floor(fr_h/(this.w+this.bord*2));
	if(this.num_h%2==0) this.num_h--; // нечетное количество клеток, помещающееся по высоте
		
	this.fr.style.width=this.num_w*(this.w+this.bord*2)+'px';
	this.fr.style.height=this.num_h*(this.w+this.bord*2)+'px';
				
	this.fr.style.minWidth=this.num*(this.w+this.bord*2)+'px';
	this.fr.style.minHeight=this.num*(this.w+this.bord*2)+'px';

}

/*
**Перерасчет позиции поля
*/
Board.prototype.reposition = function() {  
	var left = -this.lind*(this.w+this.bord*2)+((this.w+this.bord*2)>>1); // расстояние от левой границы до центра поля
	var top = -this.tind*(this.w+this.bord*2)+((this.w+this.bord*2)>>1); // расстояние от верхней границы до центра поля
	var right = this.rind*(this.w+this.bord*2)+((this.w+this.bord*2)>>1);    
	var bottom = this.bind*(this.w+this.bord*2)+((this.w+this.bord*2)>>1); 
	if ((window.innerWidth>>1)>left) this.table.style.left=(innerWidth>>1)+'px';
		else this.table.style.left=left+'px';

	if ((window.innerHeight>>1)>top) this.table.style.top=(innerHeight>>1)+'px';
		else this.table.style.top=top+'px';
	
	this.table.style.marginLeft = -left+'px';
	this.table.style.marginTop = -top+'px';
	
	var pad_w = (window.innerWidth>>1)-right; //отступы нужны для появления прокрутки после достижения полем левого и верхнего края
	var pad_h = (window.innerHeight>>1)-bottom;
		if (pad_w<0) pad_w=0;
		this.table.style.paddingRight = pad_w+'px';
	
		if (pad_h<0) pad_h=0;	
		this.table.style.paddingBottom = pad_h+'px';
	
	//установка скроллбара в начальные координаты при первом появлении

	if(document.body.clientWidth<window.innerWidth) this.ffb_scroll=true; //scrollbar есть
		else { this.ffb_scroll=false; this.ffb=true;} //scrollbar-а нет
	
   	if (this.ffb_scroll && this.ffb) {
    		scrollTo(0,0);
		this.ffb=false;
	}  
	//смещение прокрутки после добавления столбца
	if(this.scroll_w!=0) {
		scrollBy((this.w+this.bord*2)*this.scroll_w,0);
		this.scroll_w=0;
		
	}
	
	if(this.scroll_h!=0) {
		scrollBy(0,(this.w+this.bord*2)*this.scroll_h);
		this.scroll_h=0;
	}
}

/*
** добавляет столбец справа
*/
Board.prototype.td_add_r = function() { 
	
	var tr = this.table.firstChild.children;
	for(var i=0;i<tr.length;i++) {
		var td=tr[i].insertCell(-1); // добавляет клетку в конец ряда
		this.td_properties(td,this.rind+1,this.tind+i);
	}
	this.rind++; this.wn++;
	this.bw=(this.w+this.bord*2)*this.wn;
	

}
/*
** добавляет столбец слева
*/
Board.prototype.td_add_l = function() { 
	
	var tr = this.table.firstChild.children;
	for(var i=0;i<tr.length;i++) {
		var td=tr[i].insertCell(0); // добавляет клетку в начало ряда
		this.td_properties(td,this.lind-1,this.tind+i);
	}
	this.lind--; this.wn++;
	this.bw=(this.w+this.bord*2)*this.wn;
	if((this.num_w>>1)<(-this.lind)) this.scroll_w++;
}
/*
** добавляет ряд снизу
*/
Board.prototype.td_add_b = function() { 
	
	var tr = this.table.insertRow(-1);
	for(var i=0;i<(this.wn);i++) {
		var td=tr.insertCell(-1);
		this.td_properties(td,this.lind+i,this.bind+1);
	}
	this.bind++; this.hn++;
	this.bh=(this.w+this.bord*2)*this.hn;
}
/*
** добавляет ряд сверху
*/
Board.prototype.td_add_t = function() {
	
	var tr = this.table.insertRow(0);
	for(var i=0;i<(this.wn);i++) {
		var td=tr.insertCell(-1);
		this.td_properties(td,this.lind+i,this.tind-1);
	}
	this.tind--; this.hn++;
	this.bh=(this.w+this.bord*2)*this.hn;
	if((this.num_h>>1)<(-this.tind)) this.scroll_h++;
}
/*
** Добавление полей после хода
*/

Board.prototype.add_fields = function (x,y) { // в качестве параметров передаются координаты хода

	var old_rind=this.rind, old_lind=this.lind, old_tind=this.tind, old_bind=this.bind;
	
	if(x>this.rind-4) for(var i=0;i<4-(old_rind-x);i++) this.td_add_r();
	if(x<this.lind+4) for(var i=0;i<4-(x-old_lind);i++) this.td_add_l();
	
	if(y>this.bind-4) for(var i=0;i<4-(old_bind-y);i++) this.td_add_b();
	if(y<this.tind+4) for(var i=0;i<4-(y-old_tind);i++) this.td_add_t();
}

/*
** Отображение хода соперника
*/
Board.prototype.enemy_move = function(x,y){ // в качестве параметра передается строка с координатами хода с сервера
	
	var td = this.table.firstChild.children[y-this.tind].children[x-this.lind];
	
	td.classList.remove (this.your_side);	
	td.classList.add (this.enemy_side); // смена цвета текста клетки. Цвет устанавливается в board.css	
	td.classList.add ('last'); //	смена цвета фона клетки последнего хода противника. Цвет устанавливается в board.css	
	td.innerHTML = this.enemy_side;
	
	this.add_fields (x,y);
	this.reposition(); 
}

/*
** Перекраска полей при победе
*/
Board.prototype.win = function (x,y,dir,a,b) { //dir - направление перекраски. a и b - количество элементов с 2-х сторон  
	
	var td = this.table.firstChild.children[y-this.tind].children[x-this.lind];
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
				tempTd=tempTd.parentNode.previousSibling.children[x-this.lind]; //клетка выше 
				tempTd.classList.add ('win');
			}
			tempTd=td;
			for(i=0;i<b;i++) {
				tempTd=tempTd.parentNode.nextSibling.children[x-this.lind]; //клетка ниже
				tempTd.classList.add ('win');
			}				 
		}
		break;	
		case 'DLT': { // перекраска в случае выигрыша по диагонали из левого верхнего угла
			tempTd=td;
			for(i=0;i<a;i++) {
				tempTd=tempTd.parentNode.previousSibling.children[x-this.lind-1-i]; //клетка выше и левее
				tempTd.classList.add ('win');
			}
			tempTd=td;
			for(i=0;i<b;i++) {
				tempTd=tempTd.parentNode.nextSibling.children[x-this.lind+1+i]; //клетка ниже и правее
				tempTd.classList.add ('win');
			}				 
		}
		break;
		case 'DRT': { // перекраска в случае выигрыша по диагонали из правого верхнего угла
			tempTd=td;
			for(i=0;i<a;i++) {
				tempTd=tempTd.parentNode.previousSibling.children[x-this.lind+1+i]; //клетка выше и правее
				tempTd.classList.add ('win');
			}
			tempTd=td;
			for(i=0;i<b;i++) {
				tempTd=tempTd.parentNode.nextSibling.children[x-this.lind-1-i]; //клетка ниже и левее
				tempTd.classList.add ('win');
			}				 
		}
					
	}


	//clearInterval(timer); //остановка посылки запросов к серверу
}
