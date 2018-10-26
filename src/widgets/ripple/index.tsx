import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import './index.css';
const { default: MDCRippleFoundation } = require('@material/ripple/foundation');

export class Ripple extends WidgetBase<any> {


// const withRipple = (WrappedComponent) => {
// 	class RippledComponent extends Component {

		private _foundation = new MDCRippleFoundation(this.adapter, {});

		isMounted_ = true;

		state = {
			classList: new Set(),
			style: {},
		};

		componentDidMount() {
			if (!this._foundation) {
				throw new Error('You must call initRipple from the element\'s ' +
					'ref prop to initialize the adapter for withRipple');
			}
		}

		componentWillUnmount() {
			if (this._foundation) {
				this.isMounted_ = false;
				this._foundation.destroy();
			}
		}

		// surface: This element receives the visual treatment (classes and style) of the ripple.
		// activator: This element is used to detect whether to activate the ripple. If this is not
		// provided, the ripple surface will be used to detect activation.
		initializeFoundation_ = (surface, activator) => {
			const adapter = this.createAdapter_(surface, activator);
			this._foundation = new MDCRippleFoundation(adapter);
			this._foundation.init();
		}

		createAdapter_ = (surface, activator) => {
			const MATCHES = util.getMatchesProperty(HTMLElement.prototype);

			return {
				browserSupportsCssVars: () => util.supportsCssVariables(window),
				isUnbounded: () => this.properties.unbounded,
				isSurfaceActive: () => activator ? activator[MATCHES](':active') : surface[MATCHES](':active'),
				isSurfaceDisabled: () => this.properties.disabled,
				addClass: (className) => {
					if (!this.isMounted_) {
						return;
					}
					this.setState({classList: this.state.classList.add(className)});
				},
				removeClass: (className) => {
					if (!this.isMounted_) {
						return;
					}

					const {classList} = this.state;
					classList.delete(className);
					this.setState({classList});
				},
				registerDocumentInteractionHandler: (evtType, handler) =>
					document.documentElement.addEventListener(evtType, handler, util.applyPassive()),
				deregisterDocumentInteractionHandler: (evtType, handler) =>
					document.documentElement.removeEventListener(evtType, handler, util.applyPassive()),
				registerResizeHandler: (handler) => window.addEventListener('resize', handler),
				deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
				updateCssVariable: this.updateCssVariable,
				computeBoundingRect: () => {
					if (!this.isMounted_) {
						// need to return object since foundation expects it
						return {};
					}
					if (this.properties.computeBoundingRect) {
						return this.properties.computeBoundingRect(surface);
					}
					return surface.getBoundingClientRect();
				},
				getWindowPageOffset: () => ({x: window.pageXOffset, y: window.pageYOffset}),
			};
		}

		handleFocus = (e) => {
			this.properties.onFocus(e);
			this._foundation.handleFocus();
		}

		handleBlur = (e) => {
			this.properties.onBlur(e);
			this._foundation.handleBlur();
		}

		handleMouseDown = (e) => {
			this.properties.onMouseDown(e);
			this.activateRipple(e);
		}

		handleMouseUp = (e) => {
			this.properties.onMouseUp(e);
			this.deactivateRipple(e);
		}

		handleTouchStart = (e) => {
			this.properties.onTouchStart(e);
			this.activateRipple(e);
		}

		handleTouchEnd = (e) => {
			this.properties.onTouchEnd(e);
			this.deactivateRipple(e);
		}

		handleKeyDown = (e) => {
			this.properties.onKeyDown(e);
			this.activateRipple(e);
		}

		handleKeyUp = (e) => {
			this.properties.onKeyUp(e);
			this.deactivateRipple(e);
		}

		activateRipple = (e) => {
			// https://reactjs.org/docs/events.html#event-pooling
			e.persist();
			requestAnimationFrame(() => {
				this._foundation.activate(e);
			});
		}

		deactivateRipple = (e) => {
			this._foundation.deactivate(e);
		}

		updateCssVariable = (varName, value) => {
			if (!this.isMounted_) {
				return;
			}

			const updatedStyle = Object.assign({}, this.state.style);
			updatedStyle[varName] = value;
			this.setState({style: updatedStyle});
		}

		get classes() {
			const {className: wrappedComponentClasses} = this.props;
			const {classList} = this.state;
			return classnames(Array.from(classList), wrappedComponentClasses);
		}

		get style() {
			const {style: wrappedStyle} = this.props;
			const {style} = this.state;
			return Object.assign({}, style, wrappedStyle);
		}

		render() {
			const {
				/* start black list of otherprops */
				/* eslint-disable */
				unbounded,
				style,
				className,
				onMouseDown,
				onMouseUp,
				onTouchStart,
				onTouchEnd,
				onKeyDown,
				onKeyUp,
				onFocus,
				onBlur,
				/* eslint-enable */
				/* end black list of otherprops */
				...otherProps
			} = this.props;

			const updatedProps = Object.assign(otherProps, {
				onMouseDown: this.handleMouseDown,
				onMouseUp: this.handleMouseUp,
				onTouchStart: this.handleTouchStart,
				onTouchEnd: this.handleTouchEnd,
				onKeyDown: this.handleKeyDown,
				onKeyUp: this.handleKeyUp,
				onFocus: this.handleFocus,
				onBlur: this.handleBlur,
				// call initRipple on ref on root element that needs ripple
				initRipple: this.initializeFoundation_,
				className: this.classes,
				style: this.style,
			});

			return <WrappedComponent {...updatedProps} />;
		}
	}

	// WrappedComponent.propTypes = Object.assign({
	// 	unbounded: PropTypes.bool,
	// 	disabled: PropTypes.bool,
	// 	style: PropTypes.object,
	// 	className: PropTypes.string,
	// 	onMouseDown: PropTypes.func,
	// 	onMouseUp: PropTypes.func,
	// 	onTouchStart: PropTypes.func,
	// 	onTouchEnd: PropTypes.func,
	// 	onKeyDown: PropTypes.func,
	// 	onKeyUp: PropTypes.func,
	// 	onFocus: PropTypes.func,
	// 	onBlur: PropTypes.func,
	// }, WrappedComponent.propTypes);

	// WrappedComponent.defaultProps = Object.assign({
	// 	unbounded: false,
	// 	disabled: false,
	// 	style: {},
	// 	className: '',
	// 	onMouseDown: () => {},
	// 	onMouseUp: () => {},
	// 	onTouchStart: () => {},
	// 	onTouchEnd: () => {},
	// 	onKeyDown: () => {},
	// 	onKeyUp: () => {},
	// 	onFocus: () => {},
	// 	onBlur: () => {},
	// }, WrappedComponent.defaultProps);

	// RippledComponent.propTypes = WrappedComponent.propTypes;
	// RippledComponent.defaultProps = WrappedComponent.defaultProps;
	// RippledComponent.displayName = `WithRipple(${getDisplayName(WrappedComponent)})`;

	// return RippledComponent;
}

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// export default withRipple;
