var l = exports;

l.app = {
    name: 'MockMonkey',
    description: 'mock api generator'
};
l.admin = 'admin';
l.signin = 'sign in';
l.signout = 'sign out';
l.signup = 'sign up';
l.user = 'user';
l.username = 'username';
l.password = 'password';
l.password_again = 'password again';
l.masked_password_value = '*****';
l.edit = 'edit';
l.new = 'new';
l.save = 'save';
l.reset = 'reset';
l.destroy = 'destroy';
l.email = 'email';
l.mypage = 'mypage';
l.username_or_email = [l.username, 'or', l.email].join(' ');
l.new_user = 'new user';
l.refresh = 'refresh';
l.change = 'change';
l.manage = 'manage';
l.master = 'master';
l.user_manage = [l.user, l.manage].join(' ');
l.master_manage = [l.master, l.manage].join(' ');
l.signin_count = 'signin count';
l.last_signin = 'last signin';
l.activity = 'activity';
l.profile = 'profile';
l.role = 'role';
l.name = 'name';
l.url = 'url';
l.data = 'data';
l.type = 'type';
l.xml = 'XML';
l.json = 'JSON';
l.resource = 'resource';
l.try_it = 'try it >>';
l.regex = 'RegExp';
l.string = 'String';

l.placeholder = {};
l.placeholder.name = 'your resource name';
l.placeholder.url = 'your api url';
l.placeholder.data = 'your resource data';

l.msg = {};
l.msg.prove_human_please = 'Prove you are human, not a bot.';
l.msg.input_captcha_please = 'type above number';
l.msg.signup_done = 'Sign up done.';
l.msg.signout_done = 'Sign out done.';
l.msg.user_insert_done = 'New user created';
l.msg.password_did_change = 'Password changed.';
l.msg.has_unsaved = 'Your have unsaved changes';
l.msg.you_sure = 'Are you sure?';


l.err = {};
l.err.something_worng = 'Sorry! Something is wrong.';
l.err.password_mismatch = "Password doesn't match.";
l.err.required = '${label} is required';
l.err.fail_captcha = "doesn't match";
l.err.already_taken = 'already taken';
l.err.signin_fail = 'username/email or password is wrong.';
l.err.page_not_found = 'Sorry! Page not found.';
l.err.page_forbidden = 'Sorry! You are not authorized.';
l.err.update_conflict = 'Conflict detected. Please reload page and retry it.';
l.err.illegal_sign = 'Illegal sign.';
l.err.invalid_regexp = 'invalid regular expression';
l.err.invalid_json = 'invalid json';
l.err.invalid_xml = 'invalid xml';