import {Data} from "./Data";

export class TimeSeries extends Data{
	#values;
	#labels;
	constructor(values, labels){
		super();
		if(values === undefined || labels === undefined ||
			!Array.isArray(values) || !Array.isArray(labels)){
			throw new Error('Values and labels must be defined arrays!');
		}
		if(values.length !== labels.length){
			throw new Error('Each value must be assigned to a label!');
		}
		for(let value of values){
			if(typeof value !== 'number'){
				throw new Error('TimeSeries values must be numbers!');
			}
		}
		this.#values = values;
		this.#labels = labels;
	}

	get labels(){
		return [...this.#labels];
	}

	get values(){
		return [...this.#values];
	}

	toString(){
		let result = '';
		for (let i = 0; i < this.#values.length; i++) {
			result += this.#labels[i]+" : "+this.#values[i]+"\n";			
		}
		return result;
	}
}