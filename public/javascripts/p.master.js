/**
 * public script for magter page
 *
 *  -- namespaces --
 *  $ : jQuery
 *  l : message resource
 *  hbs : handlebars
 *
 */
(function ($, l, hbs) {
    $(function () {
        var body = $(document.body);


        $('header', body).header('#master-link-btn');
    });
})(jQuery, window['l'], Handlebars);