import {Data} from "./Data";

export class Datum extends Data{
	#value;
	constructor(value){
		super();
		if(value === undefined){
			throw new Error('Value must be defined!');
		}
		if(typeof value !== 'number'){
			throw new Error('Datum value must be a number');
		}
		this.#value = value;
	}

	get value(){
		return this.#value;
	}

	toString(){
		return ""+this.#value;
	}
}