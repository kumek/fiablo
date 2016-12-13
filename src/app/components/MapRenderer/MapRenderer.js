import config from '../../config';

export default class Renderer {
	// Renderer gets world map, viewport size, viewport position, canvas context and calculates all data needed for map to be drawn
	constructor(ctx, worldMap, viewport) {
		console.log('Trying to construct MapRenderer');
		this.ctx = ctx;
		this.worldMap = worldMap;
		this.viewport = viewport;
	}

	render() {
		// Draw map on passed canvas context
	}

	redraw(viewport) {
		// STAGE 1 - Render only center tile
		// Takes new parameters and redraws map
		this.viewport = viewport;

		// Get tiles proper to viewport


		// Get cords of center tile to get neighbourhood
		let _centerTileCords = {
			x: Math.floor(viewport.position.x/config.tile_width),
			y: Math.floor(viewport.position.y/config.tile_height)
		}

		console.log(`Center tile calculated: [${_centerTileCords.x},${_centerTileCords.y}]`)

		// this.map = this.worldMap.getMap(_centerTileCords.x, _centerTileCords.y, _centerTileCords.x+4, _centerTileCords.y+4);
		this.map = this.worldMap.getMap();
		console.log(this.map);

		// Calculate better position because this sucks

		// this.map.forEach(tilesRow => tilesRow.forEach( tile => {
		// 	this.ctx.drawImage(tile.tileImage.image,
		// 		(viewport.position.x + 400) - tile.cords.x * (config.tile_width) + (tile.cords.y % 2 ? 60 : 0), 
		// 		(viewport.position.y + 400) - tile.cords.y * (config.tile_height - 20))
		// 	// this.ctx.drawImage(tile.tileImage.image, viewport.position.x, viewport.position.y, config.tile_width, config.tile_height);
		// }))


		let startPos = {
			x: - viewport.position.x + viewport.width/2,
			y: - viewport.position.y + viewport.height/2
		}
		// let startPos = {
		// 	x: 0,
		// 	y: 0
		// }

		this.map.forEach(tilesRow => tilesRow.forEach( tile => {
			this.ctx.drawImage(tile.tileImage.image,
				startPos.x + (tile.cords.x * config.tile_width) + (tile.cords.y % 2 ? 60 : 0),
				startPos.y + (tile.cords.y * config.tile_height));
			// this.ctx.drawImage(tile.tileImage.image, viewport.position.x, viewport.position.y, config.tile_width, config.tile_height);
		}));

		// Stroke center tile
		this.ctx.strokeRect(
			startPos.x + (_centerTileCords.x * config.tile_width) + (_centerTileCords.y % 2 ? 60 : 0),
			startPos.y + (_centerTileCords.y * config.tile_height),
			config.tile_width,
			config.tile_height
			);


		// Draw where the center of view is pointing
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(startPos.x + viewport.position.x - 5, startPos.y + viewport.position.y - 5, 10, 10);

			
	}
}