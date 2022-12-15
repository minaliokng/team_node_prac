const PostService = require("../../services/posts.service.js");

let mockPostsRepository = {
  findAllPost: jest.fn(),
  getOnePost: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
}

let postService = new PostService();
// postService의 Repository를 Mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository;

describe('Layered Architecture Pattern Posts Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('Posts Service findAllPost Method', async () => {
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

    mockPostsRepository.findAllPost = jest.fn(() => {
      return findAllPostReturnValue
    });

    const posts = await postService.findAllPost();
    expect(posts).toEqual(findAllPostReturnValue.sort((a, b) => {
      return b.createdAt - a.createdAt
    }));

    expect(mockPostsRepository.findAllPost).toHaveBeenCalledTimes(1);
  });

  test('Posts Service createPost Method By Success', async () => {

    mockPostsRepository.createPost = jest.fn(() => {
      return createPostReturnData
    });

    const createPostData = {
      userId: 1,
      title: 'title1',
      content: 'content1',
    };

    const createPostReturnData = {
      userId: 1,
      title: 'title1',
      content: 'content1',
    };

    const post = await postService.createPost(
      createPostData.userId,
      createPostData.title,
      createPostData.content,
    );

    expect(mockPostsRepository.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.createPost).toHaveBeenCalledWith(
      createPostData.userId,
      createPostData.title,
      createPostData.content,
    );
    expect(post).toEqual(createPostReturnData);
  });

  test('Posts Service createPost Method By Failure', async () => {

    mockPostsRepository.createPost = jest.fn(() => {
      return '내용 형식이 일치하지 않습니다.'
    });

    const createPostData = {
      userId: 1,
      title: '',
      content: '',
    };

    try {
      const post = await postService.createPost(
        createPostData.userId,
        createPostData.title,
        createPostData.content,
      );
    } catch (err) {

      expect(mockPostsRepository.createPost).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual('내용 형식이 일치하지 않습니다.');
    }
  });

  test('Posts Service deletePost Method By Success', async () => {
    mockPostsRepository.deletePost = jest.fn(() => {
      return deletePostReturnData
    });

    const deletePostData = {
      postId: 1,
    }

    const deletePostReturnData = {
      postId: 1,
      title: 'title1',
      content: 'content1'
    };

    const post = await postService.deletePost(deletePostData.postId);

    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(deletePostData.postId);
    expect(post).toEqual(deletePostReturnData);
  });

  test('Posts Service deletePost Method By Not Found Post Error', async () => {
    mockPostsRepository.deletePost = jest.fn(() => {
      return null;
    });

    try {
      const deletePost = await postService.deletePost(90)
    } catch (err) {
      expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(90);
      expect(err.message).toEqual('해당 게시물이 존재하지 않습니다.');
    }
  });

  test('Posts Service updatePost Method By Success', async () => {
    mockPostsRepository.updatePost = jest.fn(() => {
      return updatePostReturnData
    });

    const updatePostData = {
      postId: 1,
      title: 'update1',
      content: 'update1',
    }

    const updatePostReturnData = {
      postId: 1,
      title: 'update1',
      content: 'update1'
    };

    const post = await postService.updatePost(
      updatePostData.postId,
      updatePostData.title,
      updatePostData.content
    );

    expect(mockPostsRepository.updatePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.updatePost).toHaveBeenCalledWith(
      updatePostData.postId,
      updatePostData.title,
      updatePostData.content
    );
    expect(post).toEqual(updatePostReturnData);
  });

  test('Posts Service updatePost Method By Not Found Post Error', async () => {
    mockPostsRepository.updatePost = jest.fn(() => {
      return null;
    });

    try {
      const updatePost = await postService.updatePost(1, '', '')
    } catch (err) {
      expect(mockPostsRepository.updatePost).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual('내용 형식이 일치하지 않습니다.');
    }
  });
});