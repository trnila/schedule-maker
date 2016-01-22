import data from './subjects';

export default {
	getSubjects() {
		return data;
	},
	getSubject(id) {
		for(let i in data) {
			if(data[i].id == id) {
				return data[i];
			}
		}
		return null;
	}
};
