csswizardry-grids-ie7-polyfill
==============================

This polyfill will allow the CSS Wizardry Grid to run in IE7.

This polyfill was heavily influenced and uses code modified from the box-sizing-polyfill.js project.
More info about the box-sizing-polyfill plugin can be found at:

[https://github.com/Schepp/box-sizing-polyfill](https://github.com/Schepp/box-sizing-polyfill)

In order to get this to work in the CSSWizardyGrid you will need to modify the SASS code for the grid__item so that the display attribute uses an inline-block mixin to mbe able to approximate an inline-block display type in ie7.

Use your own inline block mixin or you can use the one I usually use which is as follows:

    @mixin inline-block($minHeight: null) {
        display:inline-block;
        *zoom:1;
        *display:inline;
        @if $minHeight != null {
            *min-height: $minHeight;
            _height: $minHeight;
        }
    }

Using the above mixin, you would rewrite the grid__item as follows:

    #{$class-type}grid__item{
        @include inline-block;          /* [1] */
        padding-left:$gutter;           /* [2] */
        vertical-align:top;             /* [3] */
        @if $mobile-first == true{
            width:100%;                 /* [4] */
        }
        -webkit-box-sizing:border-box;  /* [5] */
           -moz-box-sizing:border-box;  /* [5] */
                box-sizing:border-box;  /* [5] */
        @if $use-markup-fix != true{
            letter-spacing:normal;
            word-spacing:normal;
        }
    }

To use this polyfill, you simply need to include the following on the page after the jQuery include:

    <!--[if IE 7]>
	    <script type="text/javascript" src="csswizardy-grids-ie7-polyfill.js"></script>
    <![endif]-->

Including this polyfill, along with updating the SASS for the display property of the grid__item using the inline-block mixin will add ie7 support to the CssWizardryGrid.

