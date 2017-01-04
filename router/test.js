import Router from 'koa-router'
import { upload } from './../helper'
var pg = require('pg');

const test = new Router({
  prefix: '/test'
})

test
  .get('/json', ctx => {
    ctx.body = {
      test: 'json'
    }
  })
  .get('/db', ctx => {

		// create a config to configure both pooling behavior
		// and client options
		// note: all config is optional and the environment variables
		// will be read if the config is not present
		let config = {
			user: 'postgres', //env var: PGUSER
			database: 'ping_dev', //env var: PGDATABASE
			password: '22143521', //env var: PGPASSWORD
			host: 'localhost', // Server hosting the postgres database
			port: 5432, //env var: PGPORT
			max: 10, // max number of clients in the pool
			idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
		};


		//this initializes a connection pool
		//it will keep idle connections open for a 30 seconds
		//and set a limit of maximum 10 idle clients
		var pool = new pg.Pool(config);

		// to run a query we can acquire a client from the pool,
		// run a query on the client, and then return the client to the pool
		pool.connect(function(err, client, done) {
			if(err) {
				return console.error('error fetching client from pool', err);
			}
			client.query('SELECT $1::int AS number', ['1'], function(err, result) {
				//call `done()` to release the client back to the pool
				done();

				if(err) {
					return console.error('error running query', err);
				}
				console.log(result.rows[0].number + '  2343');
        ctx.body = 'this is test page!'
				//output: 1
			});
		});

		pool.on('error', function (err, client) {
			// if an error is encountered by a client while it sits idle in the pool
			// the pool itself will emit an error event with both the error and
			// the client which emitted the original error
			// this is a rare occurrence but can happen if there is a network partition
			// between your application and the database, the database restarts, etc.
			// and so you might want to handle it and at least log it out
			console.error('idle client error', err.message, err.stack)
		})
  })
  .post('/post', ctx => {
    ctx.body = ctx.request.body
  })
  .post('/file', upload.single('avatar'), async ctx => {
    ctx.body = ctx.req.file
  })
  .post('/files', upload.any(), async ctx => {
    ctx.body = ctx.req.files
  })

export default test
