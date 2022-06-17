import http from 'http';

for (let i = 0; i < 10e3; i++) {
    const req = http.request('http://localhost:3000/api/users', res => {
        console.log(`StatusCode: ${res.statusCode}\n`);

        res.on('data', d => {
            process.stdout.write(d);
        });
    });

    req.end();
}
