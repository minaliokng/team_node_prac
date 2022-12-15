const PostRepository = require("../../repositories/posts.repository.js");
const PostService = require("../../services/posts.service.js");

let mockPostsRepository = jest.mock("../../repositories/posts.repository.js");

let postService = new PostService();
postService.postRepository = mockPostsRepository

const data = {
  postId: 1,
  userId: 1,
  title: "title",
  content: "content",
  likes: 3
};

describe('Layered Architecture Pattern Posts Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  test('posts.service.isMine', async () => {
    mockPostsRepository.getOnePost = jest.fn(() => {
      return {
        userId: 3
      };
    });
    const isItMine = await postService.isMine(data.userId, data.postId);

    expect(isItMine).toEqual(false)
  });

  test('posts.service.findAllPost', async () => {
    mockPostsRepository.findAllPost = jest.fn(() => {
      return [];
    });

    const posts = await postService.findAllPost();

    expect(posts).toEqual([]);
  });

  test('posts.service.createPost', async () => {
    mockPostsRepository.createPost = jest.fn(() => {
      return;
    });
    const posting = await postService.createPost(data.userId, data.title, data.content);

    expect(posting).toEqual();
  });

  test('posts.service.getLike', async () => {
    mockPostsRepository.getLike = jest.fn(() => {
      return;
    })

    const posts = await postService.getLike(data.userId);

    expect(posts).toEqual();
  });

  test('posts.service.getOnePost', async () => {
    mockPostsRepository.getOnePost = jest.fn(() => {
      return ;
    });
    const post = await postService.getOnePost(data.userId);

    expect(post).toEqual();
  });

  test('posts.service.updatePost', async () => {
    mockPostsRepository.getOnePost = jest.fn(() => {
      return {
        // userId: 1
        userId: 3
      }
    });
    mockPostsRepository.updatePost = jest.fn(() => {
      return;
    });
    const post = await postService.updatePost(data.userId, data.postId, data.title, data.content);

    // expect(post).toEqual({ message: "수정 성공", code: 200 });
    expect(post).toEqual({message: "본인 소유의 게시글이 아닙니다", code: 400});
  });

  test('posts.service.deletePost', async () => {
    mockPostsRepository.getOnePost = jest.fn(() => {
      return {
        userId: 1
        // userId: 3
      }
    });
    mockPostsRepository.deletePost = jest.fn(() => {
      return;
    });
    const post = await postService.deletePost(data.userId, data.postId);

    expect(post).toEqual({message: "삭제 성공", code: 200});
    // expect(post).toEqual({ message: "본인 소유의 게시글이 아닙니다", code: 400 })
  });

  test('posts.service.addLike', async () => {
    mockPostsRepository.addLike = jest.fn(() => {
      return;
    })
    const post = await postService.addLike(data.userId, data.postId, data.likes);

    expect(post).toEqual();
  });

  test('posts.service.deleteLike', async () => {
    mockPostsRepository.deleteLike = jest.fn(() => {
      return;
    })
    const post = await postService.deleteLike(data.userId, data.postId, data.likes);

    expect(post).toEqual();
  });

  test('posts.service.updateLike', async () => {
    mockPostsRepository.getOneLike = jest.fn(() => {
      return false;
    })
    mockPostsRepository.getOnePost = jest.fn(() => {
      return {
        likes: data.likes
      }

      // return null;
    })
    const postLiked = await postService.updateLike(data.postId, data.userId);

    // expect(postLiked).toEqual
    // expect(postLiked).toEqual({ message: "게시글의 좋아요를 취소하였습니다." });
    expect(postLiked).toEqual({ message: "게시글의 좋아요를 등록하였습니다.", code: 200 });
  })
});