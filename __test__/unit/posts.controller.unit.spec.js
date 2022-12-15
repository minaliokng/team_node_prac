const PostsController = require("../../controllers/posts.controller.js");


// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostService = {
  findAllPost: jest.fn(),
  getOnePost: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
}

let mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: jest.fn(),
  send: jest.fn(),
};

let postsController = new PostsController();
// postsController의 Service를 Mock Service로 변경합니다.
postsController.postService.postRepository = mockPostService;

describe('Layered Architecture Pattern Posts Controller Unit Test', () => {

  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status = jest.fn(() => {
      return mockResponse
    });
    next = jest.fn()
  })

  test('Posts Controller getPosts Method by Success', async () => {
    const findAllPostReturnValue = [
      {
        postId: 2,
        nickname: 'post2',
        title: 'post2',
        content: 'content2',
        createdAt: new Date('22 October 2022 00:00'),
        updatedAt: new Date('22 October 2022 00:00'),
      },
      {
        postId: 1,
        nickname: 'post1',
        title: 'post1',
        content: 'content1',
        createdAt: new Date('11 October 2022 00:00'),
        updatedAt: new Date('11 October 2022 00:00'),
      },
    ];

    mockPostService.findAllPost = jest.fn(() => {
      return findAllPostReturnValue;
    });

    await postsController.getPosts(mockRequest, mockResponse)
    expect(mockPostService.findAllPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.findAllPost).toHaveBeenCalledWith();
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(
      {
        Data: findAllPostReturnValue
      }
    );
  });

  test('Posts Controller createPost Method by Success', async () => {
    const createPostReturnValue =
    {
      postId: 1,
      nickname: 'nickname1',
      title: 'title1',
      content: 'content1',
      createdAt: new Date('22 October 2022 00:00'),
      updatedAt: new Date('22 October 2022 00:00'),
    };

    mockRequest.body = {
      title: "title1",
      content: "content1"
    }

    mockResponse.locals = {
      user: {
        dataValues: {
          userId: 1
        }
      }
    }

    mockPostService.createPost = jest.fn(() => {
      return createPostReturnValue
    });

    await postsController.createPost(mockRequest, mockResponse);

    expect(mockPostService.createPost).toHaveBeenCalledTimes(1)
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);

  });

  test('Posts Controller createPost Method by Invalid Params Error', async () => {
    mockRequest.body = {

    };

    mockResponse.locals = {
      user: {
        dataValues: {
          userId: 1
        },
      },
    };

    mockPostService.createPost = jest.fn(() => {
      return { errorMessage: 'errorMessage' }
    });

    await postsController.createPost(mockRequest, mockResponse);
    expect(mockPostService.createPost).toHaveBeenCalledTimes(0);
  });

  test('Posts Controller getPostInfo Method by Invalid Params Success', async () => {
    mockRequest.params = {
      postId: 1
    };

    const getOnePostReturnValue =
    {
      postId: 1,
      nickname: 'nickname1',
      title: 'title1',
      content: 'content1',
      createdAt: new Date('22 October 2022 00:00'),
      updatedAt: new Date('22 October 2022 00:00'),
    };

    mockPostService.getOnePost = jest.fn(() => {
      return { Data: getOnePostReturnValue };
    });

    await postsController.getPostInfo(mockRequest, mockResponse);
    expect(mockPostService.getOnePost).toHaveBeenCalledTimes(1);
  });

  test('Posts Controller getPostInfo Method by Invalid Params Fail', async () => {
    // 이곳은 에러가 날곳이 없는디
  });

  test('Posts Controller updatePost Method by Success', async () => {
    const updatePostReturnValue =
    {
      postId: 1,
      nickname: 'nickname1',
      title: 'title1',
      content: 'content1',
      createdAt: new Date('22 October 2022 00:00'),
      updatedAt: new Date('22 October 2022 00:00'),
    };

    mockRequest.body = {
      title: "title1",
      content: "content1"
    }

    mockResponse.locals = {
      user: {
        dataValues: {
          userId: 1
        }
      }
    }

    mockPostService.updatePost = jest.fn(() => {
      return updatePostReturnValue
    });

    await postsController.updatePost(mockRequest, mockResponse, next);

    expect(mockPostService.updatePost).toHaveBeenCalledTimes(1)
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);

  });

  test('Posts Controller updatePost Method by Invalid Params Error', async () => {
    mockRequest.body = {

    };

    mockResponse.locals = {
      user: {
        dataValues: {
          userId: 1
        },
      },
    };

    mockPostService.updatePost = jest.fn(() => {
      return { errorMessage: 'errorMessage' }
    });

    await postsController.updatePost(mockRequest, mockResponse, next);
    expect(mockPostService.updatePost).toHaveBeenCalledTimes(0);
  });

});