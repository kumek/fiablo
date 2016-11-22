import React, { Component } from 'react';
import $ from 'jquery';

export default class TopSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.name
		};

		this.onNameChange = this.onNameChange.bind(this);
		this.onNameSubmit = this.onNameSubmit.bind(this);
	}
	
	onNameSubmit(e) {
		e.preventDefault();
		this.props.setName(this.state.name);
	}

	onNameChange(e) {
		this.setState({ name: e.target.value });
	}


	render() {
		return (
			<div className="top-section">
				Welcome {this.props.name} :)
				Kolejna kolejna dobra zmiana 11
			</div>
		);
	}
}