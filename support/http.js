const http = require('http');

const request = (app, { method = 'GET', path = '/', headers = {}, body } = {}) => new Promise((resolve, reject) => {
  const server = http.createServer(app);

  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        method,
        path,
        headers
      },
      (res) => {
        let data = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          server.close(() => {
            let json = null;

            if (data) {
              try {
                json = JSON.parse(data);
              } catch (error) {
                json = null;
              }
            }

            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data,
              json
            });
          });
        });
      }
    );

    req.on('error', (error) => {
      server.close(() => reject(error));
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });

  server.on('error', reject);
});

module.exports = { request };
