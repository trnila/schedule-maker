'use strict';
import React from 'react';
import Class from './Class';
let days = ['Po', 'Ut', 'St', 'Ct'];

export default class Row extends React.Component {
	render() {
		var hours = [];
		var first = true;
		var n = 0;
		for(var i = -1; i < 14; i++) {
			if(first) {
				if(this.props.row == 0) {
					hours.push(<td rowSpan={this.props.rows} key={i}>{days[this.props.day]}</td>);
				}
				first = false;
			} else {
				if(n < this.props.hours.length && this.props.hours[n].start == i) {
					let hour = this.props.hours[n];

					hours.push(
						<Class key={i}
						       id={hour.id}
						       subjectId={hour.subjectId}
						       start={hour.start}
						       len={hour.len}
						       name={hour.name}
						       lectors={hour.lectors ? hour.lectors : []}
						       selected={this.props.selected.filter((i) => {return i.subjectId == hour.subjectId && i.id == hour.id;}).length}
						       highlighted={this.props.highlighted == hour.name}
						       onHighlightSubject={this.props.onHighlightSubject}
						       onSubjectSelect={this.props.onSubjectSelect}
						/>)
					i += hour.len - 1;
					n++;
				} else {
					hours.push(<td key={i}></td>);
				}
			}
		}

		return (
			<tr className={this.props.day % 2 == 0 ? 'day-even' : 'day-odd'}>
				{hours}
			</tr>);
	}
}
