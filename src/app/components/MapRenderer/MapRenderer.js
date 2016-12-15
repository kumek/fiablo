import config from '../../config';

export default class Renderer {
	// Renderer gets world map, viewport size, viewport position, canvas context and calculates all data needed for map to be drawn
	constructor(ctx, worldMap, viewport) {
		console.log('Trying to construct MapRenderer');
		this.ctx = ctx;
		this.worldMap = worldMap;
		this.viewport = viewport;

		this.centerTileCords = this.centerTileCords.bind(this);
		this.numberOfTilesVisible = this.numberOfTilesVisible.bind(this);
		this.startDrawingPosition = this.startDrawingPosition.bind(this);
	}

	render() {
		// Draw map on passed canvas context
	}

	centerTileCords() {
		return {
			x: Math.floor(this.viewport.position.x/(config.TILE_WIDTH)),
			y: Math.floor(this.viewport.position.y/(config.TILE_HEIGHT))
		}
	}

	numberOfTilesVisible() {
		return {
			x: Math.floor(this.viewport.width/(config.TILE_WIDTH * this.viewport.scale)/2) + 2,
			y: Math.floor(this.viewport.height/(config.TILE_HEIGHT * 0.73 * this.viewport.scale)/2) + 2
		}
	}

	mapRectToRender(centerTile, numberOfTiles) {
		return [
			(centerTile.x - numberOfTiles.x) || 0,
			(centerTile.y - numberOfTiles.y) || 0,
			centerTile.x + numberOfTiles.x,
			centerTile.y + numberOfTiles.y
		]
	}

	startDrawingPosition() {
		return {
			x: - (this.viewport.position.x * this.viewport.scale) + this.viewport.halfWidth,
			y: - (this.viewport.position.y * this.viewport.scale * 0.73) + this.viewport.halfHeight
		}
	}

	drawTile(tile, startPosition) {
		let _tilePosition = {
					x: startPosition.x + (tile.cords.x * config.TILE_WIDTH * this.viewport.scale) + (tile.cords.y % 2 ? (60 * this.viewport.scale) : 0),
					y: startPosition.y + (tile.cords.y * config.TILE_HEIGHT * this.viewport.scale * 0.73)
				}
		this.ctx.drawImage(tile.tileImage.image,
			_tilePosition.x,
			_tilePosition.y,
			config.TILE_WIDTH * this.viewport.scale,
			config.TILE_HEIGHT * this.viewport.scale
		);
	}

	redraw(viewport) {
		// Takes new viewport and redraws map
		this.viewport = viewport;

		// console.log(viewport.scale);

		// Get cords of center tile to get neighbourhood
		let _centerTileCords = this.centerTileCords();
		// console.log(_centerTileCords);
		let _numberOfVisibleTiles = this.numberOfTilesVisible();
		// console.log(_numberOfVisibleTiles);

		this.map = this.worldMap.getMap(this.mapRectToRender(_centerTileCords,_numberOfVisibleTiles));
		console.log(this.map.length, this.map[0].length);

		let _startPos = this.startDrawingPosition();

		this.map.forEach(tilesRow => tilesRow.forEach( tile => {
			if(tile) {
				this.drawTile(tile, _startPos);
				
				// this.ctx.font = "60 serif black";
				// this.ctx.fillText(tile.name, _tilePosition.x + 40, _tilePosition.y + 40);	
			}
		}));

		// Stroke center tile
		this.ctx.strokeRect(
			_startPos.x + (_centerTileCords.x * config.TILE_WIDTH * this.viewport.scale) + (_centerTileCords.y % 2 ? (60 * this.viewport.scale) : 0),
			_startPos.y + (_centerTileCords.y * config.TILE_HEIGHT * this.viewport.scale * 0.73),
			config.TILE_WIDTH * this.viewport.scale,
			config.TILE_HEIGHT * this.viewport.scale
			);

		// Draw starting position
		this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(_startPos.x - 5, _startPos.y - 5, 10, 10);


		// Draw where the center of view is pointing
		this.ctx.strokeStyle = '#BE8145';
		this.ctx.lineWidth = 3;
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(_startPos.x + (viewport.position.x * this.viewport.scale) - 5, _startPos.y + (viewport.position.y * this.viewport.scale * 0.73) - 5, 10, 10);

			
	}
}