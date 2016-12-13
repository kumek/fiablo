import React, { Component } from 'react';
import Tile from '../../models/terrain/tiles/tile';
import TileImages from '../../resources/TileImages';
import WorldMap from '../WorldMap/WorldMap';
import MapRenderer from '../MapRenderer/MapRenderer';

import config from '../../config';

export default class Map extends Component {
    constructor(props) {
        let _state;
        super(props);

        // Set initial state of map
        this.state = {
            scale: props.scale || config.map_scale,
            indicator: 0,
            viewport: {
                width: 800,
                height: 800,
                position: {
                    x: 400,
                    y: 400
                }
            },
            rendering: false,
        };
        
        // Bind context of functions
        this.renderMap = this.renderMap.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.startRendering = this.startRendering.bind(this);
        this.stopRendering = this.stopRendering.bind(this);
        this.onStartDragging = this.onStartDragging.bind(this);
        this.onEndDragging = this.onEndDragging.bind(this);
        this.onDragging = this.onDragging.bind(this);
    }

    onStartDragging(e) {
        console.log(e);
        this.setState({
            drag_mode: true,
            startDropX: e.clientX,
            startDropY: e.clientY,
            startViewportX: this.state.viewport.position.x || 400,
            startViewportY: this.state.viewport.position.y || 400 
        });
    }

    onEndDragging(e) {
        let _viewport = Object.assign({}, this.state.viewport);
        _viewport.position = {
            x: this.state.viewport.position.x + this.state.tmpOffsetX,
            y: this.state.viewport.position.y + this.state.tmpOffsetY
        }

        this.setState({
            drag_mode: false,
            startDropX: 0,
            startDropY: 0,
            tmpOffsetX: 0,
            tmpOffsetY: 0,
            viewport: _viewport
        });
    }

    onDragging(e) {
        if (this.state.drag_mode) {
            let _viewport = Object.assign({}, this.state.viewport);

            _viewport.position = {
                x: this.state.startViewportX - (e.clientX - this.state.startDropX),
                y: this.state.startViewportY - (e.clientY - this.state.startDropY)
            }
            console.log(`Pos: [${_viewport.position.x},${_viewport.position.y}]`)
            this.setState({
                viewport: _viewport
            })
        }
    }

    addEventListeners() {
        this.refs.renderButton.addEventListener('click', this.renderMap)

        this.refs.toggleRenderButton.addEventListener('click', () => {
            this.toggleRendering();
        })

        this.refs.canvas.addEventListener('mousedown', this.onStartDragging);
        this.refs.canvas.addEventListener('touchstart', this.onStartDragging);

        this.refs.canvas.addEventListener('mouseup', this.onEndDragging);
        this.refs.canvas.addEventListener('touchend', this.onEndDragging);
        this.refs.canvas.addEventListener('touchcancel', this.onEndDragging);

        this.refs.canvas.addEventListener('mousemove', this.onDragging);
        this.refs.canvas.addEventListener('touchmove', this.onDragging);
    }

    toggleRendering() {
        if(this.state.rendering) {
            this.stopRendering()
        } else {
            this.startRendering()
        }
    }

    startRendering() {
        if(!this.state.rendering) {
            let _renderID = setInterval(this.renderMap, 15);

            this.setState({
                rendering: true,
                renderId: _renderID
            });    
        }
    }

    stopRendering() {
        clearInterval(this.state.renderId);
        this.setState({
            rendering: false
        });
    }

    componentDidMount() {
        // Set canvas context
        this.refs.canvas.width = this.state.viewport.width;
        this.refs.canvas.height = this.state.viewport.height;
        this.ctx = this.refs.canvas.getContext('2d');

        // Create WorldMap and MapRenderer
                // Load images of tiles and construct worldMap after all are loaded
        TileImages.loadImages()
            .then(() => {
                console.log('All images loaded');
                let _worldMap = new WorldMap();
                this.setState({
                    worldMap: _worldMap,
                    mapRenderer: new MapRenderer(this.ctx, _worldMap, this.state.viewport)
                });
                // this.startRendering();
            });

        // Add event listeners for mouse moving
        this.addEventListeners();
        // setInterval(this.renderMap, 15);
        // this.renderMap();
    }

    renderMap() {
        this.setState({
            indicator: this.state.indicator >= 2 ? 0 : this.state.indicator + 0.06
        })

        console.log('Map rendering ...');

        // Draw green background
        this.ctx.fillStyle = '#454';
        this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);


        // Render map tiles here
        this.state.mapRenderer.redraw(this.state.viewport);

        // // Center position of viewport
        // this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(this.state.viewport.position.x - 5, this.state.viewport.position.y - 5, 10, 10);

        // Vector of dragging map
        this.ctx.beginPath();

        this.ctx.moveTo(this.state.startViewportX, this.state.startViewportY);
        this.ctx.lineTo(this.state.viewport.position.x, this.state.viewport.position.y);

        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();

        // Draw indicator -- TODO: This is temporary
        this.ctx.moveTo(this.state.viewport.width - 100, this.state.viewport.height - 100);
        this.ctx.arc(this.state.viewport.width - 100, this.state.viewport.height - 100, 20, this.state.indicator * Math.PI, (0.6 + this.state.indicator) * Math.PI);
        this.ctx.strokeStyle = 'orange';
        this.ctx.fill();
}

render() {
    return (
        <div className='canvas-container'>
        <canvas ref='canvas'></canvas>
        <div>
            <button ref='toggleRenderButton'>{this.state.rendering ? 'PAUSE' : 'START'}</button>
            <button ref='renderButton'>RENDER ONCE</button>

        </div>
        </div>
        )}
}