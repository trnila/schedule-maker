'use strict';
import React from 'react';
import Row from './Row';

export default class Day extends React.Component {
	render() {
		let hours = this.props.hours;
		var used = Array.apply(null, Array(hours.length)).map(function (_, i) {return false;});

		var rows = [];
		do {
			var row = [];
			for (var h = 0; h < 14; h++) {
				for (var i = 0; i < hours.length; i++) {
					let hour = hours[i];
					if (!used[i] && hour.start == h) {
						row.push(hour);

						used[i] = true;
						h += hour.len;
					}
				}
			}
			rows.push(row);
		} while(used.filter((_) => {return !_;}).length);

		return (
			<tbody>
			{rows.map((row, i) => {
				return <Row
					key={i}
					hours={row}
					day={this.props.day}
					row={i}
					rows={rows.length}
					selected={this.props.selected}
					highlighted={this.props.highlighted}
					onHighlightSubject={this.props.onHighlightSubject}
					onSubjectSelect={this.props.onSubjectSelect}
				/>
			})}
			</tbody>
		);
	}
}
