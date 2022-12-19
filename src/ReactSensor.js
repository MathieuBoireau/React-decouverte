import './App.css';
import styles from './ReactSensor.module.css';
import React from 'react';

export class ReactSensor extends React.Component {
	valueToImg(type, value, unite) {
		const tabValueToImg = {
			'Door':{ 0: '../door_closed.jpeg', 1: '../door_opened.jpeg' }
		}

		let returnedValue;
		if(tabValueToImg[type] !== undefined && tabValueToImg[type][value] !== undefined){
			returnedValue = (<img src={tabValueToImg[type][value]} alt={tabValueToImg[type][value]} className={styles.icon} />)
		}else{
			returnedValue = value+' '+unite;
		}
		return returnedValue;
	}

	render() {
		let name  = this.props.name;
		let value = this.props.data.value;
		let unite = this.props.unite;
		value = this.valueToImg(this.props.type, value, unite);

		let valuesIfExist = '';
		if(this.props.data.values !== undefined){
			value = this.valueToImg(this.props.type, this.props.data.values[this.props.data.values.length-1], unite);

			const values = [];
			for (let i = this.props.data.values.length-1; i >= 0; i--) {
				if(this.props.data.labels[i] === undefined){
					break;
				}
				const date = new Date(this.props.data.labels[i]);
				const newValue = this.valueToImg(this.props.type, this.props.data.values[i], unite);
				values.push(<tr key={this.props.data.labels[i]}>
					<td>{date.toLocaleTimeString()+' ('+date.toLocaleDateString()+')'}</td>
					<td className={styles['important-values']}>{newValue}</td>
				</tr>)
			}

			if(values.length > 0){
				valuesIfExist = <div className='content-space container-not-center'>
						<span className={styles['name-result']}>Historique :</span>
						<table className={[styles.result, styles['table-history']].join(' ')}>
							<tbody>{values}</tbody>
						</table>
					</div>;
			}
		}

		return (
			<div className={['flex-container column', styles['div-results']].join(' ')}>
				<span className={['content-space', 'name-sensor', styles['name-sensor']].join(' ')}>{name}</span>
				<div className='flex-container column content-space container-not-center'>
					<span className={styles['name-result']}>Valeur actuelle :</span>
					<span className={[styles.result, styles['main-result']].join(' ')}>{value}</span>
				</div>
				{valuesIfExist}
			</div>
		)
	}
}