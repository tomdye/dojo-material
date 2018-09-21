import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import { Button } from './widgets/button';
import { Icon } from './widgets/icon';
import { TextField } from './widgets/text-field';

export class App extends WidgetBase {
	protected render() {
		return [
			v('h1', [ 'HELLO WORLD' ]),
			w(Button, {}, ['im a button']),
			w(Button, { href: '#abc' }, ['im a button']),
			w(Button, { dense: true }, ['im a button']),
			w(Button, { outlined: true, onclick: () => { alert('hello') } }, ['im a button']),
			w(Button, { raised: true, icon: w(Icon, { icon: 'edit' }) }, ['im a button']),
			w(Icon, { icon: 'save' }),
			w(TextField, { label: 'Hello' }),
			w(TextField, { label: 'outlined', outlined: true }),
			w(TextField, { label: 'dense', dense: true }),
			w(TextField, { label: 'leading', leadingIcon: 'save' }),
			w(TextField, { label: 'trailing', trailingIcon: 'edit' })
		];
	}
}

export default App;
