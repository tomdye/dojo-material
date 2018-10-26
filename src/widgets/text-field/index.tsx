import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import MDCTextFieldFoundation from '@material/textfield/foundation';
import Set from '@dojo/framework/shim/Set';
import './index.css';
import { Icon } from '../icon';
import { FloatingLabel } from '../floating-label';
import { Node } from '../Node';

export interface TextFieldProperties {
	dense?: boolean;
	fullWidth?: boolean;
	helperText?: any;
	isRtl?: boolean;
	label?: string;
	leadingIcon?: any;
	outlined?: boolean;
	textarea?: boolean;
	trailingIcon?: any;
	disabled?: boolean;
	value: string;
	onInput(value: string): void;
}

export class TextField extends WidgetBase<TextFieldProperties> {

	private _state = {
		classList: new Set<string>(),
		isFocused: false,
		labelIsFloated: false
	};

	private _adapter = {
		addClass: (className: string) => {
			this._state.classList.add(className);
			this.invalidate();
		},
		removeClass: (className: string) => {
			this._state.classList.delete(className);
			this.invalidate();
		},
		hasClass: (className: string) => {
			return this._state.classList.has(className);
		},
		isFocused: () => {
			return this._state.isFocused;
		},
		getNativeInput: () => {
			return this.meta(Node).get('input');
		},
		floatLabel: (labelIsFloated: boolean) => {
			this._state = {
				...this._state,
				labelIsFloated
			};
			this.invalidate();
		},
		hasLabel: () => !!this.properties.label
	}

	private _foundation = new MDCTextFieldFoundation(this._adapter, {});

	protected onAttach() {
		this._foundation.init();
	}

	protected onDetach() {
		this._foundation.destroy();
	}

	private renderLabel() {
		const {label} = this.properties;

		return (
			<FloatingLabel float={this._state.labelIsFloated}>
				{label}
			</FloatingLabel>
		);
	}

	private _onFocus() {
		this._state = {
			...this._state,
			isFocused: true
		};
		this.invalidate();
	}

	private _onInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		this.properties.onInput && this.properties.onInput(value);
	}

	private _onClick() {
		this._foundation && this._foundation.handleTextFieldInteraction()
	}

	private _onKeyDown() {
		this._foundation && this._foundation.handleTextFieldInteraction()
	}

	protected render() {
		const {
			label,
			fullWidth,
			outlined,
			leadingIcon,
			trailingIcon,
			textarea,
			dense,
			disabled,
			value = ''
		} = this.properties;

		const classes: (string|undefined)[] = [
			'mdc-text-field',
			...this._state.classList,
			outlined ? 'mdc-text-field--outlined' : undefined,
			textarea ? 'mdc-text-field--textarea' : undefined,
			fullWidth ? 'mdc-text-field--fullwidth' : undefined,
			disabled ? 'mdc-text-field--disabled' : undefined,
			trailingIcon ? 'mdc-text-field--with-trailing-icon' : undefined,
			leadingIcon ? 'mdc-text-field--with-leading-icon' : undefined,
			dense ? 'mdc-text-field--dense' : undefined
		];

		this._foundation.setValue(value);

		return (
			<div
				classes={classes}
				key='text-field-container'
			>
				{leadingIcon ? <Icon classes={['mdc-text-field__icon']} icon={leadingIcon} /> : null}
				<input key="input"
					classes="mdc-text-field__input"
					onfocus={this._onFocus}
					oninput={this._onInput }
					onclick={this._onClick}
					onkeydown={this._onKeyDown}
				/>
				{label && !fullWidth ? this.renderLabel() : null}
				{trailingIcon ? <Icon classes={['mdc-text-field__icon']} icon={trailingIcon} /> : null}
			</div>
		);
	}
}

export default TextField;
