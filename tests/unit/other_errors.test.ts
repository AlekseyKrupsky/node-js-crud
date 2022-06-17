import request from "supertest";

describe('CRUD flow test', () => {
    it('should return 400 error on invalid uuid', (done) => {
        const invalidUUID = 'abc';

        request('http://localhost:3000')
            .get(`/api/users/${invalidUUID}`)
            .expect((response) => {
                expect(response.body.message).toBe('Invalid UUID was provided');
            })
            .expect(400, done);
    });

    it('should not create new user with invalid name and response validation error', (done) => {
        const invalidUserPayload = {
            name: 100,
            age: 25,
            hobbies: ['football']
        };

        request('http://localhost:3000')
            .post('/api/users')
            .send(invalidUserPayload)
            .expect((response) => {
                expect(response.body.message).toBe('Validation failed. Please check fields you sent');
            })
            .expect(400, done);
    });

    it('should not create new user with invalid age and response validation error', (done) => {
        const invalidUserPayload = {
            name: 'John',
            age: "25",
            hobbies: ['football']
        };

        request('http://localhost:3000')
            .post('/api/users')
            .send(invalidUserPayload)
            .expect((response) => {
                expect(response.body.message).toBe('Validation failed. Please check fields you sent');
            })
            .expect(400, done);
    });

    it('should not create new user with invalid hobbies and response validation error', (done) => {
        const invalidUserPayload = {
            name: 'John',
            age: 25,
            hobbies: false
        };

        request('http://localhost:3000')
            .post('/api/users')
            .send(invalidUserPayload)
            .expect((response) => {
                expect(response.body.message).toBe('Validation failed. Please check fields you sent');
            })
            .expect(400, done);
    });

    it('should not create new user with missing field and response validation error', (done) => {
        const invalidUserPayload = {
            name: 'John',
            age: 25
        };

        request('http://localhost:3000')
            .post('/api/users')
            .send(invalidUserPayload)
            .expect((response) => {
                expect(response.body.message).toBe('Validation failed. Please check fields you sent');
            })
            .expect(400, done);
    });

    it('should return 500 on invalid json', (done) => {
        request('http://localhost:3000')
            .post(`/api/users`)
            .send('invalidPayload')
            .expect((response) => {
                expect(response.body.message).toBe('Internal Error');
            })
            .expect(500, done);
    });
});