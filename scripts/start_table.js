/*
**Создание нового поля 
*/
var board = document.getElementById('board');
var table = document.createElement('table');
var tr, td, i, j;
for(i=-(num>>1);i<=(num>>1);i++) {
	tr = table.insertRow(-1);	
	for(j=-(num>>1);j<=(num>>1);j++) {
		td = tr.insertCell(-1);	
		td_properties(td,j,i);
	}			
}
board.appendChild(table);

