import config from '../../config';
import Tile from '../../models/terrain/tiles/tile';

export default class WorldMap {
	// WorldMap holds only data of entire map, no rendering data. Using only coordinates of tiles
	constructor() {
		this.tiles = [];
		for(let i=0; i<config.WORLD_WIDTH; i++) {
			this.tiles[i] = [];
			for(let j=0; j<config.WORLD_HEIGHT; j++) {
				this.tiles[i][j] = new Tile({x: i, y: j});
			}
		}
	}

	// Get particular rectangle region, or complete world if cords are not specified
	getMap(startX = 0, startY = 0, endX = config.WORLD_WIDTH-1, endY = config.WORLD_HEIGHT-1) {
		let _tmpResponse = [];
		for(let i=0; i<endX-startX+1; i++) {
			_tmpResponse[i] = [];
			for(let j=0; j<endY-startY+1; j++) {
				_tmpResponse[i][j] = this.tiles[i+startX][j+startY];
			}
		}
		return _tmpResponse;
	}
}