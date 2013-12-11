/**
 * jquery.spreadsheet.js v0.3.1
 * - jquery plugin to create spreadsheet -
 * @version v0.3.1
 * @author Taka Okunishi
 * @license MIT
 * @date 2013-11-29
 */
(function (dependencies, undefined) {
	
	/** jquery.spreadsheet for $ **/
	(function (global, undefined) {
	
		var $ = global['$'];
		
		var spreadsheet = $.spreadsheet = {};
		var settings = spreadsheet.settings = {
		    prefix: 'ss',
		    update: function (data) {
		        var s = this;
		        Object.keys(data).forEach(function (key) {
		            s[key] = data[key];
		        });
		    }
		};
		var p = spreadsheet.p = function (str) {
		    if (str.match(/^\./)) {
		        return ['.' + settings.prefix, str.replace(/^\./, '')].join('-');
		    }
		    return [settings.prefix, str].join('-');
		};
		
		spreadsheet.toAttrStrings = function (data) {
		    if (!data) return [];
		    return Object.keys(data).map(function (key) {
		        var value = data[key];
		        return [
		            key,
		            '"' + value + '"'
		        ].join('=')
		    });
		};
		
		
		spreadsheet.SheetData = function (name, head, rows) {
		    var s = this;
		    if (typeof(arguments[0]) !== 'string') {
		        head = arguments[0];
		        rows = arguments[1];
		    }
		    s.name = name;
		    s.head = head;
		    s.rows = rows;
		};
		spreadsheet.SheetData.prototype.toHTML = function () {
		    var s = this;
		    return '<table class=' + p('table') + '>'
		        + '<caption>' + (s.name || '') + '</caption>'
		        + '<thead>' + (s.head && s.head.toHTML() || s.head || '') + '</thead>'
		        + '<tbody>' + (s.rows && s.rows.map(function (row, rownum) {
		        return row && row.toHTML && row.toHTML(rownum) || row || '';
		    }).join('')) + '</tbody>'
		        + '</table>';
		};
		
		
		spreadsheet.HeadData = function (values) {
		    var s = this;
		    s.values = values;
		};
		spreadsheet.HeadData.prototype.toHTML = function () {
		    var s = this,
		        values = s.values;
		    return '<tr><th></th>' + (values && values.map(function (value, col) {
		        var attrString = spreadsheet.toAttrStrings({
		            "class": [p('th'), p('head-th')].join(' '),
		            "data-col": col
		        }).join(' ');
		        return '<th ' + attrString + '>' + (value || '') + '</th>';
		    }).join('')) + '</tr>';
		};
		spreadsheet.RowData = function (rowHead, values) {
		    switch (arguments.length) {
		        case 1:
		            if (arguments[0] instanceof Array) {
		                values = arguments[0];
		                rowHead = '';
		            }
		            break;
		    }
		    var s = this;
		    s.rowHead = rowHead;
		    s.values = values;
		};
		spreadsheet.RowData.prototype.toHTML = function (row) {
		    var s = this,
		        values = s.values,
		        rowHead = s.rowHead || '';
		
		    var thAttrString = spreadsheet.toAttrStrings({
		        "class": [p('th'), p('body-th')].join(' '),
		        "data-row": row
		    }).join(' ');
		    return '<tr class="' + p('tbody-row') + '"><th ' + thAttrString + '>' + rowHead + '</th>' + (values && values.map(function (value, col) {
		        var attrString = spreadsheet.toAttrStrings({
		            "class": p('cell'),
		            "data-row": row,
		            "data-col": col
		        }).join(' ');
		        return '<td ' + attrString + '>' + (value || '') + '</td>';
		    }).join('')) + '</tr>';
		};
	})(dependencies, undefined);
	
	/** jquery.spreadsheet for $.fn **/
	(function (global, undefined) {
	
		var $ = global['$'];
		
		var ss = $.spreadsheet,
		    p = ss.p;
		
		function createRoot(elment, html) {
		    html = ['<div class="' + p('scrollable') + '">' + html + '</div>'].join('');
		    var root = $(elment).html(html).addClass(p('root'));
		
		    return root;
		}
		function createTopFixed(thead, scrollable) {
		    var fixedThead = thead.clone().addClass('top-fixed-thead');
		    var left = scrollable.offset().left;
		    fixedThead.free = function () {
		        fixedThead.hide();
		        thead
		            .data(p('fixed'), false);
		    };
		    fixedThead.fix = function () {
		        fixedThead.show().css({
		            left: -1 * scrollable.scrollLeft() + left
		        });
		        thead
		            .data(p('fixed'), true);
		    };
		
		    scrollable.scroll(function () {
		        var scrollLeft = scrollable.scrollLeft();
		        if (thead.data(p('fixed'))) {
		            fixedThead.css({left: -1 * scrollLeft + left});
		        }
		    });
		
		    return fixedThead;
		}
		function createLeftFixed(th) {
		    var html = '<table class="' + p('left-fixed-table') + '"><caption>&nbsp;</caption>' +
		        '<thead><tr><th >&nbsp;</th></tr></thead><tbody></tr>';
		    th.each(function () {
		        var th = $(this);
		        var attrString = ss.toAttrStrings({
		            "class": th.attr('class'),
		            'width': th.width()
		        }).join(' ');
		        html += '<tr><th ' + attrString + '>' + th.html() + '</th></tr>';
		    });
		    return html + '</tbody></table>';
		}
		ss.createTopFixed = createTopFixed;
		ss.createLeftFixed = createLeftFixed;
		$.fn.spreadsheet = function (sheetData, options) {
		    var doc = $(document),
		        win = $(window),
		        o = $.extend(options, ss.settings);
		
		    if (!(sheetData instanceof ss.SheetData)) {
		        sheetData = new ss.SheetData(null, new ss.RowData(sheetData));
		    }
		    var root = createRoot(this, sheetData.toHTML()),
		        scrollable = root.children(p('.scrollable')),
		        table = scrollable.children('table'),
		        thead = table.children('thead'),
		        tbody = table.children('tbody');
		
		    var theadTh = thead.find(p('.head-th')),
		        tbodyTh = tbody.find(p('.body-th'));
		
		    var leftFixed = $(createLeftFixed(tbodyTh)).appendTo(root);
		
		    var topFixed = createTopFixed(thead, scrollable);
		    table.append(topFixed);
		
		
		    win.scroll(function () {
		        var scrollTop = win.scrollTop(),
		            fixed = thead.data(p('fixed'));
		        if (thead.offset().top < scrollTop) {
		            !fixed && topFixed.fix();
		        } else {
		            fixed && topFixed.free();
		        }
		    });
		
		    var cellSelector = [p('.root'), p('.cell')].join(' ');
		
		    root
		        .on('mouseleave', function () {
		            root.find(p('.th-hover')).removeClass(p('th-hover'));
		        })
		        .on(p('resize'), function () {
		
		            topFixed.width(thead.width());
		            topFixed.css('left', thead.position().left);
		
		
		            leftFixed.find(p('.body-th')).width(tbodyTh.width());
		            leftFixed.children('thead').eq(0)
		                .find('th').eq(0).height(theadTh.height() + 1);
		
		
		            tbodyTh.each(function (i) {
		                var th = $(this);
		                leftFixed.find(p('.body-th')).eq(i)
		                    .width(th.width())
		                    .height(th.height());
		            });
		
		            theadTh.each(function (i) {
		                var th = $(this);
		                topFixed.find('.ss-head-th').eq(i)
		                    .height(th.height())
		                    .width(th.width());
		            });
		
		            topFixed.children('tr').children('th').first().width(leftFixed.width());
		        })
		        .trigger(p('resize'));
		
		    win
		        .on('resize', function () {
		            root.trigger(p('resize'));
		        });
		
		    doc
		        .on('mouseenter', p('.head-th'), function(){
		            var th = $(this);
		            th
		                .addClass(p('th-hover'))
		                .siblings(p('.th-hover'))
		                .removeClass(p('th-hover'));
		        })
		        .on('mouseenter', cellSelector, function () {
		            var cell = $(this),
		                row = cell.data('row'),
		                col = cell.data('col');
		
		
		            theadTh
		                .removeClass(p('th-hover'))
		                .eq(col).addClass(p('th-hover'));
		
		            if (thead.data(p('fixed'))) {
		                var topFixedTr = topFixed.children('tr');
		                topFixedTr
		                    .children(p('.th-hover'))
		                    .removeClass(p('th-hover'));
		                topFixedTr
		                    .children(p('.head-th'))
		                    .eq(col).addClass(p('th-hover'));
		            }
		
		            tbodyTh
		                .removeClass(p('th-hover'))
		                .eq(row).addClass(p('th-hover'));
		
		
		            leftFixed.find(p('.body-th'))
		                .removeClass(p('th-hover'))
		                .eq(row).addClass(p('th-hover'));
		        })
		        .on('mouseleave', cellSelector, function () {
		
		        });
		    return    root;
		};
	})(dependencies, undefined);

})({
    $: this['jQuery']
}, undefined);