'use strict';
import React from 'react';

export default class Class extends React.Component {
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
			    onContextMenu={this.onHighlight.bind(this)}>
				{this.props.name}
				<small className="pull-right">{this.props.lectors}</small>
			</td>);
	}
}
