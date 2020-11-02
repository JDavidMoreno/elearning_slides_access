# -*- coding: utf-8 -*-

from odoo import api, fields, models, tools, _
from odoo.exceptions import AccessError


class SlideChannel(models.Model):
    _inherit = 'slide.channel'

    first_section = fields.Many2one('slide.slide', compute="_compute_first_section")
    user_id = fields.Many2one('res.users', string='Responsible', default=lambda self: self.env.uid, required=True)
    grant_access_template_id = fields.Many2one('mail.template', string="Grant Access Email", default=lambda self: self.env.ref('elearning_slides_access.slide_template_grant_access', raise_if_not_found=False))

    def _compute_first_section(self):
        for channel_id in self:
            channel_id.first_section = next(iter(channel_id.slide_category_ids.sorted(lambda section: section.sequence)), self.env['slide.slide'])
