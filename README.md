# Fiablo


## Progressive map loading with canvas and React
![alt text](https://github.com/kumek/fiablo/raw/master/data/fiablo_map4.gif "Logo Title Text 1")

We want to build a strategic game, where player can move around on big, flat map. It is based on hexagon tiles. Entire world is 2000 tiles width and height.
But what player see on the screen is 10x10 tiles sized map. We don't need to redraw all of 2000^2 tiles each frame.
This is mechanism that can help to achieve this.

As we want to build user interface in React in the future, map rendering will be wrapped in React component.

This post focuses on the topic of the progressive map loading only. I assume that:
1. When progressive loading is being initialized, map already had been generated and all images were loaded.
2. Touch and mouse events are implemented.

This approach has advantages:
1. Not entire map is being rendered each frame.
2. Small area of map can be dynamically loaded from server depending on the position of the player.

Having this in mind, take a look on the code.
### World map
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








