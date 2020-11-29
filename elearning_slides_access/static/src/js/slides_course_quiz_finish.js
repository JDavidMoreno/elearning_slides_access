odoo.define('website_slides.quiz.finish.extended', function (require) {
  'use strict';

  var ajax = require('web.ajax');
  var core = require('web.core');
  var qweb = core.qweb;
  var SlideQuizFinishModal = require('website_slides.quiz.finish');

  ajax.loadXML('/elearning_slides_access/static/src/xml/finish_slide_test.xml', qweb);

  SlideQuizFinishModal.include({
    //--------------------------------
    // Handlers
    //--------------------------------

    _onClickNext: function() {
      // Don't go to the next slide because it could be still closed and we'll raise an exception. Just
      // reload the page, and this will help show the Key to open next section if needed
      window.location.reload()
    },
  })

});