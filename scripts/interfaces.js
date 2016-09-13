/*
** Интерфейс подписчика (объект класса Game), получающего сообщения о ходе противника - по сети или от ИИ.
*/

function Subscriber () {
    if (this.constructor === Subscriber) {
      throw new Error("Can't instantiate abstract class!");
    }
    
};

Subscriber.prototype.enemy_move = function(move) {
    throw new Error("Abstract method!");
}


/*
** Интерфейс издателя, отправляющего ходы игроку (должен быть реализован в объекте, общающемся с сервером, или в ИИ)
*/

function Publisher () {
    if (this.constructor === Publisher) {
      throw new Error("Can't instantiate abstract class!");
    }
    this._subs=[]; // массив подписчиков, получающих ходы от движка
	this._borders; // объект с границами поля для контроля невозможных ходов движка
	this._moves_array=[]; //массив сделанных ходов для контроля невозможных ходов движка
	
};

Publisher.prototype.enemy_move = function(move,borders) { // метод, в который передается ход от игрока.
	this._borders = borders; // обновление границ
	if (move!==null) { // null передается, если соперник должен сделать первый ход.
		if(!this._moves_array[move.y]) this._moves_array[move.y]=[]; //добавляем ход в массив сделанных ходов
		this._moves_array[move.y][move.x]=true;	
	}
	this.main_method(move,borders); // передача хода и границ поля в главный метод.
}

Publisher.prototype.main_method = function(move,borders) { // главный метод, в котором осуществляется вся логика
    throw new Error("Abstract method 'main_method'! You should realize it!");
}

Publisher.prototype.subscribe = function(sub) {
    if(sub instanceof Subscriber) this._subs.push(sub); // добавление подписчика
		else throw new Error("Subscribing object doesn't implement 'Subscriber' interface!");
}

Publisher.prototype.make_move = function(move) { // метод, вызываемый из main_method, и осуществляющий проверку хода и его рассылку подписчикам 
    
	if ( !(Number.isInteger(move.x) && Number.isInteger(move.y)) ) { // проверка корректноси передаваемых данных в объекте move
		throw new Error("Wrong data format in the 'move' object!");
	}
	 
	if (this._moves_array[move.y] && this._moves_array[move.y][move.x]) { // проверка того, что клетка для хода свободна
		throw new Error("You are trying to make a move in an occupiead cell!");
	}
	
	// проверка попадания хода в границы поля
	if ( !((move.x >= this._borders.l) && (move.x <= this._borders.r) && (move.y >= this._borders.t) && (move.y <= this._borders.b)) ) { 
		throw new Error("You are trying to make a move outside current board borders!");
	}
	
	if(!this._moves_array[move.y]) this._moves_array[move.y]=[]; //добавляем ход в массив сделанных ходов
	this._moves_array[move.y][move.x]=true;	
	
	if (this._borders.l > (move.x-4)) this._borders.l = move.x-4; // обновление границ поля в случае необходимости
	if (this._borders.r < (move.x+4)) this._borders.r = move.x+4;
	if (this._borders.t > (move.y-4)) this._borders.t = move.y-4;
	if (this._borders.b < (move.y+4)) this._borders.b = move.y+4;

	for(var i=0;i<this._subs.length;i++) this._subs[i].enemy_move(move,this._borders); // отправка хода подписчикам
}
