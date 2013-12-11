/**
 * public script for me
 *
 *  -- namespaces --
 *  $ : jQuery
 *  l : message resource
 *  v : validation
 *  hbs : handlebars
 *
 */

(function ($, l, v, hbs) {

    $.fn.extend({
        myDetailForm: function () {
            var form = $(this);
            return form.detailForm({
                schema: v.me.update,
                editBtn: ".edit-btn"
            }, function (data) {
                form.setFormValue(data.model);
            });
        },
        myDetailSection: function (show, showState) {
            var section = $(this);
            $('#my-detail-form', section).myDetailForm();


            $('#my-password-change-form', section)
                .ajaxForm(function () {
                    showState(false);
                    var form = $(this);
                    form.findByRole('success-link').followLink();
                })
                .dialog({
                    openBtn: '#my-password-change-btn',
                    open: function () {
                        showState(true);
                        $(this).focusFirstInput();
                    },
                    close: function () {
                        showState(false);
                    }
                })
                .parents('.tk-dialog')[show ? 'show' : 'hide']()
                .focusFirstInput();
            return section;
        }
    });
    $(function () {
        var body = $(document.body),
            q = $.getQuery();

        var show_password_change = q['show_password_change'] == 'true';
        $('#my-detail-section', body).myDetailSection(show_password_change, function (show_password_change) {
            $.pushQueryToState({
                show_password_change: show_password_change
            });
        });

        $('header', body).header('#mypage-link-btn');
    })
})(jQuery, window['l'], window['v'], Handlebars);