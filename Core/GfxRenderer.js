define([], function () {
	
	/**
		Konstruktor - tworzy obiekt klasy GfxRenderer. Program moze zawierac kilka obiektów tej klasy, jesli uzywa kilku canvasów.
		@constructor
		@param {canvas.context} ctx - Pole context obsługiwanego obiektu canvas
		@param {double} w - Szerokosc obiektu canvas
		@param {double} h - Wysokosc obiektu canvas
	*/
	var GfxRenderer = function (ctx, w, h, font, fontSize) {
		this._ctx = ctx;
		this._w = w;
		this._h = h;
		this._font = font;
        this._fontSize = fontSize;
	};

	GfxRenderer.prototype = {
		
		/**
			Funkcja zwracająca szerokość obiektu canvas.
			@returns {double}
		*/
		getW: function () {
			return this._w;
		},
		
		/**
			Funkcja zwracająca wysokość obiektu canvas.
			@returns {double}
		*/
		getH: function () {
			return this._h;
		},
		
		/**
			Funkcja rysująca na nowo ekran po zmienieniu rozmiarów okna.
		*/
		repaint: function () {
			this._ctx.save();
			this._ctx.translate(0, 0);
			this._ctx.restore();
		},
		
		/**
			Funkcja aktualizuje obiekt o nową szerokosc i wysokosc, a nastepnie czysci ekran.
			@param {double} w - Szerokosc ekranu
			@param {double} h - Wysokosc ekranu
		*/
		update: function (w, h) {
			this.clear();
			this._w = w || this._w;
			this._h = h || this._h;
			this.repaint();
		},
		
		/**
			Funkcja czyszcząca ekran - odmalowuje całe płótno na biały kolor
            @param {String} color Kolor do czyszczenia ekranu, domyślnie biały.
		*/
		clear: function (color) {
            if(color === undefined || color === null){
                color = "white";
            }
			this._ctx.fillStyle = color;
			this._ctx.fillRect(0, 0, this._w, this._h);
		},
		
		/**
			Funkcja rysująca przycisk.
			@param {double} fontSize - Rozmiar czcionki
			@param {Button} button - Obiekt klasy Button, logiczna interpretacja
		*/
		renderButton: function (fontSize, button) {
			this._ctx.fillStyle = "grey";
			this._ctx.beginPath();
			this._ctx.rect(button.getX(), button.getY(), button.getWidth(), button.getHeight());
			this._ctx.fill();
			this._ctx.strokeStyle = "darkgrey";
			this._ctx.stroke();
			this._ctx.fillStyle = "black";
			this._ctx.font = (fontSize * this._h) + this._font;
			var x = (button.getWidth() - this._ctx.measureText(button.getText()).width) / 2;
			var y = (button.getHeight() - fontSize * this._h);
			this._ctx.fillText(button.getText(), button.getX() + x, button.getY() + y);
		},
		
		/**
		 * Funkcja renderująca na ekranie wskazaną etykietę
		 * @param {double} fontSize - rozmiar czcionki do wyświetlenia
		 * @param {label} label - etykieta do wyświetlenia
		 */
		renderLabel: function (fontSize, label) {
			this._ctx.fillStyle = label.getColor();
			var fS = label.getFontSize() || fontSize;
			this._ctx.font = (fS * this._h) + this._font;
			var x = (label.getWidth() - this._ctx.measureText(label.getText()).width) / 2;
			//var y = (label.getHeight() - fontSize * this._h);
			this._ctx.fillText(label.getText(), label.getX() + x, label.getY());
		},
		
		/**
		 * Funkcja wyświetlająca na ekranie pionowy gradient.
		 * @param {splash} splash - gradient do wyświetlenia
		 */
		renderSplash: function (splash) {
			var gradient = this._ctx.createLinearGradient(0, 0, 0, this._h);
			gradient.addColorStop(0, splash.getSecondColor());
			gradient.addColorStop(2 / 5, splash.getColor());
			gradient.addColorStop(3 / 5, splash.getColor());
			gradient.addColorStop(1, splash.getSecondColor());
			this._ctx.fillStyle = gradient;
			this._ctx.fillRect(0, 0, this._w, this._h);
		},
        
        /**
         * Funkcja wyświetlająca na ekranie wskazany sprite
         * @param {sprite} sprite - sprite do wyświetlenia
         */
        renderSprite: function(sprite){
            this._ctx.drawImage(sprite.getAsset(), sprite.getX(), sprite.getY());
        },
        
        /**
         * Funkcja wyświetla animację zanikania w danym kolorze.
         * @param {object} position Obiekt zawierający informację o polu jakie ma zostać objęte animacją (x,y,w,h).
         * @param {object} color Obiekt zawierający informację o składowych koloru (r,g,b).
         * @param {int} time Czas w ms, w jakim ma zostać wykonana animacja, domyślnie 3000.
         */ 
        fadeOut: function(position, color, time){
		
		time = time || 3000;

		var that = this;
        	var alpha = 0.0;
        	var rgb = "rgba(" + color.r + ", " + color.g + ", " + color.b + ",";
        	var timeDiff = 16.6; //Aby wartość fps wynosiła 60
        	var alphaDiff = 1 / (time / 16.6); // 1 / liczba klatek
        	
        	var displayFrame = function(){
        		
        		that._ctx.fillStyle = rgb + alpha + ")";
        		that._ctx.fillRect(position.x, position.y, position.w, position.h);

        		if(alpha === 1){
        			return;
        		}
        		
        		alpha += alphaDiff;
        		
        		if(alpha > 1){
        			alpha = 1;
        		}
        		
        		
        		setTimeout(displayFrame, timeDiff);
        	};
        	
        	setTimeout(displayFrame,timeDiff);

        },
        
        /**
         * Funkcja wyświetla animację pojawiania w danym kolorze.
         * @param {object} position Obiekt zawierający informację o polu jakie ma zostać objęte animacją (x,y,w,h). Jeżeli ma być to cały ekran, można użyć stringa "all".
         * @param {object} color Obiekt zawierający informację o składowych koloru (r,g,b).
         * @param {int} time Czas w ms, w jakim ma zostać wykonana animacja, domyślnie 3000.
         */ 
        fadeIn : function(position, color, time){
        	
        	time = time || 3000;
        	
        	if(typeof(position) === "string" && position === "all"){
        		position.x = 0;
        		position.y = 0;
        		position.w = this._w;
        		position.h = this._h;
        	}

		var that = this;
        	var alpha = 0.0;
        	var rgb = "rgba(" + color.r + ", " + color.g + ", " + color.b + ",";
        	var timeDiff = 16.6; //Aby wartość fps wynosiła 60
        	var alphaDiff = 1 / (time / 16.6); // 1 / liczba klatek
        	
        	var displayFrame = function(){
        		
        		that._ctx.fillStyle = rgb + alpha + ")";
        		that._ctx.fillRect(position.x, position.y, position.w, position.h);
        		
        		if(alpha === 0){
        			return;
        		}
        		
        		alpha -= alphaDiff;
        		
        		if(alpha < 0){
        			alpha = 0;
        		}
        		
        		setTimeout(displayFrame, timeDiff);
        	};
        	
        	setTimeout(displayFrame, timeDiff);
        	
        },
        
        renderGroup : function(group){
            var l = group.length();
            var el = null;
            for(var i = 0; i < l; i++){
                el = group.getElement(i);
                if(el.getType() === "sprite"){
                    this.renderSprite(el);
                }
                else if(el.getType() === "splash"){
                    this.renderSplash(el);
                }
                else if(el.getType() === "label"){
                    this.renderLabel(this._fontSize, el);
                }
                else if(el.getType() === "button"){
                    this.renderButton(this._fontSize, el);
                }
                else if(el.getType() === "group"){
                    this.renderGroup(el);
                }
            }
        }
        
	};

	return GfxRenderer;

});
