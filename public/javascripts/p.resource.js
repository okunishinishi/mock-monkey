/**
 * public script for resource page
 *
 *  -- namespaces --
 *  $ : jQuery
 *  l : message resource
 *  hbs : handlebars
 *
 */
(function ($, l, hbs) {

    RegExp.escape = function(string) {
        return string && string.replace(/[$-\/?[-^{|}]/g, '\\$&');
    };

    $.fn.extend({
        resourceListSection: function (_id, callback) {
            var tmpl = {
                li: hbs.templates['resource-list-item']
            };

            var section = $(this),
                ul = $('#resource-list', section);

            ul.data('selected_id', _id);
            ul.selectableList({
                deselect: true
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
                    if (li.data('resource-list-item')) return;
                    li.data('resource-list-item', true);
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
                                var resource = data.resource;
                                if (resource) {
                                    li.findByName('edit-form').setFormValue(resource);
                                    li.attr('id', 'resource-list-item-' + resource._id);
                                }
                            }
                        });
                });
            };

            $('#new-resource-btn', section).click(function () {
                ul.appendHandlebars(tmpl.li, {});
                ul.reload();
                ul.find('.editable-text').not('.tk-hidden').last().focus();
            });

            $('#resource-search-form', section).searchForm(function (data) {
                ul.htmlHandlebars(tmpl.li, data);
                var _id = ul.data('selected_id');
                if (_id) {
                    ul.find('#resource-list-item-' + _id).click();
                }
                ul.reload("view");
            }).submit();

            return section;
        },
        resourceDetailForm: function (callback) {
            var form = $(this);
            form.detailForm({
                schema: v.resource.update,
                editBtn: ".edit-btn"
            }, function (data) {
                form.setDetailFormValue(data.resource);
                callback && callback();
            });
            form.setDetailFormValue = function (data) {
                form.find(':reset').click();
                form
                    .setFormValue(data || {});
                setTimeout(function () {
                    form.editableForm('view');
                }, 10);
                return form;
            };
            return form;
        },
        resourceDetailSection: function (options) {
            var section = $(this).show(),
                destroyForm = $('#resource-destroy-form', section),
                detailForm = $('#resource-detail-form', section).resourceDetailForm(function(){
                    urlInputDiv.update();
                    section.layout();
                });


            destroyForm.destroyForm({
                schema: v.resource.destroy,
                destroyBtn: section.find('#resource-destroy-btn'),
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
                    detailForm
                        .setDetailFormValue(data)
                        .removeClass('tk-loading')
                        .hide()
                        .fadeIn();

                    destroyForm
                        .setFormValue(data);
                    urlInputDiv.update();
                    section.layout();
                });
                section
                    .removeClass('empty-section');
                options.load && options.load.call(section);
                urlInputDiv.update();
                section.layout();
                return section;
            };
            section.unload = function () {
                section
                    .data('selected_id', null);
                detailForm
                    .setDetailFormValue({})
                    .fadeOut(2, function () {
                        section.addClass('empty-section');
                        options.unload && options.unload.call(section);
                    });
                urlInputDiv.update();
                section.layout();
                return section;
            };
            section.addClass('empty-section');


            var urlInputDiv = $('#url-input-div'),
                urlLink = $('#url-input-link', urlInputDiv),
                urlInput = $('#resource-url-input', urlInputDiv),
                urlKindInput = section.findByName('url_kind'),
                urlPrefixSpan = $('#url-input-prefix-span', urlInputDiv);


            function injectMockExp(regExpString){
                return regExpString && regExpString.replace(/\\\//g, '/').replace(/\\d/g, '0')
                    .replace(/\\{.*?\\}/g,'')
                    .replace(/{.*?}/g,'')
                    .replace(/[\+\*]/g, '')
                    .replace(/\\\\/g, '');
            }

            urlInputDiv.update = function () {
                if(!urlKindInput.filter(':checked').size()){
                    urlKindInput.first().attr('checked', true);
                }

                var urlPrefix = location.origin + "/mock/";
                var kind = urlKindInput.filter(':checked').val(),
                    urlValue = urlInput.val();
                switch(kind){
                    case 'regex':
                        urlPrefix = RegExp.escape(urlPrefix);
                        urlValue = injectMockExp(urlValue);
                        break;
                }
                urlPrefixSpan.text(urlPrefix);
                var href = injectMockExp(urlPrefix) + (urlValue || '');
                urlLink.attr('href', href);

                return urlLink;
            };

            section.layout = function () {
                urlInputDiv.css({
                    paddingLeft: urlPrefixSpan.outerWidth()
                });
            };



            urlKindInput.change(function(){
                urlInputDiv.update();
                section.layout();
            });




            section.layout();
            return section;
        }
    });

    $(function () {
        var body = $(document.body),
            aside = body.find('aside'),
            q = $.getQuery() || {};

        var listSection = $('#resource-list-section', body),
            detailSection = $('#resource-detail-section', body).resourceDetailSection({
                load: function () {
                    aside.removeClass('wide-aside');
                },
                unload: function () {
                    aside.addClass('wide-aside');
                },
                destroy: function (_id) {
                    $.pushQueryToState({_id: '', t:new Date().getTime()});
                    listSection.find('#resource-list-item-' + _id).remove();
                }
            });

        var _id = q._id;
        aside
            .toggleClass('wide-aside', !_id);
        listSection.resourceListSection(_id, function (_id) {
            $.pushQueryToState({_id: _id, t:new Date().getTime()});
            detailSection.load(_id);
            aside
                .addClass('animatable')
                .toggleClass('wide-aside', !_id);
            aside.resize();
        });
        $('header', body).header('#resource-link-btn');


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
