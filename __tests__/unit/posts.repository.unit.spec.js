const PostRepository = require("../../repositories/posts.repository.js");

let mockPostsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}

let mockLikeModel = {
  findAll: jest.fn()
}

let postRepository = new PostRepository(mockPostsModel, mockLikeModel);

describe('Layered Architecture Pattern Posts Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  test('posts.repository.findAllPost', async () => {
    mockPostsModel.findAll = jest.fn(() => {
      return "findAll String"
    });
    const posts = await postRepository.findAllPost();

    expect(postRepository.postsModel.findAll).toHaveBeenCalledTimes(1);
    expect(posts).toBe("findAll String");
  });

  test('posts.repository.createPost', async () => {
    mockPostsModel.create = jest.fn(() => {
      return "create String"
    });

    const params = {
      userId: "userId",
      title: "title",
      content: "content"
    }

    const post = await postRepository.createPost(params.userId, params.title, params.content);
    expect(post).toBe("create String");

    expect(postRepository.postsModel.create).toHaveBeenCalledTimes(1);
    expect(postRepository.postsModel.create).toHaveBeenCalledWith({
      userId: params.userId,
      title: params.title,
      content: params.content
    });
  });

  test('posts.repository.getLike', async () => {
    mockLikeModel.findAll = jest.fn(() => {
      return [{dataValues: {postId: 1}}];
    })
    mockPostsModel.findOne = jest.fn(() => {
      return ;
    });

    const userId = 0;
    const Likes = await postRepository.getLike(userId);
    expect(Likes).toEqual([]);

    expect(postRepository.likesModel.findAll).toHaveBeenCalledTimes(1);
    expect(postRepository.postsModel.findOne).toHaveBeenCalledTimes(1);
  })

  test('posts.repository.getOnePost', async () => {
    mockPostsModel.findOne = jest.fn(() => {
      return "same"
    });

    const postId = "postId"

    const post = await postRepository.getOnePost(postId);
    expect(post).toBe("same")

    expect(postRepository.postsModel.findOne).toHaveBeenCalledTimes(1);
    expect(postRepository.postsModel.findOne).toHaveBeenCalledWith({where: {postId}});
  });

  test('posts.repository.updatePost', async () => {
    mockPostsModel.update = jest.fn(() => {
      return "same"
    });

    const post = await postRepository.updatePost("postId", "title", "content");

    expect(postRepository.postsModel.update).toHaveBeenCalledTimes(1);
    expect(post).toBe("same")
  });

  test('posts.repository.deletePost', async () => {
    mockPostsModel.destroy = jest.fn(() => {
      
    });

    const post = await postRepository.deletePost("postId");

    expect(postRepository.postsModel.destroy).toHaveBeenCalledTimes(1);
    expect(post).toBeUndefined()
  });

  test('posts.repository.updateLike', async () => {
    mockPostsModel.update = jest.fn(() => {
      return ;
    });
    mockLikeModel.destroy = jest.fn(() => {
      return ;
    });
    mockLikeModel.create = jest.fn(() => {
      return "same";
    })

    const post = await postRepository.updateLike("postId", "likes", -1, "userId");

    expect(mockPostsModel.update).toHaveBeenCalledTimes(1);
    // expect(postRepository.likesModel.create).toHaveBeenCalledTimes(1);
    expect(postRepository.likesModel.destroy).toHaveBeenCalledTimes(1);
    expect(post).toBe()
  });
});