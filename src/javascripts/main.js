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
		this.state = {
			selectedSubjects: []
		};
	}

	subjectsChanged(subjects) {
		this.setState((state) => {
			state.selectedSubjects = subjects;
			return state;
		});
	}

	render() {
		return <div>
			<SubjectSelector subjects={subjects.getSubjects()} onSubjectChange={this.subjectsChanged.bind(this)} />
			<Schedule subjects={this.state.selectedSubjects} />
		</div>;
	}
}

ReactDOM.render(<App/>, div);


