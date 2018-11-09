import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import { Button } from './widgets/button';
import { Icon } from './widgets/icon';
import { TextField } from './widgets/text-field';
import TextInput from '@dojo/widgets/text-input';
import * as inputTheme from './inputTheme.m.css';

const theme = {
	'@dojo/widgets/text-input': inputTheme
};

export class App extends WidgetBase {

	private _textFieldState: { [key: string]: string } = {
		plain: '',
		outlined: '',
		dense: '',
		leading: '',
		trailing: ''
	};

	private _onInput(value: string, key: string) {
		this._textFieldState[key as any] = value;
		this.invalidate();
	}

	protected render() {
		return [
			v('h1', [ 'HELLO WORLD' ]),
			w(Button, {}, ['im a button']),
			w(Button, { href: '#abc' }, ['im a button']),
			w(Button, { dense: true }, ['im a button']),
			w(Button, { outlined: true, onClick: () => { alert('hello') } }, ['im a button']),
			w(Button, { raised: true, icon: w(Icon, { icon: 'edit' }) }, ['im a button']),
			w(Icon, { icon: 'save' }),
			w(TextInput, { theme, value: this._textFieldState.dojo, onInput: (value: string) => { this._onInput(value, 'dojo')}, label: 'dojo' }),
			w(TextField, { value: this._textFieldState.plain, onInput: (value: string) => { this._onInput(value, 'plain') }, label: 'Hello' }),
			w(TextField, { value: this._textFieldState.outlined, onInput: (value: string) => { this._onInput(value, 'outlined') }, label: 'outlined', outlined: true }),
			w(TextField, { value: this._textFieldState.dense, onInput: (value: string) => { this._onInput(value, 'dense') }, label: 'dense', dense: true }),
			w(TextField, { value: this._textFieldState.leading, onInput: (value: string) => { this._onInput(value, 'leading') }, label: 'leading', leadingIcon: 'save' }),
			w(TextField, { value: this._textFieldState.trailing, onInput: (value: string) => { this._onInput(value, 'trailing') }, label: 'trailing', trailingIcon: 'edit' })
		];
	}
}

export default App;
