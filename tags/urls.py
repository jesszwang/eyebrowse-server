from django.conf.urls import patterns
from django.conf.urls import url

urlpatterns = patterns('tags.views',
                        url(r'^tags/page', 'tags_by_page'),
                        url(r'^tags/highlight', 'tags_by_highlight'),
                        url(r'^page$', 'page'),
                        url(r'^initialize_page$', 'initialize_page'),
                        url(r'^vote/add$', 'add_vote'),
                        url(r'^vote/remove$', 'remove_vote'),
                        url(r'^highlight$', 'highlight'),
                        url(r'^highlights$', 'highlights'),
                        url(r'^highlight/delete$', 'delete_highlight'),
                        url(r'^page/related_stories$', 'related_stories'),
                        url(r'^page/summary$', 'page_summary'),
                        url(r'^user/tags$', 'user_value_tags'),
                        url(r'^common_tags$', 'common_tags'),
                        url(r'^comments$', 'comments'),
                        url(r'^comment/add$', 'add_comment'),
                        url(r'^comment/edit$', 'edit_comment'),
                        url(r'^comment/remove$', 'remove_comment'),
                        url(r'^fbshare$', 'fb_share'),
                      )