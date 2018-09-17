import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';

export interface IconProperties {
	icon: string;
	classes?: string[];
}

export class Icon extends WidgetBase<IconProperties> {
	protected render() {
		const {
			icon,
			classes = []
		} = this.properties;

		return (
			<i
				classes={[ 'material-icons', ...classes ]}
			>
				{icon}
			</i>
		);
	}
}

export default Icon;
