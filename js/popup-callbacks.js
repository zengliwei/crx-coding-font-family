window['popupCallbacks'] = {

    getLocation: function () {
        return window.location;
    },

    updateSelector: function (selector) {
        if (selector !== '') {
            clearTimeout(time);
            let query = {};
            query[storageKey] = selector;
            window['jQuery'](selector).css('font-family', fontFamily);
            window['chrome']['storage']['local'].set(query);
        }
    }

};