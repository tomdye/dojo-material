import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import './index.css';

export interface ButtonProperties {
	raised?: boolean;
	unelevated?: boolean;
	outlined?: boolean;
	dense?: boolean;
	disabled?: boolean;
	icon?: any;
	href?: string;
	onclick?: () => void;
}

export class Button extends WidgetBase<ButtonProperties> {
	protected render() {
		const {
			raised,
			unelevated,
			outlined,
			dense,
			icon,
			href,
			disabled,
			...otherProps
		} = this.properties;

		const classes = [
			'mdc-button',
			raised ? 'mdc-button--raised' : null,
			unelevated ? 'mdc-button--unelevated': null,
			outlined ? 'mdc-button--outlined': null,
			dense ? 'mdc-button--dense': null
		];

		const SemanticButton = href ? 'a' : 'button';

		if (icon) {
			icon.properties.classes = [ 'mdc-button__icon' ];
		}

		return (
			<SemanticButton
				classes={classes}
				href={href}
				disabled={disabled}
				{ ...otherProps }
			>
				{icon ? icon : null}
				{this.children}
			</SemanticButton>
		);
	}
}

export default Button;
