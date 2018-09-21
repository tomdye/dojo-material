# dojo-material POC

## Overview and Approach

This repo contains a POC implementation of `Button`, `Icon`, `FloatingLabel` and `TextField`

This POC uses the foundation / adapter approach similar to the official [material-components-web-react](https://github.com/material-components/material-components-web-react) implementation. Details of the foundations and adapters can be found [here](https://github.com/material-components/material-components-web/blob/master/docs/integrating-into-frameworks.md#the-advanced-approach-using-foundations-and-adapters).

Widgets utilising this approach must create the required html structure using the documented class names. Each complex component (such as `TextField` or `FloatingLabel`) requires a specific `Foundation` class to be instantiated and passed an `adapter`. The `adapter` provides the `Foundation` class with funcions such as `addClass`, `removeClass` etc and accessors such as `isFocused`, `value` etc... These provide a means for the foundation to respond to inputs and enact change onto the domnodes.

In some cases, such as `TextField`, the `Foundation` also requires access to the input `domNode`, this is achieved using a `meta`.

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

## Next steps

- Complete `FloatingLabel` / `TextField`
- Bring the components in line with `a11y` etc offerings in `@dojo/widgets`
- Abstract out common parts such as base adapters
- Create further components to complete the library: `Card` / `Select` etc...
- Investigate feasibility of `ripple` implementation
