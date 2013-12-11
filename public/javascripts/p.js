/**
 * public script for all pages
 *
 *  -- namespaces --
 *  $ : jQuery
 *  l : message resource
 *  tek: tek
 *  hbs : handlebars
 *
 */
(function ($, l, tek, hbs) {
    hbs.registerHelper('l', function (name) {
        return name && eval(["window", "l"].concat(name).join('.'));
    });
    hbs.registerHelper('t', function () {
        return new Date().getTime();
    });
    hbs.registerHelper('ctx', function () {
        var ctx = window['ctx'];
        return ctx ? '/' + ctx : '';
    });

    var supported = (function (detected) {
        if (!detected) return true;
        switch (detected.browser) {
            case 'IE':
                return 9.0 <= detected.version;
        }
        return true;
    })(tek.detectBrowser(window));

    if (!supported) {
        $(function () {
            $.sorryNoSupport();
        });
    }


    $.extend({
        format: function (string, data) {
            return string && string.replace(/\$\{(.*)\}/g, function ($0, $1) {
                return data[$1] || '';
            });
        },
        dateLabel: function (date) {
            return date && new Date(date).toLocaleString() || '';
        },
        alert: function (selector, text) {
            var alert = $(selector);
            alert.show().find('.alert-msg').text(text);
            location.href = '#' + (alert.attr('id') || '');
        },
        errAlert: function (text) {
            $.alert('#err-alert', text);
        },
        warnAlert: function (text) {
            $.alert('#warn-alert', text);
        },
        infoAlert: function (text) {
            $.alert('#info-alert', text);
        }
    });
    $.fn.extend({
        /**
         * reset form values
         * @returns {*}
         */
        reset: function () {
            return this.each(function () {
                this.reset && this.reset();
            });
        },
        /**
         * form to destroy
         * @param options
         * @param callback
         * @returns {*|HTMLElement}
         */
        destroyForm: function (options, callback) {
            var form = $(this),
                schema = options.schema || null,
                confirmRemove = options.confirmRemove,
                destroyBtn = $(options.destroyBtn || form.find(':submit'));
            form.ajaxForm(schema, function () {
                form.reset();
                callback && callback.call(form);
            });
            destroyBtn.click(function () {
                if (confirmRemove) {
                    if (typeof(confirmRemove) === 'boolean') {
                        confirmRemove = {};
                    }
                    $.confirmRemove(confirmRemove, function () {
                        form.submit();
                    });
                } else {
                    if (confirm(l.msg.you_sure)) {
                        form.submit();
                    }
                }
            });
            return form;
        },
        /**
         * list item which is destroyable
         * @param options
         */
        destroyableListItem: function (options) {
            var li = $(this),
                destroyForm = $(options.destroyForm);
            if (li.data('destroyable-list-item')) {

            } else {
                li.data('destroyable-list-item', true);
                destroyForm.destroyForm(options, function () {
                    li.closeDown(100, function () {
                        li.remove();
                    });
                });

            }
            return li;
        },
        /**
         * list item which is editable
         * @returns {*}
         */
        editableListItem: function (options) {
            var li = $(this),
                mode = options.mode,
                schema = options.schema || null,
                editBtn = $(options.editBtn),
                editForm = $(options.editForm);
            if (li.data('editable-list-item')) {
                editForm.editableForm('view');
            } else {
                li.data('editable-list-item', true);
                editBtn.click(function () {
                    editForm.editableForm('edit');
                });
                editForm.ajaxForm(schema, function (data) {
                    editForm.editableForm('view');
                    $.confirmLeave(false);
                    var callback = options.edit;
                    callback && callback.call(li, data);
                });
            }
            mode && editForm.editableForm(mode);
            return li;
        },
        /**
         * form for searching
         * @param callback
         * @returns {*|HTMLElement}
         */
        searchForm: function (callback) {
            var form = $(this);
            form.ajaxForm(function (data) {
                callback && callback(data);
            });
            form.find('input[type="search"]').textchange(function () {
                form.submit();
            });
            return form;
        },
        /**
         * form for ajax submit
         * @param schema
         * @param callback
         * @returns {*}
         */
        ajaxForm: function (schema, callback) {
            if (arguments.length == 1) {
                callback = arguments[0];
                schema = undefined;
            }
            return $(this).each(function () {
                    var form = $(this);

                    function done(data) {
                        var err = data.err;
                        if (err) {
                            form.errForm(err);
                        } else {
                            callback.call(form, data);
                        }
                    }

                    form.submit(function (e) {
                        e.preventDefault();
                        form.errForm(null);
                        var timer = form.data('ajax-submit-timer');
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function () {
                            if (schema) {
                                var value = form.getFormValue();
                                schema.validate(value, function (err) {
                                    if (err) {
                                        form.errForm(err);
                                    } else {
                                        form.ajaxSubmit(done);
                                    }
                                });
                            } else {
                                form.ajaxSubmit(done);
                            }
                        }, 150);
                        form.data('ajax-submit-timer', timer);

                    });
                }
            )
        },
        errForm: function (errors) {
            var form = $(this);
            var tmpl = hbs.templates['input-err-msg'];
            form.find('.err-input').removeClass('err-input');
            form.find('.input-err-msg').remove();
            errors && errors.forEach(function (err) {
                var property = err.property;
                var cause = err.cause,
                    msg = $.format(l.err[cause] || cause, {
                        label: l[property] || property
                    });
                var input = form.findByName(property).addClass('err-input');
                if (input.length) {
                    input.before(tmpl(msg));
                } else {
                    form.prepend(tmpl(msg));
                    if (property.match(',')) {
                        property.split(',').forEach(function (property) {
                            form.findByName(property).addClass('err-input');
                        });
                    }
                }
            });
            form.find('.err-input').first().focus();
            return form;
        },
        editableForm: function (mode) {
            var form = $(this);
            var editableText = form
                .find('[type="text"],textarea');
            editableText
                .not('.tk-editable-text')
                .editableText('__never_call__');
            switch (mode) {
                case 'view':
                    editableText.trigger('tk-editable-text-fix');
                    break;
                case 'edit':
                    editableText.trigger('tk-editable-text-edit');
                    break;
            }
            form
                .attr('data-mode', mode);
            return form;
        },
        detailForm: function (options, callback) {
            var form = $(this),
                mode = options.mode || 'view',
                schema = options.schema || null,
                editBtn = $(options.editBtn, form);

            form.editableForm(mode);

            if (!form.data('detail-form')) {
                form.data('detail-form', true);
                form.ajaxForm(schema, function (data) {
                    form.editableForm('view');
                    $.confirmLeave(false);
                    callback && callback(data);
                });
                editBtn.click(function () {
                    form.editableForm('edit');
                });
                form
                    .change(function () {
                        $.confirmLeave(l.msg.has_unsaved);
                    });
            }

            return form;
        },
        selectableList: function (options, callback) {
            options = $.extend({
                deselect: false
            }, options)
            return this.each(function () {
                var ul = $(this);
                ul
                    .addClass('selectable-list')
                    .on('click', 'li', function () {
                        var li = $(this);
                        if (options.deselect) {
                            if (li.hasClass('selected-list-item')) {
                                li.removeClass('selected-list-item');
                                callback && callback.call(ul, null);
                                return;
                            }
                        }
                        li.addClass('selected-list-item')
                            .siblings('.selected-list-item')
                            .removeClass('selected-list-item');
                        callback && callback.call(ul, li);
                    });
            });
        },
        followLink: function () {
            var a = $(this);
            var href = a.attr('href');
            if (href === undefined) return;
            location.href = href;
        },
        focusFirstInput: function () {
            return $(this)
                .find(':radio,:checkbox,:text,:password,textarea,select')
                .filter(':visible')
                .first()
                .focus()
                .select();
        },
        header: function (activeItem) {
            var header = $(this);
            if (!header.data('header')) {
                header
                    .data('header', true)
                    .on('click', '.nav-item', function (e) {
                        e.stopPropagation();
                        var item = $(this);
                        if (!item.hasClass('has-sub-nav')) return;
                        e.preventDefault();
                        var
                            href = item.attr('href');
                        var active = item
                            .hasClass('nav-item-active');
                        var subNav = $(href);
                        if (active) {
                        } else {
                            item
                                .siblings('.nav-item-active')
                                .removeClass('nav-item-active');
                            $('.sub-nav', header)
                                .not(subNav)
                                .addClass('hidden');
                        }
                        if (active) {
                            item.removeClass('nav-item-active');
                            subNav.hide();
                        } else {
                            item.addClass('nav-item-active');
                            subNav.removeClass('hidden', active)
                                .show();
                        }
                        header.trigger('header-resize');
                    });


            }
            $(activeItem)
                .addClass('nav-item-active')
                .parents('.sub-nav')
                .removeClass('hidden')
                .each(function () {
                    var subNav = $(this),
                        id = subNav.attr('id');
                    header.findByAttr('h' +
                            'ref', '#' + id)
                        .addClass('nav-item-active');
                })
                .trigger('header-resize');
            return header;
        }
    })
    ;
    $(function () {

        var body = $(document.body),
            header = $('header', body).header();

        header
            .on('header-resize', function () {
                setTimeout(function () {
                    var height = header.outerHeight(true);
                    body.css({
                        paddingTop: height
                    });
                    var subNav = header.find('.sub-nav').filter(':visible');
                    var heightToHide = height - subNav.last().outerHeight(true);
                    header.data({
                        'height-to-hide': heightToHide
                    });
                }, 10);
            });

        header.trigger('header-resize');

        var m = tek.math;
        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop(),
                heightToHide = header.data('height-to-hide'),
                baseLine = header.data('base-line');
            if (baseLine === undefined) {
                baseLine = 0;
            }
            var move = m.max(m.min(40, scrollTop),
                m.min(scrollTop - baseLine, heightToHide));
            header.css({
                top: move * -1
            });
            baseLine = m.max(0, scrollTop - move);
            header.data('base-line', baseLine);
        });


        $(document)
            .ajaxError(function (e, req, setting, err) {
                if (req.status) {
                    var statusCode = req.statusCode();
                    console.error('[ajax err]', statusCode, err);
                    $.errAlert(l.err.something_worng);
                }
            })
            .ajaxComplete(function (e, xhr, settings) {
                var json = xhr['responseJSON'];
                if (!json) return;
                var error_alert = json['err_alert'] || json['error_alert'];
                if (error_alert) {
                    $.errAlert(error_alert);
                }
                var info_alert = json['info_alert'];
                if (info_alert) {
                    $.infoAlert(info_alert);
                }
                var warn_alert = json['warn_alert'];
                if (warn_alert) {
                    $.warnAlert(warn_alert);
                }
            });


        $('.alert-close-btn', body).click(function () {
            $(this).parent('.alert').fadeOut(200);
        });

        var visibleAlert = $('.alert', body).filter(':visible');
        if (visibleAlert.size()) {
            location.href = '#' + (visibleAlert.attr('id') || '');
        }

        $('[data-autoformat]').each(function () {
            var input = $(this),
                format = input.data('autoformat');
            input.autoformatInput(format);
        });
    });
})
    (jQuery, window.l, window.tek, Handlebars);

