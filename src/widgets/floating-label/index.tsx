import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import './index.css';
import Set from '@dojo/framework/shim/Set';
const { default: MDCFloatingLabelFoundation } = require('@material/floating-label/foundation');

export interface FloatingLabelProperties {
	float?: boolean;
}

export class FloatingLabel extends WidgetBase<FloatingLabelProperties> {

	private _state = {
		classList: new Set<string>()
	};

	private _adapter = {
		addClass: (className: string) => {
			this._state.classList.add(className);
			this.invalidate();
		},
		removeClass: (className: string) => {
			this._state.classList.delete(className);
			this.invalidate();
		}
	}

	private _foundation = new MDCFloatingLabelFoundation(this._adapter);

	onAttach() {
		this._foundation.init();

		if (this.properties.float) {
			this._foundation.float(true);
		}
	}

	onDetach() {
		this._foundation.destroy();
	}

	render() {
		const {
			float
		} = this.properties;

		this._foundation && this._foundation.float(float);

		const classes: (string|undefined)[] = [
			'mdc-floating-label',
			...this._state.classList
		];

		return (
			<label
				classes={classes}
			>
				{this.children}
			</label>
		);
	}
}

export default FloatingLabel;
