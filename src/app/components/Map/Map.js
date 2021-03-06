import React, { Component } from 'react';
import Tile from '../../models/terrain/tiles/Tile';
import TileImages from '../../resources/TileImages';
import WorldMap from '../WorldMap/WorldMap';
import MapRenderer from '../MapRenderer/MapRenderer';

import config from '../../config';

export default class Map extends Component {
    constructor(props) {
        super(props);

        // Set initial state of map
        this.state = {
            indicator: 0,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                scale: config.MAP_SCALE,
            },
            rendering: true,
            cursor: {}
        };
        
        // Bind context of functions
        this.renderMap = this.renderMap.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.onMouseStartDrag = this.onMouseStartDrag.bind(this);
        this.onEndDragging = this.onEndDragging.bind(this);
        this.onDragging = this.onDragging.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    // Mouse and touch events that will generate MapGenerator events
    onMouseStartDrag(e) {
        this.setState({
            drag_mode: true,
            startDrag: {
                x: e.clientX || e.changedTouches[0].clientX,
                y: e.clientY || e.changedTouches[0].clientY
            },
            startViewport: {
                x: this.state.viewport.position.x,
                y: this.state.viewport.position.y
            }
        });
    }

    onEndDragging(e) {
        this.setState({
            drag_mode: false,
            startDrag: {
                x: 0,
                y: 0
            }
        });
    }

    onDragging(e) {
        let viewport = Object.assign({}, this.state.viewport);

        if (this.state.drag_mode) {
            
            
            let _tmpX = this.state.startViewport.x - ((e.clientX || e.changedTouches[0].clientX) - this.state.startDrag.x)/this.state.viewport.scale;
            let _tmpY = this.state.startViewport.y - ((e.clientY || e.changedTouches[0].clientY) - this.state.startDrag.y)/this.state.viewport.scale/0.73;

            viewport.position = {
                x: _tmpX,
                y: _tmpY
            }

            this.setState({ viewport })
        } else {
            let cursor = {
            x: this.state.viewport.position.x - (this.state.viewport.halfWidth - e.clientX) * this.state.viewport.scale,
            y: this.state.viewport.position.y - (this.state.viewport.halfHeight - e.clientY) * this.state.viewport.scale
        }
                        
        this.setState({ cursor });
            console.log(cursor);

        }
    }

    onScroll(e) {
        let scale = this.state.viewport.scale + (e.deltaY/2000);

        this.setState({
            viewport: Object.assign({}, this.state.viewport, { scale: scale < 0.1 ? 0.1 : scale })
        })
    }

    addEventListeners() {
        this.refs.canvas.addEventListener('dblclick', e => {
            if (document.webkitFullscreenElement == undefined) {
                document.body.webkitRequestFullScreen();  
            } else {
                document.webkitExitFullscreen();
            }
        })

        window.addEventListener('resize', e => {
            let viewport = Object.assign({}, this.state.viewport, {
                width: window.innerWidth,
                height: window.innerHeight
            })
            this.refs.canvas.width = window.innerWidth;
            this.refs.canvas.height = window.innerHeight;
            this.setState({
                viewport
            })
        });

        this.refs.canvas.addEventListener('touchstart', e => {
            console.log('Touchstart');
            console.log(e);
        });

        this.refs.canvas.addEventListener('touchend', e => {
            console.log('Touchend');
            console.log(e);
        });

        this.refs.canvas.addEventListener('mousedown', this.onMouseStartDrag);
        this.refs.canvas.addEventListener('touchstart', this.onMouseStartDrag);

        this.refs.canvas.addEventListener('mouseup', this.onEndDragging);
        this.refs.canvas.addEventListener('touchend', this.onEndDragging);

        this.refs.canvas.addEventListener('mousemove', this.onDragging);
        this.refs.canvas.addEventListener('touchmove', this.onDragging);

        this.refs.canvas.addEventListener('mousewheel', this.onScroll);

    }

    // MapGenerator events
    onMove(vector) {

    }

    onScale(scale) {
        
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

        this.setState({
            indicator: this.state.indicator >= 2 ? 0 : this.state.indicator + 0.06
        })

        // Draw green background
        this.ctx.fillStyle = '#454';
        this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);


        // Render map tiles here
        this.state.mapRenderer.redraw(this.state.viewport, this.state.cursor);

        // // Draw indicator -- TODO: This is temporary
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.state.viewport.width - 100, this.state.viewport.height - 100);
        // this.ctx.arc(this.state.viewport.width - 100, this.state.viewport.height - 100, 20, this.state.indicator * Math.PI, (0.6 + this.state.indicator) * Math.PI);
        // this.ctx.lineTo(this.state.viewport.width - 100, this.state.viewport.height - 100);
        // this.ctx.fillStyle = "#B2BDBD";
        // this.ctx.lineWidth = 5;
        // this.ctx.strokeStyle = '#BE8145';
        // this.ctx.stroke();
        // this.ctx.fill();
        window.requestAnimationFrame(this.renderMap);

}

render() {
    return (
        <div className='canvas-container'>
        <canvas ref='canvas'></canvas>
        </div>
        )}
}