const PostRepository = require("../../repositories/posts.repository.js");

// posts.repository.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}

let postRepository = new PostRepository(mockPostsModel, mockPostsModel);
// postRepository.postsModel = mockPostsModel;
// postRepository.postLikeModel = mockPostsModel;

describe('Layered Architecture Pattern Posts Repository Unit Test', () => {

  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('Posts Repository findAllPost Method', async () => {
    mockPostsModel.findAll = jest.fn(() => {
      return "findAll Result";
    });

    const posts = await postRepository.findAllPost();

    expect(mockPostsModel.findAll).toHaveBeenCalledTimes(1);
    expect(posts).toEqual("findAll Result")

  });


  test('Posts Repository createPost Method', async () => {
    mockPostsModel.create = jest.fn(() => {
      return "create Result"
    });

    const createPostParams = {
      userId: 1,
      title: "title",
      content: "content"
    };

    const createPost = await postRepository.createPost(
      createPostParams.userId,
      createPostParams.title,
      createPostParams.content,
    );
    expect(mockPostsModel.create).toHaveBeenCalledTimes(1);
    expect(mockPostsModel.create).toHaveBeenCalledWith({
      userId: createPostParams.userId,
      title: createPostParams.title,
      content: createPostParams.content,
    })
    expect(createPost).toEqual("create Result");

  });

  test('Posts Repository getOnePost Method', async () => {
    mockPostsModel.findOne = jest.fn(() => {
      return "getOnePost Result";
    });

    const createPostParams = {
      postId: 1,
    };

    const post = await postRepository.getOnePost(createPostParams.postId);

    expect(mockPostsModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockPostsModel.findOne).toHaveBeenCalledWith({
      where: { "postId": createPostParams.postId }
    });
    expect(post).toEqual("getOnePost Result");

  });

  test('Posts Repository updatePost Method', async () => {
    mockPostsModel.update = jest.fn(() => {
      return "update Result";
    });

    const createPostParams = {
      postId: 1,
      title: "title",
      content: "content"
    };

    const post = await postRepository.updatePost(
      createPostParams.postId,
      createPostParams.title,
      createPostParams.content,
    );

    expect(mockPostsModel.update).toHaveBeenCalledTimes(1);
    expect(mockPostsModel.update).toHaveBeenCalledWith(
      { "content": createPostParams.content, "title": createPostParams.title },
      {
        "where": {
          "postId": createPostParams.postId
        }
      }
    )
    expect(post).toEqual("update Result")

  });

  test('Posts Repository deletePost Method', async () => {
    mockPostsModel.destroy = jest.fn(() => {
      return "destroy Result";
    });

    const createPostParams = {
      postId: 1,
    };

    const post = await postRepository.deletePost(createPostParams.postId);

    expect(mockPostsModel.destroy).toHaveBeenCalledTimes(1);
    expect(mockPostsModel.destroy).toHaveBeenCalledWith({
      where: { postId: createPostParams.postId }
    })
    expect(post).toEqual("destroy Result")

  });

});