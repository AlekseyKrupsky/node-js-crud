# node-js-crud

**How to run?**

Run single instance: `npm run start` (preferable) or `npm run start:prod`

Run many instances:`npm run start:multi` or `npm run start:prod:multi`

When multi-instance application is running, `testBalance.mjs` can be used to test load balancing:
 > node testBalance.mjs

Use `taskkill /F /PID {PID}` to kill process on Windows or `kill {PID}` on Linux.
New process should be run automatically instead killed one.

**How to run tests?**
1) Make sure dist folder is deleted and app is not running
2) Run the server on 3000 port: `npm run start` or `npm run start:multi`
3) Run tests in separate console: `npm run test`
