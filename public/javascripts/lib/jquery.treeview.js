/**
 * jquery.treeview.js v0.3.1
 * - jquery plugin to create treeview -
 * @version v0.3.1
 * @author Taka Okunishi
 * @license MIT
 * @date 2013-11-29
 */
(function (dependencies, undefined) {
	
	/** jquery.treeview for $ **/
	(function (global, undefined) {
	
		var $ = global['$'];
		
		var treeview = $.treeview = {};
		var settings = treeview.settings = {
		    prefix: 'tv',
		    update: function (data) {
		        var s = this;
		        Object.keys(data).forEach(function (key) {
		            s[key] = data[key];
		        });
		    },
		    action: function (selected) {
		    }
		};
		
		var p = treeview.p = function (str) {
		    if (str.match(/^\./)) {
		        return ['.' + settings.prefix, str.replace(/^\./, '')].join('-');
		    }
		    return [settings.prefix, str].join('-');
		};
		
		
		var Item = treeview.Item = function (content) {
		    var s = this;
		    s.content(content);
		};
		Item.prototype.children = function (children) {
		    var s = this;
		    s._children = children;
		    return s;
		};
		Item.prototype.content = function (content) {
		    var s = this;
		    s._content = content;
		    return s;
		};
		Item.prototype.toHTML = function () {
		    var s = this,
		        label = ['<label class="' + p('label') + '">', (s._content || ''), '</label>'];
		    var children = '';
		    if (s._children) {
		        children += '<ul class="' + p('children') + '">';
		        s._children.forEach(function (child) {
		            children += child.toHTML && child.toHTML() || child || '';
		        });
		        children += '</ul>'
		    }
		    var styleClass = p('item'), icon = '';
		    if (children) {
		        //noinspection JSValidateTypes
		        styleClass = [styleClass, p('openable')].join(' ');
		
		        icon += '<i class="' + p('openable-icon') + '"></i>';
		    }
		    label.splice(1, 0, icon);
		    return [
		        '<li class="' + styleClass + '">',
		        label.join('') + children,
		        '</li>'
		    ].join('');
		};
	})(dependencies, undefined);
	
	/** jquery.treeview for $.fn **/
	(function (global, undefined) {
	
		var $ = global['$'];
		if (!$.fn.draggable) {
		    console.error('[jquery.treeview.js] jquery-ui is required');
		}
		
		var tv = $['treeview'],
		    settings = tv.settings,
		    p = tv.p,
		    Item = tv.Item;
		
		function createRoot(element, html) {
		    var root = $(element).addClass(p('root'))
		        .html(html);
		
		    root.selected = $();
		
		    root.get = function () {
		        return root.find(p('.item'));
		    };
		    root.get.parent = function (item) {
		        return item && item.parent(p('.children')).parent(p('.item'));
		    };
		    root.get.children = function (item) {
		        return item && item.children(p('.children'))
		            .find(p('.item'))
		    };
		    root.get.prev = function (item) {
		        return item && item.prev(p('.item'));
		    };
		    root.get.next = function (item) {
		        return item && item.next(p('.item'));
		    };
		    root.get.droppable = function (item, y) {
		        var droppables = root.droppables;
		        for (var i = 0, len = droppables.length; i < len; i++) {
		            var droppable = droppables.eq(i);
		            var parent = root.get.parent(item);
		            if (parent.is(droppable)) continue;
		            if (item.is(droppable)) continue;
		            if (item.has(droppable).length) continue;
		            var o = droppable.offset(),
		                height = droppable.find(p('.label')).height();
		            var hit = o.top < y && y < (o.top + height);
		            if (hit)return droppable;
		        }
		        return $();
		    };
		    root.get.insertable = function (item, y) {
		        var insertables = root.insertables,
		            h = item.find(p('label')).height();
		        for (var i = 0, len = insertables.length; i < len; i++) {
		            var insertable = insertables.eq(i),
		                o = insertable.offset();
		            if (item.has(insertable).length) continue;
		            var hit = y < o.top + h / 2;
		            if (hit) return insertable;
		        }
		        return $();
		    };
		
		
		    root.select = function (item) {
		        if (!item.length) return null;
		        if (!item.is(':visible')) return null;
		        var selectedClass = p('selected');
		        if (item.hasClass(selectedClass)) return null;
		        $('.' + selectedClass)
		            .removeClass(selectedClass);
		        item.addClass(selectedClass);
		        root.selected = item;
		        return root.selected
		    };
		
		    root.unselect = function () {
		        var selectedClass = p('selected');
		        $('.' + selectedClass)
		            .removeClass(selectedClass);
		        root.selected = $();
		        return root.selected;
		    };
		
		    root.select.prev = function (deep) {
		        var selected = root.selected,
		            prev = root.get.prev(selected);
		        var result = root.select(prev);
		        if (deep) {
		            while (result) {
		                var children = root.get.children(result);
		                if (children && children.length) {
		                    var child = root.select(children.last());
		                    if (child) {
		                        result = child;
		                    } else {
		                        break;
		                    }
		                } else {
		                    break;
		                }
		            }
		        }
		        return  result;
		    };
		    root.select.next = function (deep) {
		        var selected = root.selected,
		            next = root.get.next(selected),
		            result = root.select(next);
		        if (deep) {
		            var current = selected;
		            while (!result && current.length) {
		                var parent = root.get.parent(current);
		                next = root.get.next(parent);
		                result = root.select(next);
		                current = parent;
		            }
		        }
		        return result;
		    };
		    root.select.child = function () {
		        var selected = root.selected,
		            child = root.get.children(selected).first();
		        return root.select(child);
		    };
		    root.select.parent = function () {
		        var selected = root.selected,
		            parent = root.get.parent(selected);
		        return root.select(parent);
		    };
		
		    root.open = function (item) {
		        if (!item) item = root.selected;
		        var children = root.get.children(item),
		            hasChildren = !!(children && children.length);
		        if (!hasChildren) return null;
		        if (!item.hasClass(p('closed'))) return null;
		        item.removeClass(p('closed'));
		        return item;
		    };
		
		    root.close = function (item) {
		        if (!item) item = root.selected;
		        var children = root.get.children(item),
		            hasChildren = !!(children && children.length);
		        if (!hasChildren) return null;
		        if (item.hasClass(p('closed'))) return null;
		        item.addClass(p('closed'));
		        return item;
		    };
		
		    var items = root.get();
		    root.droppables = items.filter(p('.openable'));
		    root.insertables = items;
		    items.draggable({
		        helper: "clone",
		        start: function (e, ui) {
		            var item = $(this);
		            item.addClass(p('drag-origin'));
		            root.unselect();
		
		            root.droppables = items.filter(p('.openable'));
		            root.insertables = $(items).sort(function (a, b) {
		                return $(a).offset().top - $(b).offset().top;
		            });
		
		        },
		        drag: function (e, ui) {
		            var item = $(this),
		                y = ui.offset.top + item.find(p('label')).height() / 2;
		
		            root.droppables
		                .filter(p('.droppable'))
		                .removeClass(p('droppable'));
		            root.insertables
		                .filter(p('.insertable'))
		                .removeClass(p('insertable'));
		
		            var droppable = root.get.droppable(item, y);
		            if (droppable.length) {
		
		                droppable.addClass(p('droppable'));
		            } else {
		                var insertable = root.get.insertable(item, y);
		                insertable.addClass(p('insertable'));
		            }
		
		        },
		        stop: function () {
		            var item = $(this);
		
		            item.removeClass(p('drag-origin'));
		
		            var insertable = root.insertables
		                .filter(p('.insertable'));
		            if (insertable) {
		                insertable
		                    .before(item);
		                insertable.removeClass(p('insertable'));
		            }
		
		            var
		                droppable = root.droppables
		                    .filter(p('.droppable'));
		            if (droppable) {
		                droppable
		                    .children(p('.children')).append(item);
		                droppable
		                    .removeClass(p('droppable'));
		            }
		
		            item.trigger(p('drop'));
		        }
		    });
		    return root;
		}
		
		
		$.fn.treeview = function (items, options) {
		    var doc = $(document),
		        o = $.extend({}, settings, options);
		
		    switch (arguments.length) {
		        case 1:
		            var command = arguments[0];
		            switch (command) {
		                case 'reload':
		                    if (tv.root) {
		                        tv.root = createRoot(this, tv.root.html());
		                        console.debug && console.debug("[jquery.treeview.js] treeview did reload.");
		                        return tv.root;
		                    }
		            }
		            break;
		    }
		
		    var html = items && items.map(function (item) {
		        return item.toHTML();
		    }).join('');
		
		    tv.root = createRoot(this, html);
		
		    var on = doc.data(p('on'));
		    if (!on) {
		        doc.data(p('on'), true);
		        doc.on('click', p('.item'), function (e) {
		            var root = tv.root;
		            root.active = true;
		
		            var item = $(this);
		            root.select(item);
		            e.stopPropagation();
		        });
		        doc.on('click', p('.openable-icon'), function (e) {
		            var root = tv.root;
		            root.active = true;
		            var item = $(this).parent(p('.label')).parent(p('.item')).first();
		            if (item.length) {
		                root.open(item) || root.close(item) || o.action(item);
		            }
		            e.stopPropagation();
		        });
		        doc.on('dblclick', p('.item'), function (e) {
		            var root = tv.root;
		            root.active = true;
		
		            var item = $(this);
		            root.open(item) || root.close(item);
		            e.stopPropagation();
		        });
		        doc.on('click', function () {
		            var root = tv.root;
		            root.active = false;
		            root.unselect();
		        });
		        doc.on('keydown', function (e) {
		            var root = tv.root;
		            if (!root.active) return;
		            var KEY = $.ui.keyCode,
		                select = root.select;
		            switch (e.keyCode || e.which) {
		                case KEY.UP:
		                    select.prev(true) || select.parent();
		                    break;
		                case KEY.DOWN:
		                    select.child() || select.next(true);
		                    break;
		                case KEY.LEFT:
		                    root.close() || select.parent();
		                    break;
		                case KEY.RIGHT:
		                    root.open() || select.child();
		                    break;
		                case KEY.ENTER:
		                    root.open() || root.close() || o.action(root.selected);
		                    break;
		                default:
		                    return;
		            }
		            e.preventDefault();
		        });
		    }
		    return tv.root;
		};
		
	})(dependencies, undefined);

})({
    $: this['jQuery']
}, undefined);