
const PostsController = require("../../controllers/posts.controller.js");

let mockPostService = jest.mock("../../services/posts.service.js");

let next = (err) => { console.log(err); }
let data = {
  postId: 1,
  userId: 1,
  title: "title",
  content: "content"
}

let mockRequest = {
  body: jest.fn(),
  params: data
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: data
};

let postsController = new PostsController();
postsController.postService = mockPostService;

describe('Layered Architecture Pattern Posts Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResponse.status = jest.fn(() => {
      return mockResponse
    });
  })

  test('posts.controller.getPosts', async () => {
    mockPostService.findAllPost = jest.fn(() => ["post Data"]);
    try {
      await postsController.getPosts(mockRequest, mockResponse, next);
    }
    catch (err) {
      next(err);
    }

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      Data: ["post Data"],
    });
  });

  test('posts.controller.createPost - success data', async () => {
    mockPostService.createPost = jest.fn(() => {
      return;
    });
    mockRequest.body = data;

    await postsController.createPost(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '게시글작성 성공~!',
    });
  });

  test('posts.controller.createPost - error data', async () => {
    mockPostService.createPost = jest.fn(() => {
      return;
    });
    const errorData = {
      content: "content"
    }
    mockRequest.body = errorData;

    await postsController.createPost(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errorMessage: '잘못된 형식입니다.',
    });
  });

  test('posts.controller.getLike', async () => {
    mockPostService.getLike = jest.fn(() => {
      return [];
    })
    await postsController.getLike(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      Data: []
    });
  })

  test('posts.controller.getPostInfo', async () => {
    mockPostService.getOnePost = jest.fn(() => {
      return {};
    })
    mockRequest.body = data;

    await postsController.getPostInfo(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      Data: {}
    });
  })

  test('posts.controller.updatePost', async () => {
    mockPostService.updatePost = jest.fn(() => {
      return {
        message: "수정 성공",
        code: 200
      }
    })
    mockRequest.body = data;

    await postsController.updatePost(mockRequest, mockResponse, next);
    
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "수정 성공"
    });
  })

  test('posts.controller.deletePost', async () => {
    mockPostService.deletePost = jest.fn(() => {
      return {
        message: "삭제 성공",
        code: 200
      }
    })
    
    await postsController.deletePost(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "삭제 성공"
    });
  })

  test('posts.controller.updateLike', async () => {
    mockPostService.updateLike = jest.fn(() => {
      return { message: "게시글의 좋아요를 취소하였습니다." }
    })
    
    await postsController.updateLike(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글의 좋아요를 취소하였습니다."
    });
  })

  // test('posts.controller.createPost', async () => {
    
  // })
});
