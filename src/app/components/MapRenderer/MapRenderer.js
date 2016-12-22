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
		this.calculateTilePosition = this.calculateTilePosition.bind(this);
		this.strokeTile = this.strokeTile.bind(this);
		this.drawTile = this.drawTile.bind(this);
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


	calculateTilePosition(tileCords, startPosition) {
		return {
			x: startPosition.x + (tileCords.x * config.TILE_WIDTH * this.viewport.scale) + (tileCords.y % 2 ? (60 * this.viewport.scale) : 0),
			y: startPosition.y + (tileCords.y * config.TILE_HEIGHT * this.viewport.scale * 0.73)
		}
	}

	drawTile(tile, startPosition) {
		let {x, y} = this.calculateTilePosition(tile.cords, startPosition);
		this.ctx.drawImage(tile.tileImage.image, x, y,
			config.TILE_WIDTH * this.viewport.scale,
			config.TILE_HEIGHT * this.viewport.scale
		);
	}

	strokeTile(centerTileCords, startPosition) {
		let {x ,y} = this.calculateTilePosition(centerTileCords, startPosition);
		let _differenceHeight = config.TILE_HEIGHT * this.viewport.scale - (config.TILE_HEIGHT * this.viewport.scale * 0.75);
		let _halfWidth = config.TILE_WIDTH * this.viewport.scale * 0.5;
		let _width = config.TILE_WIDTH * this.viewport.scale;
		let _height = config.TILE_HEIGHT * this.viewport.scale;

		this.ctx.strokeStyle = '#125F32';
		this.ctx.lineWidth = 7;
		this.ctx.beginPath();
		this.ctx.moveTo(x + _halfWidth, y);
		this.ctx.lineTo(x + _width, y + _differenceHeight);
		this.ctx.lineTo(x + _width, y + _height - _differenceHeight);
		this.ctx.lineTo(x + _halfWidth, y + _height);
		this.ctx.lineTo(x, y + _height - _differenceHeight);
		this.ctx.lineTo(x, y + _differenceHeight);
		this.ctx.lineTo(x + _halfWidth, y);
		this.ctx.closePath();
		this.ctx.stroke();

	}

	redraw(viewport, cursor) {
		// Takes new viewport and redraws map
		this.viewport = viewport;

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
		this.strokeTile(_centerTileCords, _startPos);

		// Draw starting position
		this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(_startPos.x - 5, _startPos.y - 5, 10, 10);


		// Draw where the center of view is pointing
		
        // this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(_startPos.x + (viewport.position.x * this.viewport.scale) - 5, _startPos.y + (viewport.position.y * this.viewport.scale * 0.73) - 5, 10, 10);

    	// Draw cursor position
		
        this.ctx.fillStyle = 'orange';
        // this.ctx.fillRect(_startPos.x + (viewport.position.x * this.viewport.scale) - 5, _startPos.y + (viewport.position.y * this.viewport.scale * 0.73) - 5, 10, 10);

			
	}
}