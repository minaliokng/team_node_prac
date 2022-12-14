class PostRepository {
  constructor(PostsModel, LikesModel) {
    this.postsModel = PostsModel;
    this.likesModel = LikesModel;
  }

  findAllPost = async () => {
    return await this.postsModel.findAll();
  }

  createPost = async (userId, title, content) => {
    return await this.postsModel.create({
      userId,
      title,
      content
    });
  }

  getLike = async (userId) => {
    const likes = await this.likesModel.findAll({
      where: {
        userId
      }
    })

    return await Promise.all(likes.map(a => {
      return this.postsModel.findOne({
        where: {
          postId: a.dataValues.postId
        }
      })
    }))
  }

  getOneLike = async (postId, userId) => {
    return await this.likesModel.findOne({
      where: {
        postId,
        userId
      }
    })
  }

  getOnePost = async (postId) => {
    return await this.postsModel.findOne({
      where: { postId }
    });
  }

  getLiked = async (userId, postId) => {
    return await this.likesModel.findOne({ where: { userId, postId } });
  }

  updatePost = async (postId, title, content) => {
    return await this.postsModel.update(
      {
        title,
        content
      },
      {
        where: { postId }
      }
    )
  }

  deletePost = async (postId) => {
    return await this.postsModel.destroy(
      {
        where: { postId }
      }
    )
  }

  addLike = async (postId, userId, likes) => {
    await this.likesModel.create(
      { userId, postId }
    );
    await this.postsModel.update(
      { likes: likes += 1 },
      { where: { postId } }
    )

    return;
  }

  deleteLike = async (postId, userId, likes) => {
    await this.likesModel.destroy(
      { where: { postId, userId } }
    );
    await this.postsModel.update(
      { likes: likes -= 1 },
      { where: { postId } }
    )

    return;
  }
}

module.exports = PostRepository;