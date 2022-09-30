const {sessionServer} = require('./mongo.conf');
module.exports = {
    secret: "qwerasdf",
    session: (MongoStore) => {
        return {
            resave: false,//添加这行，重新保存：强制会话保存即使是未修改的；
            saveUninitialized: false,//添加这行 ，强制“未初始化的”会话保存到存储
            rolling: true,
            key: "source~",//cookie name
            cookie: {
                path: '/',
                httpOnly: true,
                secure: false, // TODO: Set to true when HTTPS was used.
                maxAge: 1000 * 60 * 30 //1000 毫秒 *60秒 * 10分钟 1000 * 60 *30 session失效时长
                //  maxAge: 1000 * 5
                //  maxAge: 1000 * 60 *60*24*7 //1000 毫秒 *60秒 * 10分钟
            },
            secret: "qwerasdf",
            store: new MongoStore({
                //url: 'mongodb://localhost:27017/rd-cache',
                url: sessionServer.uri,
                stringify: false
            })
        }
    },
};

