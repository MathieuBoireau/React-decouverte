export class Data{
	constructor(){
		if(this.constructor === Data){
			throw new Error('Data class cannot be instantiated!');
		}
	}
}