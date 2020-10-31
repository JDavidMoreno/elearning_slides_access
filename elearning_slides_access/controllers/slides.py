# -*- coding: utf-8 -*-

from odoo import http, tools, _
from odoo.addons.website_slides.controllers.main import WebsiteSlides
from odoo.http import request
import werkzeug


class WebsiteSaleSlides(WebsiteSlides):

    def _prepare_additional_channel_values(self, values, **kwargs):
        values = super(WebsiteSaleSlides, self)._prepare_additional_channel_values(values, **kwargs)
        is_request_access_set = False
        values.update({
            'open_category_ids': [],
            'can_request_access_categ_id': None
        })
        for category_data in values['category_data']:
            if category_data.get('category'):
                has_user_access = category_data['category']._user_has_section_access()
                if has_user_access: values['open_category_ids'].append(category_data['id'])
                if not has_user_access and not is_request_access_set and category_data['category'].previous_categ_has_all_slides_completed():
                    values['can_request_access_categ_id'] = category_data['id']
                    is_request_access_set = True
        return values

    @http.route('''/slides/slide/<model("slide.slide"):slide>''', type='http', auth="public", website=True,
                sitemap=True)
    def slide_view(self, slide, **kwargs):
        res = super(WebsiteSaleSlides, self).slide_view(slide, **kwargs)
        if not slide._user_has_section_access():
            raise werkzeug.exceptions.Forbidden()
        return res
