// TODO: Move config somewhere else
const TILES_SIZE = 0.5;
export default class Tile {
	constructor(type, position) {
		let random;

		switch (type) {
			case 'GRASS' : {
				// Temporary
				this.url = `/resources/images/terrain/grass/grass_${(random = Math.floor(Math.random()*18)+1) < 10 ? '0'+random : random}.png`;
			}
		}
		this.image = new Image();
		this.loadImage = this.loadImage.bind(this);
		this.position = position;
	}

	loadImage() {
		return new Promise((resolve, reject) => {
			this.image.onload = () => {
				this.size = {
					x: this.image.width * TILES_SIZE, 
					y: this.image.height * TILES_SIZE
				}
				resolve();
			};
			this.image.src = this.url;
		});
	}
}