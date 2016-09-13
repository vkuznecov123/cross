/*
******************************************************
*****  Класс Game - одна игра
******************************************************
*/
var Game = Subscriber.extend (

	function Game(enemy,side,size) {
		this.last_move = {}; //объект, содержащий координаты последнего хода
		// по умолчанию игрок играет крестиками		
		if (side=='O') {
			this.your_side = 'O'; // за какую сторону играет пользователь
			this.enemy_side = 'X'; // за какую сторону играет оппонент
		}
		else {
			this.your_side = 'X'; // за какую сторону играет пользователь
			this.enemy_side = 'O'; // за какую сторону играет оппонент
		}
		this.win = false; // флаг победы		
		this.block = false; // блокировка на время хода противника, включение обработки ответов сервера	
		this.start = false; // если true - игра начата
		this.M=[]; //двумерный разреженный массив, содержащий информацию о позиции. Нолики - 'O', крестики - 'X'.
						  //Индексы массива могут быть отрицательными и соответствуют координатом клеток. Пустые клетки
						  //не определены в массиве.	 
	
		this.board = new Board(size,this.click.bind(this),this.your_side); // создание вложенного объекта класса Board. Метод click передается привязанным к текущему объекту.
		this.board.create();
	
		if (enemy instanceof Publisher) this.enemy=enemy;  // проверяет, реалезован ли интерфейс Publisher в объекте enemy
			else throw new Error("'Publisher' interface is not implemented in given enemy object");	

		this.enemy.subscribe(this);
		
		if (side=='O') { 	// если играем ноликами - передаем ход сопернику
			this.enemy.enemy_move( // отправка сопернику хода и размеров поля;
				null, // отправляя вместо хода null - передаем очередь хода сопернику
				{
					l:this.board.lind,
					r:this.board.rind,
					t:this.board.tind,
					b:this.board.bind
				}
			);
		
		}	
	},

	{
		/*
		** Обработка клика на клетке
		*/
		click : function(e){	
			if(!this.block) {  //если не ход противника	
				e = e || event;
				var td = e.target || e.srcElement;
				if (td.innerHTML=="") {
		
					td.innerHTML = this.your_side;
	
					var x = td.getAttribute('data-x'); // координаты клетки
					var y = td.getAttribute('data-y');
					x=-(-x); y=-(-y); //преобразование x и y в числа	

					this.ar_add (x,y,this.your_side)//запись хода в массив			
					this.last_move.x=x; //запоминание хода
					this.last_move.y=y; 
					// по краям всегда должны быть минимум 4 свободные клетки
					this.board.add_fields(x,y); // добавление необходимых клеток.
			
					this.board.reposition(); // перепозиционирование поля и скроллбаров
			
					// отмена выделения клетки последнего хода противника
					var last_td = document.getElementsByClassName('last')[0];
					if (last_td) last_td.classList.remove('last');
					
					if (this.check_win (x,y,this.your_side)) this.win=true;	//проверка выигрыша 		
					
					this.block = true;	// установка блокировки				
										
					this.enemy.enemy_move( // отправка сопернику хода и размеров поля;
						{
							x:x, // если передается null - значит компьютер ходит первым
						 	y:y
						},
						{
							l:this.board.lind,
							r:this.board.rind,
							t:this.board.tind,
							b:this.board.bind
						}
					);
									
				}
			} else return false; 
		},

		/*
		** Обработка хода соперника
		*/
		enemy_move : function(move){ // в качестве параметра передается строка с координатами хода с сервера
			if (!this.win) { //если победы еще не было			
				if(typeof move.x != 'number' || typeof move.y != 'number') throw new Error('Enemy move coordinates are not Numbers!');				
			
				var x = move.x,
					y = move.y;
	
				this.board.enemy_move(x,y); // вызов метода объекта board, добавляющего на поле ход противника
				this.last_move.x = x; //запоминание хода			
				this.last_move.y = y;			
				this.ar_add (x,y,this.enemy_side)//запись хода в массив
				 
				if(!this.check_win (x,y,this.enemy_side))  this.block=false; //снятие блокировки
			}	
		},

		/*
		** Добавление хода в массив
		*/
		ar_add : function(x,y,side) {
			if(!this.M[y]) this.M[y]=[];
			this.M[y][x]=side;	
		},
		
		/*
		** Проверка победы
		*/
		check_win : function(x,y,side) {
			//переменные для подсчета символов (относительно рассматриваемого элемента)
			var vt=0,vb=0,hl=0,hr=0, //сверху и снизу по вертикали, слева и справа по горизонтали
				dlt=0,drb=0,drt=0,dlb=0; //сверху-слева, снизу-справа, сверху-справа и снизу-слева по диагоналям	
			var tempX, tempY; //нужны для изменения х и у в ходе проверок 
	
			// Поиск выигрыша по горизонтали
			tempX=x-1;
			while (this.M[y][tempX] && this.M[y][tempX]==side) {hl++; tempX--;}
			tempX=x+1;
			while (this.M[y][tempX] && this.M[y][tempX]==side) {hr++; tempX++;}				
			if (hl+hr+1>=5) {
				this.board.win(x,y,'H',hl,hr) 
				return true;
			}
			//Поиск выигрыша по вертикали
			tempY=y-1;
			while  (this.M[tempY] && this.M[tempY][x] && this.M[tempY][x]==side) {vt++; tempY--;}
			tempY=y+1;
			while  (this.M[tempY] && this.M[tempY][x] && this.M[tempY][x]==side) {vb++; tempY++;}	
			if (vt+vb+1>=5) {
				this.board.win(x,y,'V',vt,vb) 
				return true;
			}

			//Поиск выигрыша по диагонали из левого верхнего угла
			tempX=x-1; 
			tempY=y-1;
			while  (this.M[tempY] && this.M[tempY][tempX] && this.M[tempY][tempX]==side) {dlt++; tempX--; tempY--;}
			tempX=x+1; 
			tempY=y+1;
			while  (this.M[tempY] && this.M[tempY][tempX] && this.M[tempY][tempX]==side) {drb++; tempX++; tempY++;}	
			if (dlt+drb+1>=5) {
				this.board.win(x,y,'DLT',dlt,drb) 
				return true;
			}
		
			//Поиск выигрыша по диагонали из правого верхнего угла
			tempX=x+1; 
			tempY=y-1;
			while  (this.M[tempY] && this.M[tempY][tempX] && this.M[tempY][tempX]==side) {drt++; tempX++; tempY--;}
			tempX=x-1; 
			tempY=y+1;
			while  (this.M[tempY] && this.M[tempY][tempX] && this.M[tempY][tempX]==side) {dlb++; tempX--; tempY++;}	
			if (drt+dlb+1>=5) {
				this.board.win(x,y,'DRT',drt,dlb) 
				return true;
			}
			
			return false; //выигрыш не найден	
		}

	}
);

