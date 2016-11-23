import React, { Component } from 'react';
import Tile from '../../models/terrain/tiles/tile';

export default class Map extends Component {
	constructor(props) {
		super(props)
		this.renderMap = this.renderMap.bind(this);
		this.calculateMap = this.calculateMap.bind(this);

		this.tiles = [];
	}

	componentDidMount() {
		this.refs.canvas.width = 800;
        this.refs.canvas.height = 800;
        this.ctx = this.refs.canvas.getContext('2d');

        this.calculateMap();
	}

	calculateMap() {
		// TODO: Move configs somewhere else
		const TILES_SIZE = 0.5;
		const width = 20;
		const height = 20;

	    let _posx, _posy;

	    // Construct tiles
	    for(let j=0; j<height; j++) {
	    	for(let i=0; i<width; i++) {
	    		_posx = (j % 2) ? (i * 120 * TILES_SIZE) - (120 * TILES_SIZE) : (i * 120 * TILES_SIZE) - (60 * TILES_SIZE);
	    		_posy = (j * 100 * TILES_SIZE) - (100 * TILES_SIZE);
	    		this.tiles.push(new Tile('GRASS', {x: _posx, y: _posy}));
	    	}
	    }

	    //Load all images
	    Promise.all(this.tiles.map(tile => {
	    	return tile.loadImage();
	    })).then(this.renderMap);
	}

	renderMap() {
		const images = [];
		this.ctx.fillStyle = '#454';
		this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);

		this.tiles.forEach(tile => {
			console.log(tile);
			this.ctx.drawImage(tile.image, tile.position.x, tile.position.y, tile.size.x, tile.size.y);
		});
	}

	render() {
		return (
			<div className='canvas-container'>
				<canvas ref='canvas'></canvas>
			</div>
			)
	}
}