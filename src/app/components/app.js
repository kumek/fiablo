import React, { Component } from 'react';
import Map from './Map/Map';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			player: {
				stats: {
					hp: 150,
					exp: 400,
					lvl: 4
				}
			}
		}
		this.setName = this.setName.bind(this);
	}

	setName(name) {
		console.log(`New name is ${name}`)
		this.setState({ name });
	}

	render() {
		return (
			<div>
				<Map />
			</div>
			)
	}
}