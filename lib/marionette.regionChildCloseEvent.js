/* # marionette.regionChildCloseEvent

Brought to you by [Use All Five, Inc.](http://www.useallfive.com)

```
Author: Justin Anastos <janastos@useallfive.com>
Author URI: [http://www.useallfive.com](http://www.useallfive.com)
Repository: https://github.com/UseAllFive/marionette.regionChildCloseEvent
```

Have regions fire an event `child:view:closed` when a child view is closed.

 */

// ## Factory
// Be compatible with requirejs.
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['marionette'], factory);
    } else {
        /*global Marionette */
        factory(Marionette);
    }
}(function(Marionette) {
    var onViewClosed;
    var originalClose;
    var originalShow;

    // Save the original Marionette `close` and `show` functions.
    originalClose = Marionette.Region.prototype.close;
    originalShow = Marionette.Region.prototype.show;

    // ## onViewClosed
    // Define handler for when a region's child view is closed.
    onViewClosed = function(event) {
        // A child view was closed. Trigger an event.
        this.trigger('child:view:closed', this);
    };

    // ## Marionette.Region.prototype.show
    Marionette.Region.prototype.show = function(view) {
        var returnValue;

        // Call the original function.
        returnValue = originalShow.apply(this, arguments);

        // Wrap custom functionality in a `try` block because it should never
        // fail. We cannot anticipate interactions with other plugins/
        // overrides or internal Marionette changes; so always wrap custom
        // functionality in a `try` block.
        try {
            // If there is already a current view stored, then stop listening for
            // it's close event.
            if (this.currentView) {
                this.stopListening(this.currentView, 'close', onViewClosed);
            }

            // Listen for when the view is closed.
            this.listenTo(this.currentView, 'close', onViewClosed);
        } catch (error) {
            // There was an error. Alert the user.
            /*jshint devel: true */
            console.warn(error);
        } finally {
            // Return whatever the original function returned. This return will
            // override any returns in the `try` or `catch` blocks.
            return returnValue;
        }
    };

    // ## Marionette.Region.prototype.close
    Marionette.Region.prototype.close = function() {
        var returnValue;

        // Call the original function.
        returnValue = originalClose.apply(this, arguments);

        // Wrap custom functionality in a `try` block because it should never
        // fail. We cannot anticipate interactions with other plugins/
        // overrides or internal Marionette changes; so always wrap custom
        // functionality in a `try` block.
        try {
            this.stopListening(this.currentView, 'close', onViewClosed);
        } catch (error) {
            // There was an error. Alert the user.
            /*jshint devel: true */
            console.warn(error);
        } finally {
            // Return whatever the original function returned. This return will
            // override any returns in the `try` or `catch` blocks.
            return returnValue;
        }
    };

    return Marionette;
}));
