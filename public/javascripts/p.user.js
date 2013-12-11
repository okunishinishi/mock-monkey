/**
 * public script for user page
 *
 *  -- namespaces --
 *  $ : jQuery
 *  l : message resource
 *  hbs : handlebars
 *
 */
(function ($, l, hbs) {

    $.fn.extend({
        userListSection: function (_id, callback) {
            var tmpl = {
                li: hbs.templates['user-list-item']
            };

            var section = $(this),
                ul = $('#user-list', section);

            ul.data('selected_id', _id);
            ul.selectableList({
                deselect: false
            }, function (li) {
                var _id = li && li.attr('id').split('-').pop() || null;
                ul.data('selected_id', _id);
                callback && callback(_id);
            });

            section.find('.caption').click(function () {
                $('.selected-list-item', ul).removeClass('selected-list-item');
                callback && callback(null);
            });

            ul.reload = function (mode) {
                ul.find('li').each(function () {
                    var li = $(this);
                    if (li.data('user-list-item')) return;
                    li.data('user-list-item', true);
                    li
                        .destroyableListItem({
                            destroyBtn: li.find('.destroy-btn'),
                            destroyForm: li.findByName('destroy-form'),
                            confirmRemove: true
                        })
                        .editableListItem({
                            editBtn: li.find('.edit-btn'),
                            editForm: li.findByName('edit-form'),
                            mode: mode,
                            edit: function (data) {
                                var li = $(this);
                                var user = data.user;
                                if (user) {
                                    li.findByName('edit-form').setFormValue(user);
                                    li.attr('id', 'user-list-item-' + user._id);
                                }
                            }
                        });
                });
            };

            $('#new-user-btn', section).click(function () {
                ul.appendHandlebars(tmpl.li, {});
                ul.reload();
                ul.find('.editable-text').not('.tk-hidden').last().focus();
            });

            $('#user-search-form', section).searchForm(function (data) {
                ul.htmlHandlebars(tmpl.li, data);
                var _id = ul.data('selected_id');
                if (_id) {
                    ul.find('#user-list-item-' + _id).click();
                }
                ul.reload("view");
            }).submit();

            return section;
        },
        userDetailForm: function () {
            var form = $(this);
            form.detailForm({
                schema: v.user.update,
                editBtn: ".edit-btn"
            }, function (data) {
                form.setUserDetailValue(data.user);
            });
            form.setUserDetailValue = function (data) {
                form.setFormValue(data);
                var signin_count = data.signin_count || 0;
                $('#signin_count-value', form).text(signin_count);
                var last_signin = $.dateLabel(data.last_signin);
                $('#last_signin-value', form).text(last_signin);
                setTimeout(function () {
                    form
                        .editableForm('view');
                }, 1);
                return form;
            };
            return form;
        },
        userDetailSection: function (options) {
            var section = $(this).show(),
                destroyForm = $('#user-destroy-form', section),
                passwordChangeForm = $('#user-password-change-form', section),
                detailForm = $('#user-detail-form', section).userDetailForm();

            destroyForm.destroyForm({
                schema: v.user.destroy,
                destroyBtn: section.find('#user-destroy-btn'),
                confirmRemove: true
            }, function () {
                var _id = section.data('selected_id');
                options.destroy && options.destroy.call(section, _id);
                section.unload();
            });
            section.load = function (_id) {
                if (!_id) {
                    return section.unload();
                }
                var ref = section.data('ref').replace(/:_id/, _id);

                section
                    .data('selected_id', _id);
                detailForm.addClass('tk-loading');
                $.getJSON(ref, function (data) {
                    detailForm.find(':reset').click();
                    detailForm
                        .setUserDetailValue(data || {})
                        .removeClass('tk-loading')
                        .hide()
                        .fadeIn();
                    destroyForm
                        .setFormValue(data);
                    passwordChangeForm
                        .setFormValue(data);
                });
                section
                    .removeClass('empty-section');
                options.load && options.load.call(section);
                return section;
            };
            section.unload = function () {
                section
                    .data('selected_id', null);
                detailForm
                    .setUserDetailValue({})
                    .editableForm('view')
                    .fadeOut(2, function () {
                        section.addClass('empty-section');
                        options.unload && options.unload.call(section);
                    });
                return section;
            };
            section.addClass('empty-section');


            passwordChangeForm
                .ajaxForm(function (data) {
                    passwordChangeDialog.fadeOut();
                    passwordChangeForm.reset();
                })
                .dialog({
                    openBtn: '#user-password-change-btn',
                    open: function () {
                        $(this).focusFirstInput();
                    },
                    close: function () {
                    }
                });

            var passwordChangeDialog = passwordChangeForm
                .parents('.tk-dialog').hide();
            return section;
        }
    });

    $(function () {
        var body = $(document.body),
            aside = body.find('aside'),
            q = $.getQuery() || {};

        var listSection = $('#user-list-section', body),
            detailSection = $('#user-detail-section', body).userDetailSection({
                load: function () {
                    aside.removeClass('wide-aside');
                },
                unload: function () {
                    aside.addClass('wide-aside');
                },
                destroy: function (_id) {
                    $.pushQueryToState({_id: ''});
                    listSection.find('#user-list-item-' + _id).remove();
                }
            });

        var _id = q._id;
        aside
            .toggleClass('wide-aside', !_id);
        listSection.userListSection(_id, function (_id) {
            $.pushQueryToState({_id: _id});
            detailSection.load(_id);
            aside
                .addClass('animatable')
                .toggleClass('wide-aside', !_id);
            aside.resize();
        });
        $('header', body).header('#user-link-btn');


        aside.resize = function () {
            setTimeout(function () {
                var wide = aside.hasClass('wide-aside');
                aside.find('.y-scrollable').css({
                    maxHeight: wide ? 'none' : detailSection.height() || $(window).height()
                });
            }, 3);
        };
        $(window).resize(function () {
            aside.resize();
        });
        aside.resize()
    });
})(jQuery, window['l'], Handlebars);
