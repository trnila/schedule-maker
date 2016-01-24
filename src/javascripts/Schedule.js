'use strict';
import React from 'react';
import request from 'superagent';
import Subjects from './Subjects';

let days = ['Po', 'Ut', 'St', 'Ct'];

class Class extends React.Component {
	static propTypes = {
		id: React.PropTypes.string.isRequired,
		start: React.PropTypes.number.isRequired,
		len: React.PropTypes.number.isRequired,
		name: React.PropTypes.string.isRequired,
		lectors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	};

	onClick() {
		this.props.onSubjectSelect(this.props.name, this.props.id, !this.props.selected);
	}

	onHighlight(e) {
		e.preventDefault()
		this.props.onHighlightSubject(this.props.name);
	}

	render() {
		function getClass(hour) {
			var result = ['occupied'];

			if(!hour.lectors) {
				result.push('empty');
			} else {
				result.push(hour.id.startsWith('P') ? 'lecture' : 'class');
			}

			if(hour.selected) {
				result.push('selected');
			}

			if(hour.highlighted) {
				result.push('highlighted');
			}

			return result;
		}

		return (
		<td colSpan={this.props.len}
		    className={getClass(this.props).join(' ')}
		    onClick={this.onClick.bind(this)}
		    onContextMenu={this.onHighlight.bind(this)}
		>
				{this.props.name}
				<small className="pull-right">{this.props.lectors}</small>
		</td>);
	}
}

class Row extends React.Component {
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
							   start={hour.start}
						       len={hour.len}
						       name={hour.name}
						       lectors={hour.lectors ? hour.lectors : []}
						       selected={this.props.selected.filter((i) => {return i.subjectId == hour.name && i.id == hour.id;}).length}
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

export default class extends React.Component {
	static propTypes = {
		subjects: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	};

	constructor(props) {
		super(props);
		
		var selected = [];
		if(document.location.hash.length > 1) {
			selected = document.location.hash.substr(1).split(";").map((i) => {
				var parts = i.split('|');
				return {
					subjectId: parts[0],
					id: parts[1]
				};
			});
		}

		if(!selected.length) {
			selected = localStorage.selected ? JSON.parse(localStorage.selected) : []
		}

		this.state = {
			days: [[], [], [], [], [], []],
			highlighted: null,
			selected: selected
		};
	}

	componentWillReceiveProps(props) {
		this.setSubjects(props.subjects);
	}

	clear() {
		this.setState((state) => {
			state.days = [[], [], [], [], [], []];
			return state;
		});
	}

	addSubject(subjectId, id, selected) {
		this.setState((state) => {
			if(selected) {
				if(!state.selected.filter((i) => {return i.subjectId == subjectId && i.id == id;}).length) {
					state.selected.push({subjectId: subjectId, id: id});
				}
			} else {
				var i;
				for(i in state.selected) {
					if(state.selected[i].subjectId == subjectId && state.selected[i].id == id) {
						break;
					}
				}

				if(i > -1) {
					state.selected.splice(i, 1);
				}
			}

			localStorage.selected = JSON.stringify(state.selected);

			window.location.hash = '#' + state.selected.map((i) => {
				return i.subjectId + '|' + i.id;
			}).join(';');

			return state;
		});
	}

	onHighlightSubject(subject) {
		this.setState((state) => {
			state.highlighted = state.highlighted == subject ? null : subject;
			return state;
		});
	}

	setSubjects(items) {
		this.clear();

		for(let i in items) {
			request.get('/data/' + items[i] + '.json')
				.end((err, res) => {
					var json = JSON.parse(res.text);
					this.setState((state) => {
						for (let day in json) {
							json[day].name = Subjects.getSubject(items[i]).abbr;
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

		var daysEl = [];
		for(var i = 0; i < days.length; i++) {
			daysEl.push(
				<Day key={i}
				     day={i}
				     hours={this.state.days[i]}
				     selected={this.state.selected}
				     highlighted={this.state.highlighted}
				     onSubjectSelect={this.addSubject.bind(this)}
				     onHighlightSubject={this.onHighlightSubject.bind(this)}
				/>);
		}

		return (
			<div className="schedule table-responsive">
				<table className="table table-bordered table-sm">
					<thead className="thead-default">
						<tr>
							<th></th>
							{tds}
						</tr>
					</thead>

					{daysEl}
				</table>
			</div>
		);
	}
}
