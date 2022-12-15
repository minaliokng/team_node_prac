// __tests__/integration/posts.integration.spec.js

const supertest = require('supertest');
const app = require('../../app.js');
const { sequelize } = require('../../models/index.js');

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync();
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});


describe('Layered Architecture Pattern, Posts Domain Integration Test', () => {
  let loginToken = null;

  test('POST /signup API - 테스트를 위한 계정 준비', async () => {
    const signupData1 = {
      nickname: "test",
      password: "1234",
      confirm: "1234"
    }
    const signupData2 = {
      nickname: "test1",
      password: "1234",
      confirm: "1234"
    }

    const response1 = await supertest(app)
      .post(`/signup`)
      .send(signupData1)

    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual({ message: '회원 가입에 성공하였습니다.' })

    const response2 = await supertest(app)
      .post(`/signup`)
      .send(signupData2)

    expect(response2.status).toEqual(200);
    expect(response2.body).toEqual({ message: '회원 가입에 성공하였습니다.' })
  })

  test('GET /posts API - Success', async () => {
    const response = await supertest(app)
      .get(`/posts`)

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ data: [] });
  });

  test('POST /posts API - 테스트를 위한 게시글 작성', async () => {
    const dumyData = [
      {
        title: "title_1",
        content: "content_1"
      },
      {
        title: "title_2",
        content: "content_2"
      },
      {
        title: "title_3",
        content: "content_3"
      },
    ]

    const user1 = {
      nickname: "test",
      password: "1234"
    }
    const user2 = {
      nickname: "test1",
      password: "1234"
    }


    console.log("OOOOOOOOOOOOOOOOOOOOO")
    const response1 = await supertest(app)
      .post(`/login`)
      .send(user1)

    loginToken = response1.body.token;
    console.log(loginToken)

    for (let i = 0; i < 3; i++) {
      console.log(1, i);
      await supertest(app)
        .post(`/posts`)
        .send(dumyData[i])
        .set('Cookie', `token=${loginToken}`)
    }

    const response2 = await supertest(app)
      .post(`/login`)
      .send(user2)

    loginToken = response2.body.token;
    console.log(loginToken)

    for (let i = 0; i < 3; i++) {
      console.log(2, i);
      await supertest(app)
        .post(`/posts`)
        .send(dumyData[i])
        .set('Cookie', `token=${loginToken}`)
    }
  })

  test('POST /login API - 테스트를 위한 로그인', async () => {
    const user1 = {
      nickname: "test",
      password: "1234"
    }

    const response = await supertest(app)
      .post(`/login`)
      .send(user1)

    loginToken = response.body.token;
  })

  test('POST /posts API (createPost)  - Error: 로그인 정보 없음', async () => {
    const response = await supertest(app)
      .post(`/posts`)

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ errorMessage: '로그인 후 사용해주세요.' });
  });

  test('POST /posts API (createPost)  - Error: 형식 오류(title 없음)', async () => {
    const response = await supertest(app)
      .post(`/posts`)
      .send({content: "content"})
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ errorMessage: '잘못된 형식입니다.' });
  });

  test('POST /posts API (createPost)  - Error: 형식 오류(content 없음)', async () => {
    const response = await supertest(app)
      .post(`/posts`)
      .send({title: "title"})
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ errorMessage: '잘못된 형식입니다.' });
  });

  test('POST /posts API (createPost)  - Success', async () => {
    const response = await supertest(app)
      .post(`/posts`)
      .send({ title: "title", content: "content" })
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: '게시글작성 성공~!' });
  });

  test('PUT /posts/:postId/like API - Error: 로그인 정보 없음', async () => {
    const response = await supertest(app)
      .put(`/posts/1/like`)

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ errorMessage: '로그인 후 사용해주세요.' })
  });

  test('PUT /posts/:postId/like API - Error: params 해당 글 없음', async () => {
    const response = await supertest(app)
      .put(`/posts/100/like`)
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: "존재하지 않는 게시글입니다." })
  });

  test('PUT /posts/:postId/like API - Success: 좋아요 등록', async () => {
    const response1 = await supertest(app)
      .put(`/posts/1/like`)
      .set('Cookie', `token=${loginToken}`)

    expect(response1.status).toEqual(200);
    expect(response1.body).toEqual({ message: "게시글의 좋아요를 등록하였습니다." })

    const response2 = await supertest(app)
      .put(`/posts/4/like`)
      .set('Cookie', `token=${loginToken}`)

    expect(response2.status).toEqual(200);
    expect(response2.body).toEqual({ message: "게시글의 좋아요를 등록하였습니다." })
  });

  test('PUT /posts/:postId/like API - Success: 좋아요 취소', async () => {
    const response = await supertest(app)
      .put(`/posts/1/like`)
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: "게시글의 좋아요를 취소하였습니다." })
  });

  test('GET /posts/like API - Error: 로그인 정보 없음', async () => {
    const response = await supertest(app)
      .get(`/posts/like`)

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ errorMessage: '로그인 후 사용해주세요.' })
  });

  test('GET /posts/like API - Success', async () => {
    const response = await supertest(app)
      .get(`/posts/like`)
      .set('Cookie', `token=${loginToken}`)

    const data = await supertest(app)
      .get(`/posts/4`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({ Data: [data.body.Data] })
  });

  test('GET /posts/:postId API - Error: params 해당 글 없음', async () => {
    const response = await supertest(app)
      .get(`/posts/100`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({ Data: null })
  });

  test('GET /posts/:postId API - Success', async () => {
    const response = await supertest(app)
      .get(`/posts/1`)

    expect(response.status).toEqual(200)
  });

  test('PUT /posts/:postId API - Error: params 해당 글 없음', async () => {
    const response = await supertest(app)
      .put(`/posts/100`)
      .set('Cookie', `token=${loginToken}`)
      .send({title: "title", content: "content"})

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({ errorMessage: "존재하지 않는 게시글입니다." })
  });

  test('PUT /posts/:postId API - Error: 로그인 정보 없음', async () => {
    const response = await supertest(app)
      .put(`/posts/1`)

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ errorMessage: '로그인 후 사용해주세요.' })
  });

  test('PUT /posts/:postId API - Error: 본인 소유 아님', async () => {
    const response = await supertest(app)
      .put(`/posts/5`)
      .set('Cookie', `token=${loginToken}`)
      .send({title: "title", content: "content"})

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: '본인 소유의 게시글이 아닙니다' })
  });

  test('PUT /posts/:postId API - Error: 형식 오류(title 없음)', async () => {
    const response = await supertest(app)
      .put(`/posts/1`)
      .set('Cookie', `token=${loginToken}`)
      .send({content: "content"})

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: '잘못된 형식입니다.' })
  });

  test('PUT /posts/:postId API - Error: 형식 오류(content 없음)', async () => {
    const response = await supertest(app)
      .put(`/posts/1`)
      .set('Cookie', `token=${loginToken}`)
      .send({title: "title"})

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: '잘못된 형식입니다.' })
  });

  test('PUT /posts/:postId API - Success', async () => {
    const response = await supertest(app)
      .put(`/posts/1`)
      .set('Cookie', `token=${loginToken}`)
      .send({title: "title", content: "content"})

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({ message: '수정 성공' })
  });

  test('DELETE /posts/:postId API - Error: 로그인 정보 없음', async () => {
    const response = await supertest(app)
      .delete(`/posts/1`)
      .send({title: "title", content: "content"})

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ errorMessage: '로그인 후 사용해주세요.' })
  });

  test('DELETE /posts/:postId API - Error: params 해당 글 없음', async () => {
    const response = await supertest(app)
      .delete(`/posts/100`)
      .send({title: "title", content: "content"})
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({ errorMessage: "존재하지 않는 게시글입니다." })
  });

  test('DELETE /posts/:postId API - Error: 본인 소유 아님', async () => {
    const response = await supertest(app)
      .delete(`/posts/4`)
      .send({title: "title", content: "content"})
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: "본인 소유의 게시글이 아닙니다" })
  });

  test('DELETE /posts/:postId API - Success', async () => {
    const response = await supertest(app)
      .delete(`/posts/1`)
      .send({title: "title", content: "content"})
      .set('Cookie', `token=${loginToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({ message: "삭제 성공" })
  });
});


afterAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});