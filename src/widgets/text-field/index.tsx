import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import * as MDCTextFieldFoundation from '@material/textfield/dist/mdc.textfield';
import './index.css';
import { Icon } from '../icon';

export interface TextFieldProperties {
	dense?: boolean;
	floatingLabelClassName?: string;
	fullWidth?: boolean;
	helperText?: any;
	isRtl?: boolean;
	label?: string;
	leadingIcon?: any;
	lineRippleClassName?: string;
	notchedOutlineClassName?: string;
	outlined?: boolean;
	textarea?: boolean;
	trailingIcon?: any;
	disabled?: boolean;
}

export class TextField extends WidgetBase<TextFieldProperties> {

	private _foundation: any;
	private state = {
		classList: new Set<string>(),
		isFocused: false
	};

	protected addClass(className: string) {
		this.state.classList.add(className);
		this.invalidate();
	}

	protected removeClass(className: string) {
		this.state.classList.delete(className);
		this.invalidate();
	}

	protected hasClass(className: string) {
		return this.state.classList.has(className);
	}

	protected onAttach() {
		this._foundation = new MDCTextFieldFoundation(this.adapter, {});
		this._foundation.init();
	}

	get adapter() {
		const rootAdapterMethods = {
			addClass: this.addClass,
			removeClass: this.removeClass,
			hasClass: this.hasClass,
			isFocused: () => this.state.isFocused
			// ,
			// isRtl: () => this.properties.isRtl
		};

		// return Object.assign({},
	//	 rootAdapterMethods,
	//	 this.inputAdapter,
	//	 this.labelAdapter,
	//	 this.lineRippleAdapter,
	//	 this.notchedOutlineAdapter,
		// );
		return {
			...rootAdapterMethods
		};
	}

	private _renderIcon(icon: string) {
		// const {disabled} = this.state;
		// Toggling disabled will trigger icon.foundation.setDisabled()
		return (
			<Icon icon={icon} />
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

		const classes = [
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

		const textField = (
			<div
			// {...this.otherProps}
			classes={classes}
			onClick={() => this._foundation && this._foundation.handleTextFieldInteraction()}
			onKeyDown={() => this._foundation && this._foundation.handleTextFieldInteraction()}
			key='text-field-container'
			>
				{leadingIcon ? <Icon icon={leadingIcon} /> : null}
				{this.children}
				{/* {label && !fullWidth ? this.renderLabel() : null} */}
				{/* {outlined ? this.renderNotchedOutline() : null} */}
				{/* {!fullWidth && !textarea && !outlined ? this.renderLineRipple() : null} */}
				{trailingIcon ? <Icon icon={trailingIcon} /> : null}
			</div>
		);

		// if (helperText) {
		// 	return ([
		// 	textField, this.renderHelperText(),
		// 	]);
		// }
		return textField;
	}
}

export default TextField;
