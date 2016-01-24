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

	render() {
		function onChange(val) {
			this.props.onSubjectChange(val);
			this.refs.selector.closeMenu();
		}

		function onInputChange(value) {
			if(!value) {
				this.refs.selector.closeMenu();
			}
		}

		function valueRenderer(subject) {
			return subject.abbr;
		};

		var options = this.props.subjects.map((i) => {
			i.label = `${i.id} ${i.name} (${i.abbr})`;
			i.value = i.id;
			return i;
		});

		return <div className="subject-selector">
			<Select ref="selector"
			        onInputChange={onInputChange.bind(this)}
			        options={options}
					value={this.props.selected}
					multi={true}
					valueRenderer={valueRenderer}
			        placeholder="Předměty v rozvrhu"
					onChange={onChange.bind(this)} />
		</div>
	}
}
