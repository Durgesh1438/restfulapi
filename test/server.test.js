const request = require('supertest');
const app=require('../server')
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');


require('dotenv').config

describe('Database Connection', () => {
    it('connects to the database without error', (done) => {
      db.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          done.fail(err); 
        } else {
          console.log('Connected to the database');
          connection.release(); 
          done(); 
        }
      });
    });
  });

describe('Server', () => {
  it('responds with "hii from server" for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('hii from server');
  });
  describe('User Authentication', () => {
    it('registers a new user and returns 201', async () => {
        const username = 'testuser';
        const password = 'testpassword';
        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await request(app)
            .post('/users/register')
            .send({ username, password });

        expect(response.status).toBe(201);
    });

    it('logs in with valid credentials and returns JWT token', async () => {
        const username = 'testuser';
        const password = 'testpassword';

        const response = await request(app)
            .post('/users/login')
            .send({ username, password });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('fails to log in with invalid credentials and returns 401', async () => {
        const username = 'invaliduser';
        const password = 'invalidpassword';

        const response = await request(app)
            .post('/users/login')
            .send({ username, password });

        expect(response.status).toBe(401);
    });
  });

  describe('User Profile Management', () => {
    let token;

    beforeAll(async () => {
        const username = 'testuser';
        const password = 'testpassword';

       
        const loginResponse = await request(app)
            .post('/users/login')
            .send({ username, password });

        token = loginResponse.body.token;
    });
    it('denies access to /users/admin for normal user', async () => {
        
        const response = await request(app)
            .get('/users/admin')
            .set('Authorization', token);

        
        expect(response.status).toBe(403);
    });
    it('gets user profile with valid JWT token', async () => {
        const response = await request(app)
            .get('/users/profile')
            .set('Authorization',token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username');
        expect(response.body).toHaveProperty('id');
    });

    it('updates user profile with valid JWT token', async () => {
        const updatedUsername = 'updateduser';

        const response = await request(app)
            .put('/users/profile')
            .set('Authorization',token)
            .send({ username: updatedUsername });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User profile updated successfully');
    });

    it('deletes user profile with valid JWT token', async () => {
        const response = await request(app)
            .delete('/users/profile')
            .set('Authorization',token);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User profile deleted successfully');
    });
   });
   describe('Admin Access', () => {
    let adminToken;

    beforeAll(async () => {
        const username = 'admin';
        const password = 'admin1438*';

        const loginResponse = await request(app)
            .post('/users/login')
            .send({ username, password });

        adminToken = loginResponse.body.token;
    });

    it('gets all users with admin access', async () => {
        const response = await request(app)
            .get('/users/admin')
            .set('Authorization',adminToken);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
    
   });

});

describe('Post Routes', () => {
    let token;

    beforeAll(async () => {
        const username = 'durgesh';
        const password = 'durgesh1438*';

        
        const loginResponse = await request(app)
            .post('/users/login')
            .send({ username, password });

        token = loginResponse.body.token;
    });

    it('creates a new post and returns 201', async () => {
        const title = 'Test Post';
        const content = 'This is a test post';

        const response = await request(app)
            .post('/posts')
            .set('Authorization', token)
            .send({ title, content });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Post created successfully');
    });
    
    it('gets all posts and returns 200', async () => {
        const response = await request(app)
            .get('/posts');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('gets a post by ID and returns 200', async () => {
       
        const postId = 2;

        const response = await request(app)
            .get(`/posts/${postId}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('updates a post and returns 200', async () => {
        
        const postId = 2;
        const updatedTitle = 'Ai Technology';

        const response = await request(app)
            .put(`/posts/${postId}`)
            .set('Authorization', token)
            .send({ title: updatedTitle });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Post updated successfully');
    });
   
    it('deletes a post and returns 200', async () => {
        
        const postId = 3;

        const response = await request(app)
            .delete(`/posts/${postId}`)
            .set('Authorization', token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Post deleted successfully');
    });

    describe('Post Routes - Unauthenticated', () => {
        it('fails to update a post without authentication and returns 401', async () => {
            
            const postId = 1;
            const updatedTitle = 'Updated Test Post';
    
            const response = await request(app)
                .put(`/posts/${postId}`)
                .send({ title: updatedTitle });
    
            expect(response.status).toBe(401);
        });
       
        it('fails to delete a post without authentication and returns 401', async () => {
            
            const postId = 3;
    
            const response = await request(app)
                .delete(`/posts/${postId}`);
    
            expect(response.status).toBe(401);
        });
    });
});
