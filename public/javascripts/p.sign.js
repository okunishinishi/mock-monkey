/**
 * public script for sign page
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
        signinTabContent: function () {
            var tabContent = $(this),
                form = $('#signin-form', tabContent),
                schema = v.sign.signin;
            form
                .ajaxForm(schema, function (data) {
                    var user = data.user;
                    if (user) {
                        $('#signin-success-link', tabContent).followLink();
                    }
                });
            return tabContent;
        },
        signupTabContent: function () {
            var tabContent = $(this),
                form = $('#signup-form', tabContent);

            var captchaRefreshBtn = $('#captcha-refresh-btn', form),
                captchaImg = $('#captcha-img', form);

            captchaImg.load(function () {
                captchaImg.parent().removeSpin();
            });
            captchaImg.refresh = function () {
                captchaImg.parent().showSpin();
                captchaImg.attr({
                    src: captchaImg.data('src')
                });
            };
            captchaRefreshBtn.click(function () {
                captchaImg.refresh();
                $('#captcha_text-input', tabContent).focus();
            });
            tabContent.on('tab-content-select', function () {
                captchaImg.refresh();
            });
            form
                .ajaxForm(v.sign.signup, function () {
                    $('#signup-success-link', tabContent).followLink();
                });
            return tabContent;
        },
        signSection: function () {
            var section = $(this),
                tabs = $('#sign-tabs', section);
            var tab = tabs.find('.tab').click(function () {
                var tab = $(this).addClass('tab-active');
                tab.siblings('.tab-active').removeClass('tab-active');
                var hash = '#' + tab.attr('for');
                location.href = hash;
                var tabContent = $(hash),
                    form = $('form', tabContent);
                var values = $('form:visible', section).first().getFormValue();
                form.setFormValue(values);
                tabContent
                    .show()
                    .trigger('tab-content-select')
                    .find(':text')
                    .first()
                    .focus();
                tabContent
                    .siblings('.tab-content').hide();
            });

            $('#signin-tab-content', section).signinTabContent();
            $('#signup-tab-content', section).signupTabContent();

            var firstTab = (function (hash) {
                var firstTab = section.findByAttr('for', hash.replace('#', ''));
                if (firstTab.size()) {
                    return firstTab;
                } else {
                    return tab.first();
                }
            })(location.hash);
            firstTab.click();


            return  section;
        }
    });
    $(function () {
        var body = $(document.body);

        $('#sign-section', body).signSection();

        v.disableAllValidations(); //FIXME

        $('#header').header('#signin-link-btn');

    });
})(jQuery, window['l'], window['v'], Handlebars);

