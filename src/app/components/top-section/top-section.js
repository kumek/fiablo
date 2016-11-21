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
			<nav className="navbar navbar-default">
				<div className="container-fluid">
					{this.props.name ?
						<div className="navbar-text navbar-left">Welcome {this.props.name} :)</div>
					:
						<form className="navbar-form navbar-right" role="search" onSubmit={this.onNameSubmit}>
						  <div className="form-group">
						    <input type="text" className="form-control" placeholder="Type your username" onChange={this.onNameChange} value={this.state.name} />
						  </div>
						  <button type="submit" className="btn btn-success" >Change name</button>
						</form>	
					}
				</div>
			</nav>
		);
	}
}
