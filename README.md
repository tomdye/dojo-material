# dojo-material POC

## Goals

- To implement Dojo widgets adhering to the Material design spec
- To utilise the material design components (MDC) librarty provided by google.
- To use the [MDC foundations and adapters](https://github.com/material-components/material-components-web/blob/master/docs/integrating-into-frameworks.md#the-advanced-approach-using-foundations-and-adapters) to apply appropiate classes and responses to user input and interaction.
- To deliver easy to use, a11y compliant material widgets written in typescript.

## Introduction

This repo contains a POC implementation of `Button`, `Icon`, `FloatingLabel` and `TextField` written in dojo using tsx syntax.

This POC uses the foundation / adapter approach similar to the official [material-components-web-react](https://github.com/material-components/material-components-web-react) implementation. Details of the foundations and adapters can be found [here](https://github.com/material-components/material-components-web/blob/master/docs/integrating-into-frameworks.md#the-advanced-approach-using-foundations-and-adapters).

Widgets utilising this approach must create the required html structure using the documented class names. Each complex component (such as `TextField` or `FloatingLabel`) requires a specific `Foundation` class to be instantiated and passed an `adapter`. The `adapter` provides the `Foundation` class with funcions such as `addClass`, `removeClass` etc and accessors such as `isFocused`, `value` etc... These provide a means for the foundation to respond to inputs and enact change onto the domnodes.

### Adapters

The required mdc adpter varies from component to component. It is an object that provides functions to access and manipulate a component. For example it may have an `addClass` function that when called, should add a class to your widget.

Details of the required adapters for each component are available in each component's documenttation.

Without an adapter, a Foundation class would not be able to interact with your widget.

### Foundations

Mdc Foundation classes exist for each of the more complex components which require changes / interactions to maniupulate the appearance / state of the widget.
They essentially encapsulate the business / display logic of each component such that they can consistently be created in multiple languages.

In some cases, such as `TextField`, the `Foundation` also requires access to the input `domNode`, this is achieved using a simple `meta`.

Simple components such as `Button` do not require a Foundation.

## Implementation

To create `@dojo/material` we should utilise the `foundations` and `adapters` as used within this POC repo.

Material components appear to fall into two categories; simple widgets which require only correct dom elements and class names, and complex input widgets which require the use of `foundations` and `adapters`. These allow the underlying material interaction logic to add / remove classes from your components and show / hide labels / animations etc.

The foundations files do not appear to have typings available so your dojo build may complain when you are using them. We may need to either write dummy / full typigns for these or set our tsconfig to allow js imports for this project.

### Simple widgets

Simple (non input) widgets such as `Button` and `Card` require only appropriate dom elements to be created with material classes applied. A complete description of the required dom and css classes can be found in the documentation for each component, button docs can be found [here](https://github.com/material-components/material-components-web/tree/master/packages/mdc-button).

#### Using material css

We can import the apropriate `material` css by creating an `index.css` file to sit alongside each of our components that imports the appropriate css from `node_modules`.

``` css
/* button/index.css */
@import '~@material/button/dist/mdc.button.css';
```

We then import this css file into our component implementation

```ts
/* button/index.tsx */
import './index.css';
```

In the case of `Button`, the base class is `mdc-button` with longer modifier classes such as `mdc-button--outlined`. As these have hypens etc in them and are outside of our source control we will be unable to use them with `css-modules` and thus the `index.css` file for each component will likely remain empty apart from the material import.

Some more complex widgets contain a `constants` object that _could_ be used to import the css class names, but I have found these class names to be incomplete for some components and did not like the idea of hardcoding some classnames whilst importing others, so I simply hardcoded them all.

### Complex widgets

A complex widget is one that provides a `Foundation` class that contains the components interaction / class application logic. These need to be imported (no typings) and newed up with an `Adapter`. The `Adapter` is an object containing functions that allow the `Foundation` to manipulate and inspect your component.

#### Creating an Adapter

The most basic `Adapter` will have `addClass` / `removeClass` / `hasClass` functions. I've found these best implemented using a `ClassList` `Set` which is used to populate the `root` `classes` object when rendering the component.

```ts
/* text-field/index.tsx */
private classList: new Set<string>();

private _adapter = {
	addClass: (className: string) => {
		this.classList.add(className);
		this.invalidate();
	},
	removeClass: (className: string) => {
		this.classList.delete(className);
		this.invalidate();
	},
	hasClass: (className: string) => {
		return this.classList.has(className);
	}
};

private _foundation = new MDCTextFieldFoundation(this._adapter, {});
```

The `Foundation` must be initialised and destroyed when the component is created and destroyed, this can be done using `onAttach` and `onDetach`.

```ts
protected onAttach() {
	this._foundation.init();
}

protected onDetach() {
	this._foundation.destroy();
}
```

Following this approach, all you need do in the `render` function is `...this.classList` to add the foundation classes to your widget. Please see `text-field/index.tsx` for the full example.

We could create a `BaseWidget` that contains a simple `adapter` as above which would reduce the boiler plate for each component and give us consistency across the library.

#### Providing dom access to adapters

Some adapters, such as the `text-field` adapter require access to the `input` dom node, we can achieve this using a simple `Meta`. I have implemented this as `Node.ts` within this example project as is used as such:

```ts
private _adapter {
	// ...
	getNativeInput: () => {
		return this.meta(Node).get('input');
	},
	// ...
}
```

#### Nesting components

When nesting components, ie. an `Icon` trailing inside a `Text-Field`, material expects you to pass extra classes to the child widget. To implement this quickly I have allowed such widgets to accept a `classes` property that is mixed into their `root` classes at render time. If we were writing full-blown dojo widgets, we would use `ThemedMixin` and `extraClasses` but I thought this to be overkill at this point.

```ts
/* text-field/index.tsx */
render() {
	// ...
	{trailingIcon ? <Icon classes={['mdc-text-field__icon']} icon={trailingIcon} /> : null}
	// ...
}

/* icon/index.tsx */
render() {
	const {
		icon,
		classes = []
	} = this.properties;

	return (
		<i classes={[ 'material-icons', ...classes ]}>
			{icon}
		</i>
	);
}
```

### Ripple components

Ripple is a visual effect used throughout the material component library to animate ui elements in response to user interaction. The mdc react implementation utilises a HOC to achieve this by wrapping each component that requires a ripple effect before rendering it.

I have started to investigate how we should do this in our Dojo material library and believe it could be done using an outer widget that `decorate`s it's children. This should be done within the widget so the user does not have to manually create a `Ripple` widget.

```ts
render() {
	// ...
	if (this.properties.ripple) {
		return (
			<Ripple target="targetKey">
			   { myWidgetRoot }
			</Ripple>
		);
	} else {
		return myWidgetRoot;
	}
}

```

## Theming and CSS

The `@material/mdc` project uses `SCSS` extensively and is compiled to `css` with bullet-proofed `css-variables`. This means that the `SCSS-variables` used within the styles are baked into the generated `css` with a `css-variable` directly afterwards as a fall back.

Due to this, we can override the compiled colours etc with our own `css-variables`. For example:

``` css
/* button.css */
@import '@material/button/dist/mdc.button.css';

/* after importing the css, override the variables */
:root {
	--mdc-theme-primary: red;
}

/* the button will now render red */
```

## Bulding the library

Currently this POC is built as an app using the `dojo build app` cli command. For this to be a published package that developers can install and use it will need to have a build pipeline created similar to that of `@dojo/widgets`.

## Next steps

- Bring the components in line with `a11y` etc offerings in `@dojo/widgets`
- Abstract out common parts such as base adapters
- Create further components to complete the library: `Card` / `Select` etc...
- Investigate feasibility of `ripple` implementation
