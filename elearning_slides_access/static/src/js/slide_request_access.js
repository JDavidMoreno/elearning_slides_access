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
          renderHeader: true,
          renderFooter: false,
          technical: false,
          dialogClass: 'elearning_slides_access_dialog',
      });

      this.categoryId = options.categoryId;
      this._super(parent, options);
    },

    _onCloseDialog: function (ev) {
        ev.stopPropagation();
        var self = this;
        this._rpc({
          model: 'slide.access',
          method: 'request_access',
          args: [this.categoryId]
        }).then(function(res) {
            var a = 33;
            cosole.log(res);
        });
        this.close();
    },

    close: function () {
      this.destroy();
    }
  });

  publicWidget.registry.WebsiteSlidesAccess = publicWidget.Widget.extend({
    selector: '.slide_access_js_slide_request',
    xmlDependencies: ['/elearning_slides_access/static/src/xml/slide_access_request_new.xml'],
    events: {
        'click': '_onRequestAccess',
    },

    _openDialog: function (categoryId) {
        return new SlideAccessDialog(this, {categoryId: categoryId}).open();
    },

    _onRequestAccess: function (ev) {
      ev.preventDefault();
      this._openDialog($(ev.currentTarget).data('categoryId'));
    },
  });

  return {
    WebsiteSlidesAccess: publicWidget.registry.WebsiteSlidesAccess,
    SlideAccessDialog: SlideAccessDialog
  };

});
