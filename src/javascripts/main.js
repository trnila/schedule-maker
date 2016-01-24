'use strict';
import ReactDOM from 'react-dom';
import React from 'react';
import Schedule from './Schedule/Schedule';
import SubjectSelector from './SubjectSelector';
import subjects from './Subjects';

require('bootstrap/scss/bootstrap.scss');
require('font-awesome/scss/font-awesome.scss');
require('../stylesheets/main.sass');

let div = document.createElement('div');
document.body.appendChild(div);

class App extends React.Component {
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
			selected = localStorage.selectedClasses ? JSON.parse(localStorage.selectedClasses) : []
			this.saveToUrl(selected);
		}

		var subjects = selected.map((i) => {return i.subjectId;}).reduce(function(p, c) {
			if (p.indexOf(c) < 0) p.push(c);
			return p;
		}, []);

		if(!subjects.length) {
			subjects = typeof(localStorage.selectedSubjects) == "string" ? localStorage.selectedSubjects.split(",") : [];
		}

		this.state = {
			selectedSubjects: subjects,
			selectedClasses: selected
		};
	}

	subjectsChanged(subjects) {
		this.setState((state) => {
			state.selectedSubjects = subjects.map((i) => {return i.id;});
			localStorage.selectedSubjects = state.selectedSubjects;
			return state;
		});
	}

	addSubject(subjectId, id, selected) {
		this.setState((state) => {
			if(selected) {
				if(!state.selectedClasses.filter((i) => {return i.subjectId == subjectId && i.id == id;}).length) {
					state.selectedClasses.push({subjectId: subjectId, id: id});
				}
			} else {
				var i;
				for(i in state.selectedClasses) {
					if(state.selectedClasses[i].subjectId == subjectId && state.selectedClasses[i].id == id) {
						break;
					}
				}

				if(i > -1) {
					state.selectedClasses.splice(i, 1);
				}
			}

			localStorage.selectedClasses = JSON.stringify(state.selectedClasses);
			this.saveToUrl(state.selectedClasses);
			return state;
		});
	}

	saveToUrl(selected){
		window.location.hash = '#' + selected.map((i) => {
			return i.subjectId + '|' + i.id;
		}).join(';');
	}

	render() {
		return <div>
			<SubjectSelector subjects={subjects.getSubjects()}
			                 selected={this.state.selectedSubjects}
			                 onSubjectChange={this.subjectsChanged.bind(this)} />
			<Schedule subjects={this.state.selectedSubjects}
			          onSubjectSelect={this.addSubject.bind(this)}
			          selectedClasses={this.state.selectedClasses} />
		</div>;
	}
}

ReactDOM.render(<App/>, div);


