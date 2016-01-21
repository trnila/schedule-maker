'use strict';
import React from 'react';
import request from 'superagent';

class Hour extends React.Component {
	render() {
		return (
			<td>
				MAIT
			</td>);
	}
}

class Day extends React.Component {
	render() {
		return (
			<tr>
				<td>{this.props.day}</td>
				<Hour />
				<Hour />
				<Hour />
			</tr>);
	}
}

export default class extends React.Component {
	render() {
		request.get('/470230101.json')
			.end(function(err, res) {
				var json = JSON.parse(res.text);
				console.log(json);
			});


		let hours = [
			'7:15-8:00', '8:00-8:45', '9:00-9:45', '9:45-10:30', '10:45-11:30', '11:30-12:15', '12:30-13:15',
			'13:15-14:00', '14:15-15:00', '15:00-15:45', '16:00-16:45', '16:45-17:30', '17:45-18:30', '18:30-19:15'];

		var tds = [];
		for(let hour in hours) {
			tds.push(<th key={hour}>{hours[hour]}</th>);
		}

		return (
			<table className="table table-responsive table-bordered">
				<thead>
					<tr>
						<td></td>
						{tds}
					</tr>
				</thead>
				<tbody>
					<Day day="Pon" />
				</tbody>
			</table>
		);
	}
}
