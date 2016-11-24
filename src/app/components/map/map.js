import React, { Component } from 'react';
import Tile from '../../models/terrain/tiles/tile';
import TileImages from '../../resources/TileImages';

import config from '../../config';

export default class Map extends Component {
	constructor(props) {
		super(props)
		this.tiles = [];
		this.state = {
			scale: props.scale || config.map_scale,
			offsetX: 0,
			offsetY: 0,
			tmpOffsetX: 0,
			tmpOffsetY: 0,
			draging: false
		};

		this.renderMap = this.renderMap.bind(this);
		this.calculateMap = this.calculateMap.bind(this);

		this.imagesLoaded = TileImages.loadImages();
	  	for(let j=0; j<config.tiles_count_height; j++) {
	    	for(let i=0; i<config.tiles_count_width; i++) {
	    		this.tiles.push(new Tile({x: i, y: j}));
	    	}
	    }

	}

	calcMovingVector() {
		return {
			x: this.state.endDropX - this.state.startDropX,
			y: this.state.endDropY - this.state.startDropY
		}
	}

	componentDidMount() {
		// Set canvas context
		this.refs.canvas.width = 800;
		this.refs.canvas.height = 800;
		this.ctx = this.refs.canvas.getContext('2d');

        //Load images - TODO: move somewhere else
        this.imagesLoaded.then(() => {
        	this.calculateMap();
        	this.renderMap();
        });

        this.refs.canvas.addEventListener('mousedown', (e) => {
        	console.log(this.state);
        	this.setState({
        		draging: true,
        		startDropX: e.clientX,
        		startDropY: e.clientY
        	});
        });

        this.refs.canvas.addEventListener('mouseup', (e) => {
        	this.setState({
        		draging: false,
        		offsetX: this.state.offsetX + this.state.tmpOffsetX,
        		offsetY: this.state.offsetY + this.state.tmpOffsetY,
        		tmpOffsetX: 0,
        		tmpOffsetY: 0
        	});

        	// this.setState({
        	// 	endDropX: e.clientX,
        	// 	endDropY: e.clientY
        	// });
        	// console.log(`You have moved your mouse from position (${this.state.startDropX},${this.state.startDropY}) to (${this.state.endDropX},${this.state.endDropY})`);

        	// console.log(this.calcMovingVector());
        	// this.setState({
        	// 	offsetX: this.state.offsetX + this.calcMovingVector().x,
        	// 	offsetY: this.state.offsetY + this.calcMovingVector().y
        	// });
        });

        this.refs.canvas.addEventListener('mousemove', (e) => {
        	if (this.state.draging) {
	        		this.setState({
	        		endDropX: e.clientX,
	        		endDropY: e.clientY
        		});
	    		let _vec = this.calcMovingVector();

	        	this.setState({
	        		tmpOffsetX: _vec.x,
	        		tmpOffsetY: _vec.y
	    		});
        	}
        	
        });
    }

    componentDidUpdate() {
    	// console.log(this.state);
    	this.renderMap();
    }

    calculateMap() {
	// 	// TODO: Move configs somewhere else120
	// 	const TILES_SIZE = 1;
	// 	const width = 20;
	// 	const height = 20;

	//     let _posx, _posy;

	    // Construct tiles
	  
	}

	renderMap() {
		// TODO: Move tiles rendering to another layer - class

		//Render
		const images = [];
		this.ctx.fillStyle = '#454';
		this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);

		let _calPos = (i, j) => {
			return {
				x: (((j % 2) ? (i * config.tile_width) : (i * config.tile_width - config.tile_width/2))) 
				* this.state.scale + this.state.offsetX + this.state.tmpOffsetX,
				y: ((j * (config.tile_height - config.tile_height/4 -1) - config.tile_height/3)) * 
				this.state.scale + this.state.offsetY + this.state.tmpOffsetY

			}
		}
		let _pos;


		this.tiles.forEach(tile => {
			_pos =  _calPos(tile.position.x, tile.position.y);
			this.ctx.drawImage(tile.tileImage.image, _pos.x, _pos.y, config.tile_width * this.state.scale, config.tile_height * this.state.scale);
		})
	// 	this.tiles.forEach(tile => {
	// 		this.ctx.drawImage(tile.image, tile.position.x, tile.position.y, tile.size.x, tile.size.y);
	// 	});
}

render() {
	return (
		<div className='canvas-container'>
		<canvas ref='canvas'></canvas>
		</div>
		)
}
}