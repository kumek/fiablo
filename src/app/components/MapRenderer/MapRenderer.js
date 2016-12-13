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

		let _numberOfTiles = {
			x: Math.floor((viewport.width/config.tile_width)/2) -1,
			y: Math.floor((viewport.height/config.tile_height)/2) -1
		}

		console.log(`Center tile calculated: [${_centerTileCords.x},${_centerTileCords.y}]`)

		// this.map = this.worldMap.getMap(_centerTileCords.x, _centerTileCords.y, _centerTileCords.x+4, _centerTileCords.y+4);
		this.map = this.worldMap.getMap(
			_centerTileCords.x - _numberOfTiles.x,
			_centerTileCords.y - _numberOfTiles.y,
			_centerTileCords.x + _numberOfTiles.x,
			_centerTileCords.y + _numberOfTiles.y)

		console.log(this.map);

		let startPos = {
			x: - viewport.position.x + viewport.width/2,
			y: - viewport.position.y + viewport.height/2
		}

		this.map.forEach(tilesRow => tilesRow.forEach( tile => {
			let _tilePosition = {
				x: startPos.x + (tile.cords.x * config.tile_width) + (tile.cords.y % 2 ? 60 : 0),
				y: startPos.y + (tile.cords.y * config.tile_height)
			}
			this.ctx.drawImage(tile.tileImage.image,
				_tilePosition.x,
				_tilePosition.y);
			this.ctx.font = "60px serif black";
			this.ctx.fillText(tile.name, _tilePosition.x + 40, _tilePosition.y + 40);
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