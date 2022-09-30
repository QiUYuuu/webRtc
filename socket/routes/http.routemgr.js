module.exports = app => {
    app.options('/', (req, res) => res.status(200).end());
    app.get('/', (req, res) => {
        res.status(404).end();
    });
    
    const urlTemp = 'ccsyb-';
    const webSocketmUrlTemp = 'socket-';


    app.use('/' + webSocketmUrlTemp +'test', require('./test'));
};
