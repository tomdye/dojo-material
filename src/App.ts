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
			w(TextField, {}, [ v('input', { value: 'hello world'})])
		];
	}
}

export default App;
