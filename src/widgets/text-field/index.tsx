import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import { Base } from '@dojo/framework/widget-core/meta/Base';
import {MDCTextFieldFoundation} from '@material/textfield/dist/mdc.textfield';
import './index.css';
import { Icon } from '../icon';
import { FloatingLabel } from '../floating-label';

export class Get extends Base {
	public get(key: string | number): any {
		const node = this.getNode(key);
		return node;
	}
}

export interface TextFieldProperties {
	dense?: boolean;
	// floatingLabelClassName?: string;
	fullWidth?: boolean;
	helperText?: any;
	isRtl?: boolean;
	label?: string;
	leadingIcon?: any;
	// lineRippleClassName?: string;
	// notchedOutlineClassName?: string;
	outlined?: boolean;
	textarea?: boolean;
	trailingIcon?: any;
	disabled?: boolean;
}

export class TextField extends WidgetBase<TextFieldProperties> {

	private _foundation = new MDCTextFieldFoundation(this.adapter, {});
	private state = {
		classList: new Set<string>(),
		isFocused: false,
		labelIsFloated: false,
		value: ''
	};

	protected onAttach() {
		this._foundation.init();
	}

	get labelAdapter() {
		return {
			floatLabel: (labelIsFloated: boolean) => {
				console.log('float label called');
				this.state = {
					...this.state,
					labelIsFloated
				};
				this.invalidate();
			},
			hasLabel: () => !!this.properties.label
		};
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
			},
			hasClass: (className: string) => {
				return this.state.classList.has(className);
			},
			isFocused: () => {
				console.log('here');
				return this.state.isFocused;
			},
			...this.labelAdapter,
			...this.inputAdapter
		};
	}

	get inputAdapter() {
		return {
			getNativeInput: () => {
				return this.meta(Get).get('input');
			}
		}
	}

	private _renderIcon(icon: string) {
		// const {disabled} = this.state;
		// Toggling disabled will trigger icon.foundation.setDisabled()
		return (
			<Icon classes={['mdc-text-field__icon']} icon={icon} />
		);
	}

	private renderLabel() {
		const {label} = this.properties;
		// const {inputId} = this.state;
		return (
			<FloatingLabel
			float={this.state.labelIsFloated}
			// handleWidthChange={
			//	 (labelWidth) => this.setState({labelWidth})}
			// ref={this.floatingLabelElement}
			// htmlFor={inputId}
			>
			{label}
			</FloatingLabel>
		);
	}

	protected render() {
		const {
			label,
			fullWidth,
			helperText,
			outlined,
			leadingIcon,
			trailingIcon,
			textarea,
			dense,
			disabled
		} = this.properties;

	// 	const {classList, disabled} = this.state;
		// const {className, dense, outlined, fullWidth, textarea, trailingIcon, leadingIcon} = this.props;
		// return classnames(, Array.from(classList), className, {

		// });

		const classes: any = [
			'mdc-text-field',
			...Array.from(this.state.classList),
			outlined ? 'mdc-text-field--outlined' : undefined,
			textarea ? 'mdc-text-field--textarea' : undefined,
			fullWidth ? 'mdc-text-field--fullwidth' : undefined,
			disabled ? 'mdc-text-field--disabled' : undefined,
			trailingIcon ? 'mdc-text-field--with-trailing-icon' : undefined,
			leadingIcon ? 'mdc-text-field--with-leading-icon' : undefined,
			dense ? 'mdc-text-field--dense' : undefined
		];

		this._foundation.setValue(this.state.value);

		return (
			<div
			// {...this.otherProps}
			classes={classes}

			key='text-field-container'
			>
				{leadingIcon ? this._renderIcon(leadingIcon) : null}
				<input key="input" classes="mdc-text-field__input" onfocus={
					() => {
						this.state = {
							...this.state,
							isFocused: true
						};
						console.log('focused');
						this.invalidate();
					}
				} oninput={
					(e: any) => {

						this.state = {
							...this.state,
							value: e.target.value
						};
						console.log('value changed');
						this.invalidate();
					}
				} onclick={() => this._foundation && this._foundation.handleTextFieldInteraction()}
				onkeydown={() => this._foundation && this._foundation.handleTextFieldInteraction()}/>
				{label && !fullWidth ? this.renderLabel() : null}
				{/* {outlined ? this.renderNotchedOutline() : null} */}
				{/* {!fullWidth && !textarea && !outlined ? this.renderLineRipple() : null} */}
				{trailingIcon ? this._renderIcon(trailingIcon) : null}
			</div>
		);
	}
}

export default TextField;
