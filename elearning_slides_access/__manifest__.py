# -*- coding: utf-8 -*-
{
    'name': "eLearning Slides Access",
    'summary': """
        Students need to Unblock slides on Progress """,
    'description': """
        
    """,
    'author': "David Moreno",
    'website': "https://github.com/JDavidMoreno",
    'category': 'Website',
    'version': '0.1',
    'depends': ['mail', 'web', 'survey', 'website_slides'],
    'data': [
        'security/ir.model.access.csv',
        'views/assets.xml',
        'views/slide_access.xml',
        'views/slide_views.xml',
        'views/slide_templates.xml'
    ]
}
