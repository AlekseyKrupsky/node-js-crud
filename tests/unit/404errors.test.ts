import request from "supertest";

describe('CRUD flow test', () => {
    it('should return 404 get user', (done) => {
        const uuid = 'f0e87e30-ee22-11ec-bc5e-9522bf355f18';

        request('http://localhost:3000')
            .get(`/api/users/${uuid}`)
            .expect((response) => {
                expect(response.body.message).toBe('User with provided UUID was not found');
            })
            .expect(404, done);
    });

    it('should return 404 on invalid route', (done) => {
        request('http://localhost:3000')
            .get(`/invalidroute`)
            .expect((response) => {
                expect(response.body.message).toBe('URL doesn\'t exist');
            })
            .expect(404, done);
    });
});