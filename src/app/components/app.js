import React, { Component } from 'react';
import TopSection from './topSection/topSection';
import Stats from './stats/stats';

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
				<TopSection name={this.state.name} setName={this.setName}/>
				<Stats stats={this.state.player.stats}/>
			</div>
			)
	}
}