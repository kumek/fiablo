export default class TileImage {
	constructor(url) {
		this.image = new Image();
		this.url = url;
	}

	load() {
		return new Promise((resolve, reject) => {
			console.log(`Loading ${this.url}`);
			this.image.onload = resolve;
			this.image.src = this.url;
		});
	}
}