function reposition() {  //Перерасчет позиции поля
	var left = -lind*(w+bord*2)+((w+bord*2)>>1); // расстояние от левой границы до центра поля
	var top = -tind*(w+bord*2)+((w+bord*2)>>1); // расстояние от верхней границы до центра поля
	var right = rind*(w+bord*2)+((w+bord*2)>>1);    
	var bottom = bind*(w+bord*2)+((w+bord*2)>>1); 
	if ((window.innerWidth>>1)>left) table.style.left=(innerWidth>>1)+'px';
		else table.style.left=left+'px';

	if ((window.innerHeight>>1)>top) table.style.top=(innerHeight>>1)+'px';
		else table.style.top=top+'px';
	
	table.style.marginLeft = -left+'px';
	table.style.marginTop = -top+'px';
	
	var pad_w = (window.innerWidth>>1)-right; //отступы нужны для появления прокрутки после достижения полем левого и верхнего края
	var pad_h = (window.innerHeight>>1)-bottom;
		if (pad_w<0) pad_w=0;
		table.style.paddingRight = pad_w+'px';
	
		if (pad_h<0) pad_h=0;	
		table.style.paddingBottom = pad_h+'px';
	
	firefox_bug_fix();  //установка скроллбара в начальные координаты при первом появлении

	if(scroll_w!=0) {		//смещение прокрутки после добавления столбца
		scrollBy((w+bord*2)*scroll_w,0);
		scroll_w=0;
		
	}
	
	if(scroll_h!=0) {
		scrollBy(0,(w+bord*2)*scroll_h);
		scroll_h=0;
	}
}

/*function resize() {	//Перерасчет кол-ва клеток и размера поля
	wn = rind-lind+1;
	hn = bind-tind+1;
	bw=(w+bord*2)*wn;
	bh=(w+bord*2)*hn;
}*/

function td_add_r() { //добавляет столбец справа
		
	var tr = document.getElementsByTagName('tr');
	for(var i=0;i<tr.length;i++) {
		var td=tr[i].insertCell(-1); // добавляет клетку в конец ряда
		td_properties(td,rind+1,tind+i);
	}
	rind++; wn++;
	bw=(w+bord*2)*wn;
	

}
function td_add_l() { //добавляет столбец слева
	var tr = document.getElementsByTagName('tr');
	
	for(var i=0;i<tr.length;i++) {
		var td=tr[i].insertCell(0); // добавляет клетку в начало ряда
		td_properties(td,lind-1,tind+i);
	}
	lind--; wn++;
	bw=(w+bord*2)*wn;
	if((num_w>>1)<(-lind)) scroll_w++;
}

function td_add_b() { //добавляет ряд снизу
	var tbl = document.getElementsByTagName('table');
	var tr = tbl[0].insertRow(-1);
	for(var i=0;i<(wn);i++) {
		var td=tr.insertCell(-1);
		td_properties(td,lind+i,bind+1);
	}
	bind++; hn++;
	bh=(w+bord*2)*hn;
}

function td_add_t() { //добавляет ряд сверху
	var tbl = document.getElementsByTagName('table');
	var tr = tbl[0].insertRow(0);
	for(var i=0;i<(wn);i++) {
		var td=tr.insertCell(-1);
		td_properties(td,lind+i,tind-1);
	}
	tind--; hn++;
	bh=(w+bord*2)*hn;
	if((num_h>>1)<(-tind)) scroll_h++;

}


function td_properties (td,x,y) {
	td.addEventListener('click',click);
	td.classList.add (your_side);

	td.style.minWidth=w+'px';
	td.style.height=w+'px';
	td.style.maxWidth=w+'px';
	td.style.maxHeight=w+'px';
	td.style.borderWidth=bord+'px';

	td.setAttribute("data-x",x);
	td.setAttribute("data-y",y);

}


function firefox_bug_fix() { //установка скроллбара в начальные координаты при первом появлении
	
	if(document.body.clientWidth<window.innerWidth) ffb_scroll=true; //scrollbar есть
		else { ffb_scroll=false; ffb=true;} //scrollbar-а нет
	
   	if (ffb_scroll && ffb) {
    		scrollTo(0,0);
		ffb=false;
	}
}

function frame_resize() {  //Подгон размера iframe под целое нечетное число клеток
//	console.log(this);
//	console.log(fr);

	var fr_w = fr.clientWidth;
	var fr_h = fr.clientHeight;
		
	num_w=Math.floor(fr_w/(w+bord*2));
	if(num_w%2==0) num_w--; // нечетное количество клеток, помещающееся по ширине
	
	num_h=Math.floor(fr_h/(w+bord*2));
	if(num_h%2==0) num_h--; // нечетное количество клеток, помещающееся по высоте
		
	fr.style.width=num_w*(w+bord*2)+'px';
	fr.style.height=num_h*(w+bord*2)+'px';
				
	fr.style.minWidth=num*(w+bord*2)+'px';
	fr.style.minHeight=num*(w+bord*2)+'px';

}
