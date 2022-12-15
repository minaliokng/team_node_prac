const CommentsRepository = require('../../../repositories/comments.repository');

const mockCommentsModel = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
});

let commentsRepository = new CommentsRepository(mockCommentsModel);

describe('Comments Repository Layer Test', () => {
  


  beforeEach(() => {
    // 모든 Mock을 초기화합니다.
    jest.resetAllMocks();
  })

  // getComments Method test
  test('Comments Repository getComments Method', async () => {
    mockCommentsModel.findAll = jest.fn(() => {
        return 'findAll Data'
    })

    const getComments = await commentsRepository.getComments()

    expect(mockCommentsModel.findAll).toHaveBeenCalledTimes(1)
    expect(getComments).toEqual('findAll Data')
  })

  // getOneComment Method test
  test('Comments Repository getOneComment Method', async () => {
    mockCommentsModel.findOne = jest.fn(() => {
      return 'findOne Data'
    })

    const commentId = 'commentId'
    const comment = await commentsRepository.getOneComment(commentId)

    expect(mockCommentsModel.findOne).toHaveBeenCalledTimes(1)
    expect(mockCommentsModel.findOne).toHaveBeenCalledWith(
      { where: 
        { commentId : commentId.commentId }
      })
    expect(comment).toEqual('findOne Data')
  })

  // createComment Method test
  test('Comments Repository createComment Method', async () => {
    mockCommentsModel.create = jest.fn(() => {
      return 'create Data'
    })

    const createCommentParams = {
      userId: 1,
      postId: 1,
      comment: "comment"
    }

    const createComment = await commentsRepository.createComment(
      createCommentParams.userId,
      createCommentParams.postId,
      createCommentParams.comment
    )

    expect(mockCommentsModel.create).toHaveBeenCalledTimes(1)
    expect(mockCommentsModel.create).toHaveBeenCalledWith({
      userId: createCommentParams.userId,
      postId: createCommentParams.postId,
      comment: createCommentParams.comment
    })
    expect(createComment).toEqual('create Data')
  })

  // updateComment Method test
  test('Comments Repository updateComment Method', async () => {
    mockCommentsModel.update = jest.fn(() => {
      return 'update Data'
    })

    const updateCommentParams = {
      commentId: 1,
      comment: "comment"
    }

    const updateComment = await commentsRepository.updateComment(
      updateCommentParams.commentId,
      updateCommentParams.comment
    )

    expect(mockCommentsModel.update).toHaveBeenCalledTimes(1)
    expect(mockCommentsModel.update).toHaveBeenCalledWith(
            { comment: updateCommentParams.comment },
            { where : { commentId: updateCommentParams.commentId }}
    )
    expect(updateComment).toEqual('update Data')
  })

  // udeleteComment Method test
  test('Comments Repository deleteComment Method', async () => {
    mockCommentsModel.destroy = jest.fn(() => {
      return 'destroy Data'
    })

    const deleteCommentParams = {
      commentId: 1,
    }

    const deleteComment = await commentsRepository.deleteComment(deleteCommentParams.commentId)

    expect(mockCommentsModel.destroy).toHaveBeenCalledTimes(1)
    expect(mockCommentsModel.destroy).toHaveBeenCalledWith(
      { where : { commentId:deleteCommentParams.commentId } }
    )
    expect(deleteComment).toEqual('destroy Data')
  })


  
});
