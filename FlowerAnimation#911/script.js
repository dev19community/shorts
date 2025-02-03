class KaleidoscopeElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });

		// Initialize properties
		this.x = 0;
		this.y = 0;
		this.auto_x = 0;
		this.auto_y = 0;
		this.auto = true;
		this.idle = false;
	}

	static get observedAttributes() {
		return ["tiles", "src", "mode", "reverse", "speed", "opacity"];
	}

	connectedCallback() {
		this.setupStyles();
		this.tiles = Math.max(3, Math.min(16, this.getAttribute("tiles") || 7));
		this.reverse = this.getAttribute("reverse") === "true" ? -1 : 1;
		this.speed = Math.max(0, Math.min(10, this.getAttribute("speed") || 3));
		this.opacity = Math.max(0, Math.min(1, this.getAttribute("opacity") || 3));

		this.init();
	}

	setupStyles() {
		const style = document.createElement("style");
		style.textContent = `
      :host {
        display: block;
        position: relative;
        width: 100dvw;
        height: 100dvh;
      }
      :host([rotating=true]) {
        animation: rotate 10s linear infinite;
        transform-origin: center;
      }
      .tile {
        display: none;
        position: absolute;
        top: 50dvh;
        left: 0;
        z-index: 0;
        overflow: hidden;
        height: max(100dvh, 100dvw);
        width: max(50dvh, 50dvw);
        transform-origin: right top;
      }
      .image {
        position: relative;
        top: 0;
        left: 100%;
        height: 100%;
        width: 100%;
        background-color: rgb(255 255 255 / 5%);
        background-image: unset;
        transform-origin: left top;
        transition: background-position 100ms ease-in-out;
      }
      .tile {
        display: block;
      }
      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }
    `;
		this.shadowRoot.appendChild(style);
	}

	init() {
		this.generateTiles();
		this.setupImage();
		//	this.setupMouseMove();
		this.animate();
	}

	generateTiles() {
		let tiles = "";
		if (this.tiles) {
			const degreeIncrement = 360 / this.tiles;
			for (let i = 0; i <= this.tiles * 2; i++) {
				const baseRotation =
					i % 2 === 0
						? (i / 2) * degreeIncrement
						: Math.floor(i / 2) * degreeIncrement;
				const scale = i % 2 === 0 ? 1 : -1;
				const imageRotation = degreeIncrement / 2;
				tiles += `<div class="tile t${i}" style="transform:rotate(${baseRotation}deg)
				 scale(${scale}, 1)"><div class="image" 
				 style="transform:rotate(${imageRotation}deg)"></div></div>`;
			}
		}
		this.classList.add("n" + this.tiles);
		this.shadowRoot.innerHTML += tiles;
		this.image = this.shadowRoot.querySelectorAll(".image");
	}

	setupImage() {
		const src = this.getAttribute("src");
		if (src) {
			this.image.forEach((img) => {
				img.style.backgroundImage = `url(${decodeURIComponent(src)})`;
			});
		}

		if (this.opacity) {
			this.style.opacity = 0;
			setTimeout(() => {
				this.style.transition = "opacity 3s";
				this.style.opacity = this.opacity;
			}, 0);
		}
	}

	debounce(fn, delay) {
		var timer = null;
		return function () {
			var context = this,
				args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	}

	setupMouseMove() {
		this.addEventListener(
			"mousemove",
			this.debounce((e) => {
				clearTimeout(this.idle);
				this.idle = setTimeout(() => {
					console.log("unpause");
					this.auto = true;
					this.animate();
				}, 1000);
				this.auto = false;
				this.x++;
				this.y++;
				let nx = e.pageX,
					ny = e.pageY;
				nx = -e.pageY < -this.y ? e.pageX : e.pageY;
				ny = this.y;
				this.move(nx, ny);
			}, 25)
		);
	}

	move(x, y) {
		this.image.forEach((img) => {
			img.style.backgroundPosition = `${x}px ${y}px`;
		});
	}

	animate() {
		if (!this.auto || this.speed <= 0) {
			return;
		}
		const time = new Date().getTime() * 0.0001 * this.speed; // Scale time by speed
		this.auto_x = Math.sin(time) * document.body.clientWidth * this.reverse;
		this.auto_y++;
		this.move(this.auto_x, this.auto_y);
		requestAnimationFrame(() => this.animate());
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			switch (name) {
				case "tiles":
					this.tiles = Math.max(1, Math.min(10, newValue || 7));
					break;
				case "reverse":
					this.reverse = newValue === "true" ? -1 : 1;
					break;
				case "speed":
					this.speed = Math.max(0, Math.min(10, newValue || 3));
					break;
				case "opacity":
					this.opacity = Math.max(0, Math.min(1, newValue));
					break;
				case "src":
					// Only reinit if src changes
					this.init();
					return;
			}
			this.init();
		}
	}
}

// Register the custom element
customElements.define("kaleidoscope-element", KaleidoscopeElement);