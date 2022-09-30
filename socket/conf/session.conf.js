module.exports = {
    resave: false,
    saveUninitialized: false,
    rolling: true,
    key: "booom",
    secret: "qwerasdf",
    cookie: {
        path: '/',
        // 开启httpOnly
        httpOnly: true,
        secure: false, // Be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.
        // 设置session过期时间
        maxAge: 1000 * 600,
    }
};
