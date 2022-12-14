const PostService = require("../../services/posts.service.js");

let mockPostsRepository = {
  findAllPost: jest.fn()
};

let mockLikesRepository = {
  findAll: jest.fn()
}

let postService = new PostService(mockPostsRepository, mockLikesRepository);
// postService.postRepository = (mockPostsRepository, mockLikesRepository);

describe('Layered Architecture Pattern Posts Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  test('posts.service.findAllPost', async () => {
    mockPostsRepository.findAllPost = jest.fn(() => {
      return [];
    })

    const posts = await postService.findAllPost();

    expect(posts).toEqual(mockPostsRepository.findAllPost);
  });

  test('Posts Service deletePost Method By Success', async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });

  test('Posts Service deletePost Method By Not Found Post Error', async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });
});