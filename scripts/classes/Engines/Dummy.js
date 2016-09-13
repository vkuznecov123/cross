/*
	Временная заглушка вместо движка
*/

var Dummy = Publisher.extend(
	function() {			  // конструктор
		Publisher.call(this); // вызов конструктора родителя
	},
	{
		main_method:function(move) {
			if(move === null) {
				this.make_move({x:0,y:0}); // если движок начинает - он ходит в центр
			} else {
				this.make_move({x:move.x,y:++move.y}); // ход в соседнюю нижнюю клетку
			}
		}
	}
)
