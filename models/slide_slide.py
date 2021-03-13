# -*- coding: utf-8 -*-

from odoo import fields, models, _


class SlideSlide(models.Model):
    _inherit = 'slide.slide'

    slide_access_ids = fields.One2many('slide.access', 'slide_id', string="Allowed Access")
    is_allowed_access = fields.Boolean(compute="_compute_is_allowed_access")

    def _user_section_access(self):
        self.ensure_one()
        if self.is_category or self.category_id:
            reference_slide_id = self.is_category and self or self.category_id and self.category_id or None
            if reference_slide_id:
                if reference_slide_id.channel_id.user_id == self.env.user or self.env.user.has_group('website_slides.group_website_slides_manager') or self.env.user._is_admin():
                    return 'allowed'
                elif self.env.user.partner_id in reference_slide_id.slide_access_ids.mapped('name'):
                    current_access_id = reference_slide_id.slide_access_ids.filtered(lambda r: r.name == self.env.user.partner_id)
                    if current_access_id:
                        return current_access_id.state
                # This is granted when the section is the first of the course or whether the user has access to that section
                elif reference_slide_id == reference_slide_id.channel_id.first_section:
                    return 'first'
            return None
        else:
            return 'allowed'

    # Used to show the key at the moment when the user has completed all slides of a section
    def is_section_ready(self):
        reference_slide_id = self.is_category and self or self.category_id and self.category_id or None
        if reference_slide_id:
            for slide_id in reference_slide_id.slide_ids:
                if not slide_id.user_membership_id or slide_id.user_membership_id and not slide_id.user_membership_id.completed: return 0
            else:
                next_categ_id = next(iter(
                    reference_slide_id.channel_id.slide_category_ids.filtered(lambda r: r.sequence > self.category_id.sequence).sorted(
                        lambda r: r.sequence)), self.env['slide.slide'])
                return next_categ_id and next_categ_id.id or 0
        # For slides without category we don't do anything
        return 0

    # Used in the controller
    def previous_categ_has_all_slides_completed(self):
        self.ensure_one()
        previous_categ_id = next(iter(self.channel_id.slide_category_ids.filtered(lambda r: r.sequence < self.sequence).sorted(lambda r: r.sequence, reverse=True)), self.env['slide.slide'])
        if previous_categ_id.is_section_ready():
            return True
        return False

    def _compute_is_allowed_access(self):
        for slide_id in self:
            slide_id.is_allowed_access = bool(slide_id._user_section_access())

    def action_manage_access(self):
        self.ensure_one()
        view = self.env.ref('elearning_slides_access.view_slide_slide_access_form')

        return {
            'name': _('Allow Access Operations'),
            'type': 'ir.actions.act_window',
            'view_type': 'form',
            'view_mode': 'form',
            'res_model': 'slide.slide',
            'views': [(view.id, 'form')],
            'view_id': view.id,
            'target': 'new',
            'res_id': self.id
        }
