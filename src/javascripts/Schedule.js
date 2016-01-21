'use strict';
import React from 'react';
import request from 'superagent';

class Row extends React.Component {
	render() {
		function getClass(hour) {
			if(!hour.lectors) {
				return 'empty';
			}
			return hour.id.startsWith('P') ? 'lecture' : 'class';
		}

		var hours = [];
		var first = true;
		var n = 0;
		for(var i = -1; i < 14; i++) {
			if(first) {
				if(this.props.row == 0) {
					hours.push(<td rowSpan={this.props.rows}>{this.props.day}</td>);
				}
				first = false;
			} else {
				if(n < this.props.hours.length && this.props.hours[n].start == i) {
					let hour = this.props.hours[n];
					hours.push(
						<td colSpan={hour.len} className={getClass(hour)}>
							{hour.name} <br />
							{hour.start} - {hour.len}<br />
							{hour.lectors}
						</td>);
					i += hour.len - 1;
					n++;
				} else {
					hours.push(<td></td>);
				}
			}
		}

		return (
			<tr>
				{hours}
			</tr>);
	}
}

class Day extends React.Component {
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
					return <Row key={i} hours={row} day={this.props.day} row={i} rows={rows.length}></Row>
				})}
			</tbody>
		);
	}
}

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {days: [[], [], [], [], [], []]};
	}

	componentDidMount() {
		var items = {
			'12345': 'Subject',
		};

		for(let i in items) {
			request.get('/' + i + '.json')
				.end((err, res) => {
					var json = JSON.parse(res.text);
					this.setState((state) => {
						for (let day in json) {
							json[day].name = items[i];
							state.days[json[day].day].push(json[day]);

							state.days[json[day].day].sort((a, b) => {
								if(a.start == b.start) {
									if(a.lectors && b.lectors) {
										return 0;
									} else if(a.lectors) {
										return -1;
									} else {
										return 1;
									}
								}

								return a.start < b.start ? -1 : 1;
							});
						}
						return state;
					});
				});
		}
	}

	render() {
		let hours = [
			'7:15-8:00', '8:00-8:45', '9:00-9:45', '9:45-10:30', '10:45-11:30', '11:30-12:15', '12:30-13:15',
			'13:15-14:00', '14:15-15:00', '15:00-15:45', '16:00-16:45', '16:45-17:30', '17:45-18:30', '18:30-19:15'];

		var tds = [];
		for(let hour in hours) {
			tds.push(<th key={hour}>{hours[hour]}</th>);
		}

		let days = ['Po', 'Ut', 'St', 'Ct'];
		var daysEl = [];
		//daysEl.push(<Day key={1} day={days[0]} hours={this.state.days[0]} />);
		for(var i = 0; i < days.length; i++) {
			daysEl.push(<Day day={days[i]} hours={this.state.days[i]} />);
		}

		return (
			<div className="schedule">
				<table className="table table-responsive table-bordered">
					<thead>
						<tr>
							<td></td>
							{tds}
						</tr>
					</thead>
					{daysEl}
				</table>
			</div>
		);
	}
}
