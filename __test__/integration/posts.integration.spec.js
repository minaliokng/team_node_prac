const supertest = require('supertest');
const express = require("express");
const app = require('../../app.js');
const { sequelize } = require('../../models/index.js');
const authMiddleWare = require("../../middlewares/index");
const { agent } = require('supertest');
const cookieParser = require('cookie-parser');

// 통합 테스트(Integration Test)를 진행하기에 앞서 Sequelize에 연결된 모든 테이블의 데이터를 삭제합니다.
//  단, NODE_ENV가 test 환경으로 설정되어있는 경우에만 데이터를 삭제합니다.
beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync();
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});

let req = {
  cookies: jest.fn(),
}
let next = jest.fn();
let res = {
  status: jest.fn(),
  json: jest.fn(),
  locals: jest.fn(),
  send: jest.fn(),
};




describe('Layered Architecture Pattern, Posts Domain Integration Test', () => {

  test('GET /posts API (getPosts) Integration Test Success Case, Not Found Posts Data', async () => {
    const response = await supertest(app)
      .get(`/posts`) // API의 HTTP Method & URL

    expect(response.status).toEqual(201);
    // expect(response.body).toEqual({ "Data": [] })
  });

  // test('POST /posts API (createPost) Integration Test Success Case', async () => {

  //   req.cookies = {
  //     token:
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjcxMDAyNjU5fQ.TpYMWxgOOwv2jQtj73B_mqlgwCfEifWuBKG6Fh-8bF4'
  //   }
  //   const createPostRequestBodyParams = {
  //     title: "title",
  //     content: "content"
  //   };

  //   const response = await supertest(app).post('/posts').set('cookie', `token=${req.cookies.token}`).send(createPostRequestBodyParams)

  //   expect(response.status).toEqual(200);
  //   expect(response.body).toEqual({ message: '게시글작성 성공~!' })
  // });



  test('POST /api/posts API (createPost) Integration Test Error Case, Invalid Params Error', async () => {
    req.cookies = {
    };
    const createPostRequestBodyParams = {
      title: "title",
      content: "content"
    };

    const response = await supertest(app).post('/posts').set('cookie', `token=${req.cookies.token}`).send(createPostRequestBodyParams)

    expect(response.status).toEqual(402);
    expect(response.body).toEqual({
      errorMessage: '로그인 후 사용가능합니다.'
    })
  });

  test('POST /api/posts API (createPost) Integration Test Error Case, Invalid Data(title,content) Error', async () => {
    req.cookies = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjcxMDAyNjU5fQ.TpYMWxgOOwv2jQtj73B_mqlgwCfEifWuBKG6Fh-8bF4'
    }
    const createPostRequestBodyParams = {
      title: "",
      content: ""
    };

    const response = await supertest(app).post('/posts').set('cookie', `token=${req.cookies.token}`).send(createPostRequestBodyParams)

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ "errorMessage": "errorMessage" });
  });

  test('GET /api/posts/:like API (createPost) Integration Test Success Case', async () => {
    const response = await supertest(app).get('/posts/1').query(1)

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      Data: {
        "content": "content1",
        "created_at": "2022-12-13T08:10:07.000Z",
        "likes": 0,
        "postId": 1,
        "title": "title1",
        "userId": 1,
      }
    });
  });

  test('GET /api/posts/:like API (createPost) Integration Test Fail Case no exist post', async () => {
    const response = await supertest(app).get('/posts/3')

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ Data: null });
  });
});


afterAll(async () => {
  // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화합니다.
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: false });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});