odoo.define('elearning_slides_access.fullscreen', function (require) {
    'use strict';

    var FullScreen = require('website_slides.fullscreen');

    FullScreen.include({
        // TODO: For the momemt this will change the icon to the key and enable the pop-up, in the future
        // it should just notify that the request was sent
        _showKey: function (categ_id) {
            var next_section = $(`a[data-category-id=${categ_id}]`);
            next_section.addClass('slide_access_js_slide_request');
            next_section.children('i').removeClass('fa-lock').addClass('fa-key');
        },

        _markAsCompleted: function (slideId, completion) {
            this._super(slideId, completion);
            var self = this;
            this._rpc({
                model: 'slide.slide',
                method: 'is_section_ready',
                args: [slideId]
            }).then(function(res) {
                if (res !== 0) {
                    self._showKey(res);
                }
            });
        },
    });

});