(function ($) {
    $.fn.extend({
        fontList: function (names) {
            var ul = $(this);
            names.forEach(function (name) {
                name = name.toLowerCase();
                $('<li/>').addClass('font-' + name).text(name)
                    .appendTo(ul).wrapInner('<h1/>');
            });
            return ul;
        }
    });
    $(function () {
        var font_names = [
            "Chango-Regular",
            "Fenix-Regular",
            "Orbitron-Black",
            "Orbitron-Bold",
            "Orbitron-Medium",
            "Orbitron-Regular",
            "Peralta-Regular",
            "PoiretOne-Regular",
            "RalewayDots-Regular",
            "SonsieOne-Regular",
            "Wellfleet-Regular"
        ];
        $('#font-list').fontList(font_names);
    });
})(jQuery);