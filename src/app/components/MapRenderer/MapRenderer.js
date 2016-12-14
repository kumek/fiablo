import config from '../../config';

export default class Renderer {
	// Renderer gets world map, viewport size, viewport position, canvas context and calculates all data needed for map to be drawn
	constructor(ctx, worldMap, viewport) {
		console.log('Trying to construct MapRenderer');
		this.ctx = ctx;
		this.worldMap = worldMap;
		this.viewport = viewport;

		this.numberOfTiles = {
			x: Math.floor((viewport.width/config.TILE_WIDTH)/2) +2,
			y: Math.floor((viewport.height/config.TILE_HEIGHT)/2) +2
		}
	}

	render() {
		// Draw map on passed canvas context
	}

	redraw(viewport) {
		// Takes new viewport and redraws map
		this.viewport = viewport;

		// Get cords of center tile to get neighbourhood
		let _centerTileCords = {
			x: Math.floor(viewport.position.x/config.TILE_WIDTH),
			y: Math.floor(viewport.position.y/config.TILE_HEIGHT)
		}

		this.map = this.worldMap.getMap(
			(_centerTileCords.x - this.numberOfTiles.x) || 0,
			(_centerTileCords.y - this.numberOfTiles.y) || 0,
			_centerTileCords.x + this.numberOfTiles.x,
			_centerTileCords.y + this.numberOfTiles.y)

		let _startPos = {
			x: - viewport.position.x + viewport.width/2,
			y: - viewport.position.y + viewport.height/2
		}

		this.map.forEach(tilesRow => tilesRow.forEach( tile => {
			if(tile) {
				let _tilePosition = {
					x: _startPos.x + (tile.cords.x * config.TILE_WIDTH) + (tile.cords.y % 2 ? 60 : 0),
					y: _startPos.y + (tile.cords.y * config.TILE_HEIGHT)
				}
				this.ctx.drawImage(tile.tileImage.image,
					_tilePosition.x,
					_tilePosition.y);
				this.ctx.font = "60 serif black";
				this.ctx.fillText(tile.name, _tilePosition.x + 40, _tilePosition.y + 40);	
			}
		}));

		// Stroke center tile
		this.ctx.strokeRect(
			_startPos.x + (_centerTileCords.x * config.TILE_WIDTH) + (_centerTileCords.y % 2 ? 60 : 0),
			_startPos.y + (_centerTileCords.y * config.TILE_HEIGHT),
			config.TILE_WIDTH,
			config.TILE_HEIGHT
			);


		// Draw where the center of view is pointing
		this.ctx.strokeStyle = '#BE8145';
		this.ctx.lineWidth = 3;
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(_startPos.x + viewport.position.x - 5, _startPos.y + viewport.position.y - 5, 10, 10);

			
	}
}