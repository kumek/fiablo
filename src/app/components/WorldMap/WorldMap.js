import config from '../../config';
import Tile from '../../models/terrain/tiles/Tile';

export default class WorldMap {
	// WorldMap holds only data of entire map, no rendering data. Using only coordinates of tiles
	constructor() {
		let i,j;
		this.tiles = [];
		for(i=0; i<config.WORLD_WIDTH; i++) {
			this.tiles[i] = [];
			for(j=0; j<config.WORLD_HEIGHT; j++) {
				this.tiles[i][j] = new Tile({x: i, y: j});
			}
		}
		console.log("DUPE");
		this.boundaries = {
			x: config.WORLD_WIDTH * config.TILE_WIDTH + config.TILE_WIDTH/2,
			y: config.WORLD_HEIGHT * config.TILE_HEIGHT + config.TILE_HEIGHT/2
		}
	}

	// Get particular rectangle region, or complete world if cords are not specified
	getMap(startX = 0, startY = 0, endX = config.WORLD_WIDTH-1, endY = config.WORLD_HEIGHT-1) {
		let _tmpResponse = [];
		for(let i=0; i<endX-startX+1; i++) {
			_tmpResponse[i] = [];
			for(let j=0; j<endY-startY+1; j++) {
				_tmpResponse[i][j] = this.tiles[i+startX] ? this.tiles[i+startX][j+startY] : undefined;
			}
		}
		return _tmpResponse;
	}

	getBoundaries() {
		return this.boundaries
	}
}