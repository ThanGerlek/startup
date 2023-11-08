'use strict'

const app = require('./server');

const port = 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
