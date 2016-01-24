'use strict';
import React from 'react';
import request from 'superagent';
import Subjects from './../Subjects';
import Day from './Day';
let days = ['Po', 'Ut', 'St', 'Ct'];

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
