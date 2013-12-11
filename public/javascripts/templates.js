(function() {
	var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
	templates[''] = template(
	function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  }
	);
})();(function() {
	var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
	templates['input-err-msg'] = template(
	function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class=\"input-err-msg err-msg\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>";
  return buffer;
  }
	);
})();(function() {
	var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
	templates['resource-list-item'] = template(
	function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"hoverable positioned resource-list-item\" id=\"resource-list-item-";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <form class=\"inline-form\" action=\"";
  if (stack1 = helpers.ctx) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ctx; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/api/resource/save\"\n          method=\"post\" name=\"edit-form\">\n        <input type=\"hidden\" value=\"";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_id\"/>\n        <input type=\"hidden\" value=\"";
  if (stack1 = helpers._vr) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._vr; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_vr\"/>\n        <input type=\"hidden\" value=\"";
  if (stack1 = helpers._num) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._num; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_num\"/>\n        <input type=\"text\" class=\"editable-text\" name=\"name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n        <label class=\"tk-editable-label\"></label>\n    </form>\n    <span class=\"url-label\">";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <div class=\"stick-right stick-top hoverable-child\">\n        <a class=\"edit-btn\" href=\"javascript:void(0)\"></a>\n\n        <form class=\"inline-form\" action=\"";
  if (stack1 = helpers.ctx) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ctx; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/api/resource/destroy\"\n              method=\"post\" name=\"destroy-form\">\n            <input type=\"hidden\" value=\"";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_id\"/>\n            <a href=\"javascript:void(0)\" class='destroy-btn'></a>\n        </form>\n    </div>\n</li>";
  return buffer;
  }
	);
})();(function() {
	var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
	templates['user-list-item'] = template(
	function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"hoverable positioned\" id=\"user-list-item-";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <form class=\"inline-form\" action=\"";
  if (stack1 = helpers.ctx) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ctx; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/api/user/save\"\n          method=\"post\" name=\"edit-form\">\n        <input type=\"hidden\" value=\"";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_id\"/>\n        <input type=\"hidden\" value=\"";
  if (stack1 = helpers._vr) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._vr; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_vr\"/>\n        <input type=\"hidden\" value=\"";
  if (stack1 = helpers._num) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._num; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_num\"/>\n        <input type=\"text\" class=\"editable-text\" name=\"username\" value=\"";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n        <label class=\"tk-editable-label\"></label>\n    </form>\n    <div class=\"stick-right stick-top hoverable-child\">\n        <a class=\"edit-btn\" href=\"javascript:void(0)\"></a>\n\n        <form class=\"inline-form\" action=\"";
  if (stack1 = helpers.ctx) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ctx; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/api/user/destroy\"\n              method=\"post\" name=\"destroy-form\">\n            <input type=\"hidden\" value=\"";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0._id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" name=\"_id\"/>\n            <a href=\"javascript:void(0)\" class='destroy-btn'></a>\n        </form>\n    </div>\n</li>";
  return buffer;
  }
	);
})();