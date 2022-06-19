import request from "supertest";

describe('CRUD flow test', () => {
    let testUUID = '';

    const userPayload = {
        name: 'John',
        age: 25,
        hobbies: ['football']
    };

     it('should show all users - empty array', (done) => {
        request('http://localhost:3000')
            .get('/api/users')
            .expect(200, [], done);
    });

    it('should create new user', (done) => {
        request('http://localhost:3000')
            .post('/api/users')
            .send(userPayload)
            .expect((response) => {
                expect(typeof response.body.uuid === "string").toBe(true);
                expect(response.body.name).toBe(userPayload.name);
                expect(response.body.age).toBe(userPayload.age);
                expect(response.body.hobbies).toEqual(userPayload.hobbies);

                testUUID = response.body.uuid;
            })
            .expect(201, done);
    });

    it('should read created user', (done) => {
        request('http://localhost:3000')
            .get(`/api/users/${testUUID}`)
            .expect((response) => {
                expect(response.body.uuid).toBe(testUUID);
                expect(response.body.name).toBe(userPayload.name);
                expect(response.body.age).toBe(userPayload.age);
                expect(response.body.hobbies).toEqual(userPayload.hobbies);
            })
            .expect(200, done);
    });

    it('should update created user', (done) => {
        const newUserPayload = {
            name: 'Ben',
            age: 20,
            hobbies: []
        };

        request('http://localhost:3000')
            .put(`/api/users/${testUUID}`)
            .send(newUserPayload)
            .expect((response) => {
                expect(response.body.uuid).toBe(testUUID);
                expect(response.body.name).toBe(newUserPayload.name);
                expect(response.body.age).toBe(newUserPayload.age);
                expect(response.body.hobbies).toEqual(newUserPayload.hobbies);
            })
            .expect(200, done);
    });

    it('should delete created user', (done) => {
        request('http://localhost:3000')
            .delete(`/api/users/${testUUID}`)
            .expect((response) => {
                expect(response.body).toBe('');
            })
            .expect(204, done);
    });

    it('should return 404 for deleted user', (done) => {
        request('http://localhost:3000')
            .get(`/api/users/${testUUID}`)
            .expect((response) => {
                expect(response.body.message).toBe('User with provided UUID was not found');
            })
            .expect(404, done);
    });
});