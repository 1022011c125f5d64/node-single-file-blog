const _req_node_child_process = require('node:child_process'),
    _req_node_path = require('node:path'),
    _req_node_fs = require('node:fs');

// install
if (!_req_node_fs.existsSync('package-lock.json')) {
    console.log('install npm packages...');
    console.log(_req_node_child_process.execSync('npm install express ejs yaml crypto-js uuid cookie-session body-parser page-hopper markdown-it markdown-it-katex markdown-it-toc').toString());
    console.log('mkdir /posts...');
    _req_node_fs.mkdirSync(_req_node_path.join(__dirname, 'posts'), { mode: 0o777 });
    console.log('generate template files...');
    _req_node_fs.mkdirSync(_req_node_path.join(__dirname, 'template/default'), { recursive: true, mode: 0o777 });
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/_footer.ejs'),
`<footer>
    <small>
        &copy; ChaosCodex, All Rights Reserved.
        <% if (session.username !== undefined) { %>
            <a href="/admin/configs"><%= session.username %></a> / <a href="/admin/post">publish</a> (<a href="/auth/logout">logout</a>)
        <% } else { %>
            <a href="/auth/login">Log in</a>
        <% } %>
    </small>
</footer>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/_head.ejs'),
`<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style type="text/css">:root{color-scheme:light dark;--light:#fff;--light-less:#efefef;--dark:#303030;--dark-less:#808080;--focus:red;}*{box-sizing:border-box;margin:0;padding:0;}html{border-top:5px solid var(--dark);background-color:var(--light);line-height:1.5rem;font-family:sans-serif;font-size:14px;color:var(--dark);}body{margin:0 auto;padding:0 20px;max-width:800px;}a{color:var(--dark);text-decoration:underline;}a:hover{color:var(--focus);}a mark{color:var(--focus);background:none;}header,nav,main,footer,h1,h2,h3,h4,h5,h6,p,img,blockquote,img,pre,input,select,textarea,ul,ol{display:block;margin-bottom:18px;}h1{font-size:1.8rem;}h2{font-size:1.6rem;}h3{font-size:1.4rem;}h4{font-size:1.2rem;}h5{font-size:1rem;}h6{font-size:1rem;}ul ul,ol ol{margin-bottom:0;}ul,ol{padding-left:30px;}section h3{margin-bottom:10px;}input,textarea,table{width:100%;}th,td{padding:3px 0;}th{text-align:left;}tr:nth-child(odd) td{background-color:var(--light-less);}form section{display:flex;flex-direction:row;}form section p:not(:last-child){margin-right:10px;}form section p{flex:1 1 auto;margin-bottom:0;}input[type=text],input[type=email],input[type=password],select,textarea{border:1px solid var(--dark);background-color:var(--light-less);border-radius:3px;padding:8px;}button,input[type=submit]{display:inline-block;background-color:var(--dark);color:var(--light);padding:8px;border-radius:3px;border:none;cursor:pointer;}button:hover,input[type=submit]:hover{background-color:var(--focus);}pre,code,blockquote{background-color:var(--light-less);overflow:auto;}pre{font-size:12px;line-height:1.3rem;}blockquote{border-left:solid 3px var(--dark-less);padding:10px;}blockquote p{margin-bottom:0;}small{color:var(--dark-less);}header h1 a{display:inline-block;background-color:var(--dark);color:var(--light);margin-top:20px;padding:5px 10px 5px 10px;text-decoration:none;font-weight:bold;font-size:1.2rem;}header h1 a:hover{color:var(--light);background-color:var(--focus);}nav a,div a{margin-right:5px;}footer{padding:20px 0;}.katex-html{display:none;}@media (prefers-color-scheme:dark){:root{--light:#222;--light-less:#333;--dark:#eee;--dark-less:#fefefe;--focus:red;}}</style>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/_header.ejs'),
`<header>
    <h1>
        <a href="/"><%= configs.blog.title %></a>
    </h1>
    <nav>
        <% categories.forEach((c) => { %>
            <a href="/category/<%= c %>"><%= c %></a>
        <% }) %>
        <% if (session.username !== undefined) { %>
            <a href="/admin/configs">configs</a>
            <a href="/admin/security">security</a>
        <% } %>
    </nav>
</header>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/_posts.ejs'),
`<% paginate.data.forEach((post) => { %>
    <section>
        <h3>
            <a href="/post/<%= post.file.replace('.md', '') %>"><%= post.title %></a>
        </h3>
        <p><%= post.markdown.substring(0, configs.intro.length) %>...</p>
    </section>
<% }); %>
<nav>
    <% for (let p = 1; p <= paginate.totalPages; p++) { %>
        <a href="?p=<%= p %>"><%= p %></a>
    <% } %>
<nav>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/admin_configs.ejs'),
`<html>
    <head>
        <%- include('_head.ejs'); -%>
    </head>
    <body>
        <%- include('_header.ejs'); -%>
        <main>
            <h1>configs</h1>
            <form method="post" action="/admin/configs">
                <section>
                    <p>
                        <label>blog.title</label>
                        <input name="blog.title" type="text" value="<%= configs.blog.title %>" required>
                    </p>
                    <p>
                        <label>blog.slogan</label>
                        <input name="blog.slogan" type="text" value="<%= configs.blog.slogan %>" required>
                    </p>
                </section>
                <p>
                    <label>template</label>
                    <input name="template" type="text" value="<%= configs.template %>" required>
                </p>
                <section>
                    <p>
                        <label>pagesize.index</label>
                        <input name="pagesize.index" type="text" value="<%= configs.pagesize.index %>" required>
                    </p>
                    <p>
                        <label>pagesize.category</label>
                        <input name="pagesize.category" type="text" value="<%= configs.pagesize.category %>" required>
                    </p>
                </section>
                <section>
                    <p>
                        <label>cookie.name</label>
                        <input name="cookie.name" type="text" value="<%= configs.cookie.name %>" required>
                    </p>
                    <p>
                        <label>cookie.secret</label>
                        <input name="cookie.secret" type="text" value="<%= configs.cookie.secret %>" required>
                    </p>
                </section>
                <p>
                    <label>intro.length (if template support)</label>
                    <input name="intro.length" type="text" value="<%= configs.intro.length %>" required>
                </p>
                <p>
                    <label>highlightjs.style (if template support)</label>
                    <input name="highlightjs.style" type="text" value="<%= configs.highlightjs.style %>" required>
                </p>
                <button type="submit">save configs</button>
            </form>
        </main>
        <%- include('_footer.ejs'); -%>
    </body>
</html>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/admin_post.ejs'),
`<html>
    <head>
        <%- include('_head.ejs'); -%>
    </head>
    <body>
        <%- include('_header.ejs'); -%>
        <main>
            <h1><%= post ? 'edit' : 'publish' %> post</h1>
            <form method="post" action="/admin/post/<%= post ? post.file.replace('.md', '') : '' %>">
                <p>
                    <label>content</label>
                    <textarea name="content" rows="55" required><%= post ? post.markdown : '[category]:# ()\\n[title]:# ()\\n\\n' %></textarea>
                </p>
                <button type="submit"><%= post ? 'edit' : 'publish' %> now</button>
            </form>
        </main>
        <%- include('_footer.ejs'); -%>
    </body>
</html>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/admin_security.ejs'),
`<html>
    <head>
        <%- include('_head.ejs'); -%>
    </head>
    <body>
        <%- include('_header.ejs'); -%>
        <main>
            <h1>security</h1>
            <form method="post" action="/admin/security" onsubmit="if (document.getElementById('password.new').value !== document.getElementById('password.new.confirm').value) { alert('The passwords entered twice are inconsistent'); return false; }">
                <p>
                    <label>old password</label>
                    <input name="password.old" type="password" required>
                </p>
                <p>
                    <label>new password</label>
                    <input id="password.new" name="password.new" type="password" required>
                </p>
                <p>
                    <label>new password confirm</label>
                    <input id="password.new.confirm" type="password" required>
                </p>
                <button type="submit">change password</button>
            </form>
        </main>
        <%- include('_footer.ejs'); -%>
    </body>
</html>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/auth_login.ejs'),
`<html>
    <head>
        <%- include('_head.ejs'); -%>
    </head>
    <body>
        <%- include('_header.ejs'); -%>
        <main>
            <form method="post" action="/auth/login">
                <p>
                    <label>Username</label>
                    <input name="username" type="text" required>
                </p>
                <p>
                    <label>Password</label>
                    <input name="password" type="password" required>
                </p>
                </div>
                <button type="submit">Sign in</button>
            </form>
        </main>
        <%- include('_footer.ejs'); -%>
    </body>
</html>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/category.ejs'),
`<html>
    <head>
        <%- include('_head.ejs'); -%>
    </head>
    <body>
        <%- include('_header.ejs'); -%>
        <main>
            <%- include('_posts.ejs'); -%>
        </main>
        <%- include('_footer.ejs'); -%>
    </body>
</html>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/index.ejs'),
`<html>
    <head>
        <%- include('_head.ejs'); -%>
    </head>
    <body>
        <%- include('_header.ejs'); -%>
        <main>
            <%- include('_posts.ejs'); -%>
        </main>
        <%- include('_footer.ejs'); -%>
    </body>
</html>`);
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'template/default/post.ejs'),
`<html>
    <head>
        <%- include('_head.ejs'); -%>
        <link rel="stylesheet" type="text/css" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.8.0/styles/<%= configs.highlightjs.style %>.min.css">
    </head>
    <body>
        <%- include('_header.ejs'); -%>
        <main>
            <h1><%= post.title %></h1>
            <p>
                <small>
                    <%= post.birthtime %>
                    <% if (session.username !== undefined) { %>
                        <small>/</small>
                        <a href="/admin/post/<%= post.file.replace('.md', '') %>">edit</a>
                        <small>/</small>
                        <a href="/admin/post/<%= post.file.replace('.md', '') %>/delete" onclick="return confirm('It cannot be recovered after deletion. Do you want to confirm the deletion?')">delete</a>
                    <% } %>
                </small>
            </p>
            <%- post.html %>
        </main>
        <%- include('_footer.ejs'); -%>
        <script src="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
        <script>hljs.highlightAll();</script>
    </body>
</html>`);
    console.log('generate config file...');
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'config.yml'), require('yaml').stringify({
        blog: { title: 'ChaosCodex', slogan: 'Hello World!' },
        pagesize: { index: 10, category: 10 },
        cookie: { name: 'sess', secret: require('uuid').v4() },
        auth: { username: 'admin', password: '4a9b3ca6-6bc3-40d4-be85-c9fa9085d40e#df1c0d2200cb2b1fafb4fa8092927f85' },
        template: 'default',
        intro: { length: 180 },
        highlightjs: { style: 'stackoverflow-dark' }
    }));
}

// requires
const _req_express = require('express'),
    _req_yaml = require('yaml'),
    _req_crypto_js = require('crypto-js'),
    _req_uuid = require('uuid'),
    _req_cookie_session = require('cookie-session'),
    _req_body_parser = require('body-parser'),
    _req_page_hopper = require('page-hopper'),
    _req_markdown_it = require('markdown-it')()
        .use(require('markdown-it-toc'))
        .use(require('markdown-it-katex'));

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

// https://www.npmjs.com/package/body-parser
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
    const paginate = _req_page_hopper(_tools.posts, req.query.p ? parseInt(req.query.p) : 1, _configs.pagesize.index);
    res.render(`${_configs.template}/index`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap),
        paginate: paginate
    });
})
.get('/category/:id', (req, res) => {
    const categoryPosts = _tools.categoryPostsMap[req.params.id];
    if (!categoryPosts) {
        throw new Error('category not found');
    }
    const paginate = _req_page_hopper(categoryPosts, req.query.p ? parseInt(req.query.p) : 1, _configs.pagesize.category);
    res.render(`${_configs.template}/category`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap),
        paginate: paginate
    });
})
.get('/post/:id([a-z0-9\-]{36})', (req, res) => {
    const post = _tools.findPost(req.params.id);
    if (!post) {
        throw new Error('post not found');
    }
    res.render(`${_configs.template}/post`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap),
        post: post
    });
})

// auth routes
.get('/auth/login', (req, res) => {
    res.render(`${_configs.template}/auth_login`, {
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
    res.render(`${_configs.template}/admin_post`, {
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
.get('/admin/configs', (req, res) => {
    res.render(`${_configs.template}/admin_configs`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap)
    });
})
.post('/admin/configs', (req, res) => {
    _configs.blog.title = req.body['blog.title'];
    _configs.blog.slogan = req.body['blog.slogan'];
    _configs.template = req.body['template'];
    _configs.pagesize.index = parseInt(req.body['pagesize.index']);
    _configs.pagesize.category = parseInt(req.body['pagesize.category']);
    _configs.cookie.name = req.body['cookie.name'];
    _configs.cookie.secret = req.body['cookie.secret'];
    _configs.intro.length = parseInt(req.body['intro.length']);
    _configs.highlightjs.style = req.body['highlightjs.style'];
    _req_node_fs.writeFileSync(_req_node_path.join(__dirname, 'config.yml'), _req_yaml.stringify(_configs));
    res.redirect('/admin/configs');
})
.get('/admin/security', (req, res) => {
    res.render(`${_configs.template}/admin_security`, {
        session: req.session,
        configs: _configs,
        categories: Object.keys(_tools.categoryPostsMap)
    });
})
.post('/admin/security', (req, res) => {
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
