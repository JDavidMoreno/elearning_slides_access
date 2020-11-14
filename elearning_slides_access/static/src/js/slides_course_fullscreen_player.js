odoo.define('elearning_slides_access.fullscreen', function (require) {
  'use strict';

  var core = require('web.core');
  var FullScreen = require('website_slides.fullscreen');
  var { SlideAccessDialog } = require('elearning_slides_access.slide_request_access');
  var _t = core._t;

  FullScreen.include({
    events: {
      "click .o_wslides_fs_toggle_sidebar": '_onClickToggleSidebar',
      "click .slide_access_js_slide_request_full": '_onRequestAccess',
    },
    xmlDependencies: ['/elearning_slides_access/static/src/xml/slide_access_request_new.xml'],

    _openRequestDialog: function (keyButton) {
      return new SlideAccessDialog(this, {keyButton: keyButton}).open();
    },

    _onRequestAccess: function (ev) {
      ev.preventDefault();
      var keyButton = $(ev.currentTarget);
      var self = this;
      this._rpc({
        model: 'slide.access',
        method: 'request_access',
        args: [keyButton.data('categoryId')]
      }).then(function (res) {
        if (res === false) {
          self.displayNotification({
            type: 'notification',
            title: 'Access Request Failed',
            // subtitle: 'Subtitle',
            message: _t("There was a problem while sending the request for the new course's content." +
              " Please try it later or contact the courses's Administrator if the problem persists."),
            sticky: true
          });
        }
        // $.unblockUI();
      });
      // This is in case we want back the blockUI
      // var defaultBlockUI = $.blockUI.defaults;
      // defaultBlockUI.message = _t("Sending Access Request...");
      // defaultBlockUI.css.color = 'rgb(219, 219, 219)';
      // $.blockUI(defaultBlockUI);
      this._openRequestDialog(keyButton);
    },

    // TODO: For the momemt this will change the icon to the key and enable the pop-up, in the future
    // it should just notify that the request was sent
    _showKey: function (categ_id) {
      var next_section = $(`a[data-category-id=${categ_id}]`);
      next_section.addClass('slide_access_js_slide_request_full');
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