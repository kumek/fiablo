import React, { Component } from 'react';

export default class Stats extends Component {
	render() {
		return (
			<div>
				<div className="panel panel-info stats-panel">
					<div className="panel-heading">
						<h2>Stats</h2>
					</div>
					<div className="panel-body">
						<ul>
							<li>{this.props.stats.lvl} level</li>
							<li>{this.props.stats.hp} HP</li>
							<li>{this.props.stats.exp} EXP</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}