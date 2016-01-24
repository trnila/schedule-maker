import React from 'react';
import Select from 'react-select';
require('react-select/scss/default.scss');

export default class extends React.Component {
	static propTypes = {
		subjects: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			abbr: React.PropTypes.string.isRequired,
			id: React.PropTypes.any.isRequired
		})).isRequired,
		onSubjectsChange: React.PropTypes.func
	};

	static defaultProps = {
		onSubjectChange: function(){}
	};

	constructor(props) {
		super(props);
		this.state = {
			selected: this.getSelectedSubjects()
		};
	}

	componentDidMount() {
		this.props.onSubjectChange(this.getSelectedSubjects());
	}

	getSelectedSubjects() {
		return typeof(localStorage.subjects) == "string" ? localStorage.subjects.split(",") : [];
	}

	saveSubjects(subjects) {
		localStorage.subjects = subjects;
		this.props.onSubjectChange(subjects);
	}

	render() {
		function onChange(val) {
			this.setState((state) => {
				state.selected = val.map((item) => {
					return item.value;
				});
				this.saveSubjects(state.selected);
				return state;
			});
		}

		return <div className="subject-selector">
			<Select options={this.props.subjects.map((i) => {return {value: i.id, label: i.name + "(" + i.abbr + ")" +
			 ""};})}
					value={this.state.selected}
					multi={true}
					placeholder="Předměty v rozvrhu"
					onChange={onChange.bind(this)} />
		</div>
	}
}
