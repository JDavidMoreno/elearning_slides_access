odoo.define('elearning_slides_access.slide_request_access', function (require) {
  "use strict";

  var core = require('web.core');
  var publicWidget = require('web.public.widget');
  var Dialog = require('web.Dialog');
  // var session = require('web.session');

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
          this.keyButton.removeClass('slide_access_js_slide_request').addClass('slide_access_blocking_icons');
          keyIcon.removeClass('fa-key').addClass('fa-clock-o');
        }
        this.close();
    },

    close: function () {
      this.parent.destroy();
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
      }).then(function(res) {
          var a = 33;
          console.log(res);
          self._openDialog(keyButton);
      }).catch(function (reason){
        var error = reason.message;
        console.warn('Failed to send a Course access request');
        throw error;
    });
    },
  });

  return {
    WebsiteSlidesAccess: publicWidget.registry.WebsiteSlidesAccess,
    SlideAccessDialog: SlideAccessDialog
  };

});
