# Fiablo


## Progressive map loading with canvas and react
![Progressive loaded map moving](https://github.com/kumek/fiablo/raw/master/data/fiablo_map4.gif "Progressive map loaded moving")
### Introduction
We want to build a strategic game, where player can move around on big, flat map. It is based on hexagon tiles. Entire world is 2000 tiles width and height.
But what player see on the screen is 10x10 tiles sized map. We don't need to redraw all of 2000^2 tiles each frame.
This is mechanism that can help to achieve this.

### Initial assumptions
As we want to build user interface in React in the future, map rendering will be wrapped in React component.

This post focuses on the topic of the progressive map loading only. I assume that other parts of code are already done:
  1. When progressive loading is being initialized, map already had been generated and all images were loaded.
  2. Touch and mouse events are implemented.

This approach has advantages:
  1. Not entire map is being rendered each frame.
  2. Small area of map can be dynamically loaded from server depending on the position of the player.

Having this in mind, take a look at the code.
### Code
_Before continue, we need to specify:_
  * Tile **cords/coordinates** are ordinal numbers corresponding to the array index
  * Tile **position** is calculated from cords and tile size to be used in rendering

#### WorldMap
Class that holds entire map data. We also should be able to get separate section of the map specified by coordinates.
```javascript
// WorldMap.js

import config from '../../config';
import Tile from '../../models/terrain/tiles/Tile';

export default class WorldMap {
    // WorldMap holds only data of entire map.
    constructor() {
        let i,j;
        this.tiles = [];
        for(i=0; i<config.WORLD_WIDTH; i++) {
            this.tiles[i] = [];
            for(j=0; j<config.WORLD_HEIGHT; j++) {
                this.tiles[i][j] = new Tile({x: i, y: j});
            }
        }
    }

    //...

    // Get particular rectangle region, or entire world if cords are not specified
    getMap([startX = 0, startY = 0, endX = config.WORLD_WIDTH-1, endY = config.WORLD_HEIGHT-1]) {
        let _tmpResponse = [];
        for(let i=0; i<endX-startX+1; i++) {
            _tmpResponse[i] = [];
            for(let j=0; j<endY-startY+1; j++) {
                _tmpResponse[i][j] = this.tiles[i+startX] ? this.tiles[i+startX][j+startY] : undefined;
            }
        }
        return _tmpResponse;
    }
}
```



#### MapRenderer
Calculates `viewport` with `map` and renders it on canvas context.
In short:
  1. Find **cords** of center tile on the screen _`centerTileCords()`_
  2. Calculate **visible section** of entire map _`mapRectToRender()`_
  3. Calculate **position** for each tile of visible section _`calculateTilePosition()`_
  4. **Draw tiles** on canvas _`drawTile()`_

```javascript
// MapRenderer.js

import config from '../../config';

export default class MapRenderer {
    // Renderer gets world map, viewport size, viewport position, canvas context and calculates all data needed for map to be drawn
    constructor(ctx, worldMap, viewport) {
        this.ctx = ctx;
        this.worldMap = worldMap;
        this.viewport = viewport;

        //...
    }

    centerTileCords() {
        return {
            x: Math.floor(this.viewport.position.x/(config.TILE_WIDTH)),
            y: Math.floor(this.viewport.position.y/(config.TILE_HEIGHT))
        }
    }

    //...

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

    redraw(viewport, cursor) {
        // Takes new viewport and redraws map
        this.viewport = viewport;

        // Get cords of center tile
        let _centerTileCords = this.centerTileCords();

        // Get visible map section of entire map
        let _numberOfVisibleTiles = this.numberOfTilesVisible();
        this.map = this.worldMap.getMap(this.mapRectToRender(_centerTileCords,_numberOfVisibleTiles));

        let _startPos = this.startDrawingPosition();

        // Draw each tile of visible section
        this.map.forEach(tilesRow => tilesRow.forEach( tile => {
            if(tile) {
                this.drawTile(tile, _startPos);
            }
        }));
        
        //...

    }
}
```

#### Map
React component that holds `MapRenderer` and `WorldMap`. 
At the begining it creates canvas object. After component is ready it adds event listeners, get data from viewport and use it for calling render function.

```javascript
// Map.js

import React, { Component } from 'react';
import WorldMap from '../WorldMap/WorldMap';
import MapRenderer from '../MapRenderer/MapRenderer';

import config from '../../config';
//...

export default class Map extends Component {
    constructor(props) {
        super(props);

        // Set initial state of map
        this.state = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                //...
            },
            //...
        };
        
        //...
    }

    // Mouse, touch end other events listeners
    //...

    componentDidMount() {
        // Set canvas context
        this.canvas.width = this.state.viewport.width;
        this.canvas.height = this.state.viewport.height;
        this.ctx = this.refs.canvas.getContext('2d');

        // Create WorldMap and MapRenderer
        // Load images of tiles and construct worldMap after all are loaded
        TileImages.loadImages()
            .then(() => {
                console.log('All images are loaded');
                let _worldMap = new WorldMap();
                this.setState({
                    worldMap: _worldMap,
                    viewport: {
                        width: this.state.viewport.width,
                        halfWidth: this.state.viewport.width/2,

                        height: this.state.viewport.height,
                        halfHeight: this.state.viewport.height/2,

                        position: {
                            x: _worldMap.getBoundaries().x/2,
                            y: _worldMap.getBoundaries().y/2
                        },
                        scale: this.state.viewport.scale
                    },
                    mapRenderer: new MapRenderer(this.ctx, _worldMap, this.state.viewport)
                });
                // Start rendering map
                this.renderMap();
                // Add event listeners for mouse moving
                this.addEventListeners();
            });
    }

    renderMap() {
        // Draw green background
        this.ctx.fillStyle = '#454';
        this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        
        // Render new frame
        this.state.mapRenderer.redraw(this.state.viewport, this.state.cursor);

        window.requestAnimationFrame(this.renderMap);

}

render() {
    return (
        <div className='canvas-container'>
        <canvas ref={canvas => this.canvas=canvas}'></canvas>
//        </div>
        )}
}
```

### Ending
Something more can be added. Performance fixes could also be done. And so on...


### Demo
You can find working demo on [fiablo.kumek.pl](http://fiablo.kumek.pl)
If you are interested in seeing uncut code - [github.com/kumek/fiablo](https://github.com/kumek/fiablo)

### Credits
Graphics from [kenney.nl](http://kenney.nl/)

