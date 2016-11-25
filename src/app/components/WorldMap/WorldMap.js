import config from '../../config';

export default class WorldMap {
	// WorldMap holds only data of entire map, no rendering data. Using only coordinates of tiles
	constructor(ctx) {
		// Generate map
		// [0,0], [1,0], [2,0], [3,0] .... [0,1], [2,1], [3,1] ... [config.tiles_count_width, config.tiles_count_height]
		// this.tiles = [];

		// for(let j=0; j<config.tiles_count_height; j++) {
		// 	for(let i=0; i< config.tiles_count_width) {
		// 		this.tiles.push(new Tile({x: i, y:j}))
		// 	}
		// }
		
		// this.imagesLoaded = TileImages.loadImages();
	 //  	for(let j=0; j<config.tiles_count_height; j++) {
	 //    	for(let i=0; i<config.tiles_count_width; i++) {
	 //    		this.tiles.push(new Tile({x: i, y: j}));
	 //    	}
	 //    }

	}

	// get tile(positionX, positionY) {
	// 	return tile[i * positionX % config.tiles_count_width + j * positionY % config.tiles]

	// }

	getMapSection(startX, startY, endX, endY) {
		// Returns tiles, that coordinates are in the rectangular region with boundaries passed as parameters
		// // TODO: Make this on foreach lop
		// return this.tiles.filter(tile => {
		// 	return tile.position.x > startX && tile.position.x < endX && tile.position.y > startY && tile.position.y < endY
		// });
	}
}