odoo.define('elearning_slides_access.slide_request_access', function (require) {
  "use strict";

  var core = require('web.core');
  var publicWidget = require('web.public.widget');
  var Dialog = require('web.Dialog');
  var _t = core._t;

  var SlideAccessDialog = Dialog.extend({
    template: 'elearning.request.access',
    events: {'click.elearning_slides_access_close_button': '_onCloseDialog'},

    init: function (parent, options) {
      options = _.defaults(options || {}, {
        title: _t(""),
        size: 'small',
        buttons: [{
          text: _t('Save'),
          classes: 'btn-primary',
          // click: this._onClickFormSubmit.bind(this)
        }, {
          text: _t('Discard'),
          close: true
        }],
        renderHeader: false,
        renderFooter: false,
        technical: false,
        dialogClass: 'elearning_slides_access_dialog',
      });
      this.keyButton = options.keyButton;
      this.parent = parent;

      this._super(parent, options);
    },

    _onCloseDialog: function (ev) {
      ev.stopPropagation();
      var keyIcon = this.keyButton.children('i.fa-key');
      if (keyIcon) {
        this.keyButton.removeClass('slide_access_js_slide_request').removeClass('slide_access_js_slide_request_full').addClass('slide_access_blocking_icons');
        keyIcon.removeClass('fa-key').addClass('fa-clock-o');
      }
      this.close();
    },

    close: function () {
      // this.parent.destroy();
      this.destroy();

      // window.location.reload();
    }
  });

  publicWidget.registry.WebsiteSlidesAccess = publicWidget.Widget.extend({
    selector: '.slide_access_js_slide_request',
    xmlDependencies: ['/elearning_slides_access/static/src/xml/slide_access_request_new.xml'],
    events: {
      'click': '_onRequestAccess',
    },

    _openDialog: function (keyButton) {
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
      self._openDialog(keyButton);
    },
  });

  return {
    WebsiteSlidesAccess: publicWidget.registry.WebsiteSlidesAccess,
    SlideAccessDialog: SlideAccessDialog
  };

});
