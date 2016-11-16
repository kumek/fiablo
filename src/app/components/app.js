import React, { Component } from 'react';
import TopSection from './top-section/top-section';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {}
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
			</div>
			)
	}
}