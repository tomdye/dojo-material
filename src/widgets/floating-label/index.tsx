import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import './index.css';
import {MDCFloatingLabelFoundation} from '@material/floating-label/dist/mdc.floatingLabel';

export interface FloatingLabelProperties {
	float?: boolean;
}

export class FloatingLabel extends WidgetBase<FloatingLabelProperties> {

	private _foundation = new MDCFloatingLabelFoundation(this.adapter);
	private state = {
		classList: new Set<string>()
	};

	onAttach() {
		this._foundation.init();

		if (this.properties.float) {
			this._foundation.float(true);
		}
	}

	onDetach() {
		this._foundation.destroy();
	}

	get adapter() {
		return {
			addClass: (className: string) => {
				this.state.classList.add(className);
				this.invalidate();
			},
			removeClass: (className: string) => {
				this.state.classList.delete(className);
				this.invalidate();
			}
		};
	}

	render() {
		const {
			float,
			...otherProps
		} = this.properties;

		this._foundation && this._foundation.float(float);

		const classes: any = [
			'mdc-floating-label',
			...Array.from(this.state.classList)
		];

		return (
			<label
				classes={classes}
				{...otherProps}
			>
				{this.children}
			</label>
		);
	}
}

export default FloatingLabel;
