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
    expect(response.body).toEqual({ Data: [] })
  });

  test('POST /posts API (createPost) Integration Test Success Case', async () => {

    req.cookies = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjcxMDAyNjU5fQ.TpYMWxgOOwv2jQtj73B_mqlgwCfEifWuBKG6Fh-8bF4'
    }
    const createPostRequestBodyParams = {
      title: "title",
      content: "content"
    };

    const response = await supertest(app).post('/posts').set('cookie', `token=${req.cookies.token}`).send(createPostRequestBodyParams)

    expect(response.status).toEqual(200);
  });



  test('POST /api/posts API (createPost) Integration Test Error Case, Invalid Params Error', async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });

  test('GET /api/posts API (getPosts) Integration Test Success Case, is Exist Posts Data', async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });
});


afterAll(async () => {
  // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화합니다.
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: false });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});