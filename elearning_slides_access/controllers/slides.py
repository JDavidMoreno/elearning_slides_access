# -*- coding: utf-8 -*-

from odoo import http, tools, _
from odoo.addons.website_slides.controllers.main import WebsiteSlides
from odoo.http import request
import werkzeug
from odoo.addons.http_routing.models.ir_http import slug


class WebsiteSaleSlides(WebsiteSlides):

    def _prepare_additional_channel_values(self, values, **kwargs):
        values = super(WebsiteSaleSlides, self)._prepare_additional_channel_values(values, **kwargs)
        is_request_access_set = False
        # TODO:Waiting for answer
        values.update({
            'open_category_ids': [],
            'section_access_requested_ids': [],
            'section_can_request_id': None
        })
        for category_data in values['category_data']:
            if category_data.get('category'):
                slide_user_access = category_data['category']._user_section_access()
                if slide_user_access:
                    if slide_user_access in ['allowed', 'first']:
                        values['open_category_ids'].append(category_data['id'])
                    else:
                        values['section_access_requested_ids'].append(category_data['id'])
                if not slide_user_access and not is_request_access_set and category_data['category'].previous_categ_has_all_slides_completed():
                    values['section_can_request_id'] = category_data['id']
                    is_request_access_set = True
        return values

    @http.route('''/slides/slide/<model("slide.slide"):slide>''', type='http', auth="public", website=True, sitemap=True)
    def slide_view(self, slide, **kwargs):
        res = super(WebsiteSaleSlides, self).slide_view(slide, **kwargs)
        if not slide._user_section_access() and not slide.is_preview:
            raise werkzeug.exceptions.Forbidden()
        return res

    # TODO: Just Improve this. Make Set Done to show next slide when the user has permissions
    # This is making the after Test modal to show End Course in ful screen
    @http.route('/slides/slide/<model("slide.slide"):slide>/set_completed', website=True, type="http", auth="user")
    def slide_set_completed_and_redirect(self, slide, next_slide_id=None):
        self._set_completed_slide(slide)
        next_slide = None
        # if next_slide_id:
        #     next_slide = self._fetch_slide(next_slide_id).get('slide', None)
        return werkzeug.utils.redirect("/slides/slide/%s" % (slug(next_slide) if next_slide else slug(slide)))
