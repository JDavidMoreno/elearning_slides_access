# -*- coding: utf-8 -*-

from odoo import api, fields, models, tools, _, SUPERUSER_ID
from odoo.exceptions import AccessError


class SlideAccess(models.Model):
    _name = 'slide.access'
    _description = "Slide Access"
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Many2one('res.partner', 'Student', required=True)
    slide_id = fields.Many2one('slide.slide')
    state = fields.Selection([('requested', _("Requested")), ('allowed', _("Allowed"))], default="allowed", string="State", required=True)
    channel_id = fields.Many2one('slide.channel', string="Course", related="slide_id.channel_id")

    _sql_constraints = [
        ('slide_access_user_uniq',
         'unique (name,slide_id)',
         'A student can just have one access permission per every Course Section.')
    ]

    @api.model
    def create(self, values):
        if 'state' in values and values['state'] == 'requested':
            existing_access_id = self.search([('name', '=',  values.get('name', False)), ('slide_id', '=', values.get('slide_id', False))], limit=1)
            if existing_access_id: return self.env['slide.access']
            # Create activity for course administrator
            if values.get('slide_id') and values.get('name'):
                slide_id = self.env['slide.slide'].browse(values['slide_id'])
                student_id = self.env['res.partner'].browse(values['name'])
                if slide_id and slide_id.is_category and student_id:
                    # get the couser admin
                    res = super(SlideAccess, self).create(values)
                    if res:
                        note = _("<p>A new access request from {} has been received for the section {}.</p>".format(student_id.name, slide_id.name))
                        self.env['mail.activity'].create({
                            'activity_type_id': self.env.ref('elearning_slides_access.mail_activity_grant_access_content').id,
                            'summary': 'Access Request for Course {}.'.format(slide_id.channel_id.name),
                            'note': note,
                            'user_id': slide_id.channel_id.user_id and slide_id.channel_id.user_id.id or False,
                            'res_id': res.id,
                            'res_model_id': self.env.ref('elearning_slides_access.model_slide_access').id,
                            'automated': True,
                            'request_partner_id': self.env['ir.model.data'].xmlid_to_res_id("base.partner_root")
                        })
                    return res
        return super(SlideAccess, self).create(values)

    def button_grant_access(self):
        if self.ensure_one() and self.exists():
            self.state = 'allowed'
            template_id = self.channel_id.grant_access_template_id and self.channel_id.grant_access_template_id or self.env.ref(
                'elearning_slides_access.slide_template_grant_access', raise_if_not_found=False)
            self.activity_ids.filtered(lambda r: r.activity_type_id == self.env.ref('elearning_slides_access.mail_activity_grant_access_content')).action_done()
            if template_id:
                post_params = dict(
                    template_id=template_id.id,
                    message_type='comment',
                    subtype_id=self.env.ref('mail.mt_note').id,
                    email_layout_xmlid='mail.mail_notification_light',
                    partner_ids=[(6, False, [self.name.id])]
                )
                self.with_context(lang=self.name.lang).message_post_with_template(**post_params)

    @api.model
    def request_access(self, slide_id):
        if self.env.user.partner_id and slide_id:
            slide_id = self.env['slide.slide'].browse(slide_id)
            if slide_id and slide_id.is_category:
                slide_acces_id = self.with_user(SUPERUSER_ID).create([{
                    'name': self.env.user.partner_id.id,
                    'slide_id': slide_id.id,
                    'state': 'requested'
                }])
                if slide_acces_id:
                    return True
        return False
