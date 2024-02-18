const _req_node_child_process = require('node:child_process'),
    _req_node_path = require('node:path'),
    _req_node_fs = require('node:fs');

// install
if (!_req_node_fs.existsSync('package-lock.json')) {
    (() => {
        _req_node_child_process.execSync('npm install express ejs yaml crypto-js uuid cookie-session body-parser markdown-it markdown-it-toc markdown-it-mathjax3 markdown-it-mark').toString();
        _req_node_fs.writeFileSync('config.yml', require('yaml').stringify({
            blog: { title: 'ChaosCodex', template: 'default' },
            cookie: { name: 'sess', secret: require('uuid').v4() },
            auth: { username: 'admin', password: '4a9b3ca6-6bc3-40d4-be85-c9fa9085d40e#df1c0d2200cb2b1fafb4fa8092927f85' }
        }));
        if (!_req_node_fs.existsSync('posts')) {
            _req_node_fs.mkdirSync('posts', { mode: 0o777 });
        }
        _req_node_fs.mkdirSync('template/default', { recursive: true, mode: 0o777 });
        const includeHead = `<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"><link rel="stylesheet" type="text/css" href="https://cdn.bootcdn.net/ajax/libs/modern-normalize/2.0.0/modern-normalize.min.css"><style type="text/css">*{margin:0;padding:0;border:none;}html{font-family:sans-serif;}body{max-width:830px;margin:0 auto;padding:0 15px;color:#333;font-size:14px;line-height:1.4;font-family:"PingFang SC","Helvetica Neue","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Helvetica,Arial,Verdana,sans-serif;}a{color:#42b983;}a:hover{color:red;}h1,h2,h3,h4,h5,h6,img,pre,p,ul,ol,input[type='text'],input[type='password'],textarea{display:block;margin-bottom:15px;}h1{font-size:24px;}h2{font-size:22px;}h3{font-size:20px;}h4{font-size:18px;}h5{font-size:16px;}h6{font-size:14px;}ul ul,ol ol{margin-bottom:0;}img{max-width:100%;}ul,ol{padding-left:40px;}input[type='text'],input[type='password'],textarea{width:100%;padding:8px;border:1px solid #aaa;border-radius:5px;}button{display:inline-block;padding:4px 20px;border-radius:10px;border-bottom:4px solid #3aa373;color:#fff;background-color:#4fc08d;}button:hover{background-color:#22bd77;}pre,code{font-size:12px;font-family:'Fira Code','Source Code Pro','Consolas',courier,monospace;background-color:#f8f8f8;}code{margin:0 2px;padding:3px 5px;color:#e96900;border-radius:2px;}small{color:#888;}header{padding:35px 0;}header nav a{color:#222;font-size:16px;margin-right:5px;}footer{padding:50px 0;}</style>`,
            includeHeader = `<header><nav><a href="/">home</a>&nbsp;&nbsp;<% categories.forEach((c) => { %><a href="/category/<%= c %>"><%= c %></a>&nbsp;<% }) %></nav></header>`,
            includeFooter = `<footer><small>powered by <a href="https://github.com/1022011c125f5d64/node-single-file-blog">node-single-file-blog</a>.&nbsp;<% if (session.username !== undefined) { %><a href="/admin/password">password</a> / <a href="/admin/post">publish</a> / <a href="/auth/logout">logout</a><% } else { %><a href="/auth/login">Log in</a><% } %></small></footer>`;
        _req_node_fs.writeFileSync('template/default/index.ejs', `<html><head>${includeHead}</head><body>${includeHeader}<main><ul><% posts.forEach((p) => { %><li><a href="/post/<%= p.file.replace('.md', '') %>"><%= p.title %></a></li><% }); %></ul></main>${includeFooter}</body></html>`);
        _req_node_fs.writeFileSync('template/default/category.ejs', `<html><head>${includeHead}</head><body>${includeHeader}<main><ul><% posts.forEach((p) => { %><li><a href="/post/<%= p.file.replace('.md', '') %>"><%= p.title %></a></li><% }); %></ul></main>${includeFooter}</body></html>`);
        _req_node_fs.writeFileSync('template/default/post.ejs', `<html><head>${includeHead}<link rel="stylesheet" type="text/css" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.8.0/styles/stackoverflow-dark.min.css"></head><body>${includeHeader}<main><h1><%= post.title %></h1><p><small><%= post.birthtime %><% if (session.username !== undefined) { %>&nbsp;/&nbsp;<a href="/admin/post/<%= post.file.replace('.md', '') %>">edit</a>&nbsp;/&nbsp;<a href="/admin/post/<%= post.file.replace('.md', '') %>/delete" onclick="return confirm('It cannot be recovered after deletion. Do you want to confirm the deletion?')">delete</a><% } %></small></p><%- post.html %></main>${includeFooter}<script src="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script><script>hljs.highlightAll();</script></body></html>`);
        _req_node_fs.writeFileSync('template/default/auth_login.ejs', `<html><head>${includeHead}</head><body>${includeHeader}<main><form method="post" action="/auth/login"><p><label>Username</label><input name="username" type="text" required></p><p><label>Password</label><input name="password" type="password" required></p></div><button type="submit">Sign in</button></form></main>${includeFooter}</body></html>`);
        _req_node_fs.writeFileSync('template/default/admin_post.ejs', `<html><head>${includeHead}</head><body>${includeHeader}<main><h1><%= post ? 'edit' : 'publish' %> post</h1><form method="post" action="/admin/post/<%= post ? post.file.replace('.md', '') : '' %>"><p><textarea name="content" rows="55" required><%= post ? post.markdown : '[category]:# ()\\n[title]:# ()\\n\\n' %></textarea></p><button type="submit"><%= post ? 'edit' : 'publish' %> now</button></form></main>${includeFooter}</body></html>`);
        _req_node_fs.writeFileSync('template/default/admin_password.ejs', `<html><head>${includeHead}</head><body>${includeHeader}<main><h1>security</h1><form method="post" action="/admin/password" onsubmit="if (document.getElementById('password.new').value !== document.getElementById('password.new.confirm').value) { alert('The passwords entered twice are inconsistent'); return false; }"><p><label>old password</label><input name="password.old" type="password" required></p><p><label>new password</label><input id="password.new" name="password.new" type="password" required></p><p><label>new password confirm</label><input id="password.new.confirm" type="password" required></p><button type="submit">change password</button></form></main>${includeFooter}</body></html>`);
    })();
}

// requires
const _req_express = require('express'),
    _req_yaml = require('yaml'),
    _req_crypto_js = require('crypto-js'),
    _req_uuid = require('uuid'),
    _req_cookie_session = require('cookie-session'),
    _req_body_parser = require('body-parser'),
    _req_markdown_it = require('markdown-it')().use(require('markdown-it-toc')).use(require('markdown-it-mathjax3')).use(require('markdown-it-mark'));

// configs
let _configs = _req_yaml.parse(_req_node_fs.readFileSync(_req_node_path.join(__dirname, 'config.yml')).toString());

// tools
const _tools = {
    posts: [],
    categoryPostsMap: {},
    loadPosts: () => {
        const path = _req_node_path.join(__dirname, 'posts');
        const mds = _req_node_fs.readdirSync(path);
        mds.forEach((md) => {
            const file = _req_node_path.join(path, md),
                fileStat = _req_node_fs.statSync(file);
                fileContent = _req_node_fs.readFileSync(file).toString();
            const titleMatch = /\[title\]:# \((.+?)\)/.exec(fileContent),
                categoryMatch = /\[category\]:# \((.+?)\)/.exec(fileContent);
            const post = {
                file: md,
                birthtime: fileStat.birthtime,
                mtime: fileStat.mtime,
                title: titleMatch === null ? 'No Title' : titleMatch[1],
                markdown: fileContent,
                html: _req_markdown_it.render(fileContent)
            };
            if (categoryMatch !== null) {
                const category = categoryMatch[1].replaceAll(' ', '');
                if (!_tools.categoryPostsMap[category]) {
                    _tools.categoryPostsMap[category] = [];
                }
                post.category = category;
                _tools.categoryPostsMap[category].push(post);
            }
            _tools.posts.push(post);
            console.log(`${md} loaded`);
        });
        _tools.posts = sortedPosts = _tools.posts.sort((a, b) => {
            return b.birthtime.getTime() - a.birthtime.getTime();
        });
        Object.keys(_tools.categoryPostsMap).forEach((c) => {
            _tools.categoryPostsMap[c] = _tools.categoryPostsMap[c].sort((a, b) => {
                return b.birthtime.getTime() - a.birthtime.getTime();
            });
        });
    },
    reloadPosts: () => {
        _tools.posts = [];
        _tools.categoryPostsMap = {};
        _tools.loadPosts();
    },
    findPost: (id) => {
        for (const k in _tools.posts) {
            if (`${id}.md` === _tools.posts[k].file) {
                return _tools.posts[k];
            }
        }
        return null;
    }
};

// load posts
_tools.loadPosts();

// express
_req_express()

// http://www.npmjs.com/package/body-parser
.use(_req_body_parser.urlencoded({ extended: false }))

// https://expressjs.com/en/advanced/best-practice-security.html
.use(_req_cookie_session({
    name: 'sses',
    secret: _configs.cookie.secret
}))

// https://www.expressjs.com.cn/guide/using-template-engines.html
.set('views', './template')
.set('view engine', 'ejs')

// permission check
.use((req, res, next) => {
    if (req.path.substring(0, 6) === '/admin' && !req.session.username) {
        return res.redirect('/auth/login');
    }
    next();
})

// site routes
.get('/', (req, res) => {
    res.render(`${_configs.blog.template}/index`, {
        session: req.session,
        categories: Object.keys(_tools.categoryPostsMap),
        posts: _tools.posts
    });
})
.get('/category/:name', (req, res) => {
    const categoryPosts = _tools.categoryPostsMap[req.params.name];
    if (!categoryPosts) {
        throw new Error('category not found');
    }
    res.render(`${_configs.blog.template}/category`, {
        session: req.session,
        categories: Object.keys(_tools.categoryPostsMap),
        posts: categoryPosts
    });
})
.get('/post/:id([a-z0-9\-]{36})', (req, res) => {
    const post = _tools.findPost(req.params.id);
    if (!post) {
        throw new Error('post not found');
    }
    res.render(`${_configs.blog.template}/post`, {
        session: req.session,
        categories: Object.keys(_tools.categoryPostsMap),
        post: post
    });
})

// auth routes
.get('/auth/login', (req, res) => {
    res.render(`${_configs.blog.template}/auth_login`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap)
    });
})
.post('/auth/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        throw new Error('login failed');
    }
    const passwordSplit = _configs.auth.password.split('#');
    if (req.body.username !== _configs.auth.username 
        || _req_crypto_js.MD5(passwordSplit[0] + req.body.password).toString() !== passwordSplit[1]) {
        throw new Error('login failed');
    }
    req.session.username = _configs.auth.username;
    res.redirect('/');
})
.get('/auth/logout', (req, res) => {
    delete req.session.username;
    res.redirect('/');
})

// admin routes（without validate）
.get('/admin/post/:id([a-z0-9\-]{36})?', (req, res) => {
    res.render(`${_configs.blog.template}/admin_post`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap),
        post: _tools.findPost(req.params.id)
    });
})
.post('/admin/post/:id([a-z0-9\-]{36})?', (req, res) => {
    const id = req.params.id ? req.params.id : _req_uuid.v4();
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'posts', `${id}.md`), req.body.content);
    _tools.reloadPosts();
    res.redirect(`/post/${id}`);
})
.get('/admin/post/:id([a-z0-9\-]{36})/delete', (req, res) => {
    _req_node_fs.rmSync(_req_node_path.join(__dirname, `posts/${req.params.id}.md`), { force : true });
    _tools.reloadPosts();
    res.redirect('/');
})
.get('/admin/password', (req, res) => {
    res.render(`${_configs.blog.template}/admin_password`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap)
    });
})
.post('/admin/password', (req, res) => {
    const passwordOld = req.body['password.old'],
        passwordNew = req.body['password.new'],
        passwordSplit = _configs.auth.password.split('#');
    if (_req_crypto_js.MD5(passwordSplit[0] + passwordOld).toString() !== passwordSplit[1]) {
        throw new Error('change failed');
    }
    const newSalt = _req_uuid.v4();
    _configs.auth.password = newSalt + '#' + _req_crypto_js.MD5(newSalt + passwordNew).toString();
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'config.yml'), _req_yaml.stringify(_configs));
    delete req.session.username;
    res.redirect('/auth/login');
})

// https://expressjs.com/en/guide/error-handling.html
.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send(err.message);
})

// listen
.listen(80, () => {
    console.log('listening: http://localhost');
});
