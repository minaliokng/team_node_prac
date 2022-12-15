class PostRepository {
  constructor(Post, Like) {
    this.postsModel = Post;
    this.postLikeModel = Like;
  }

  findAllPost = async () => {
    let posts = await this.postsModel.findAll();

    return posts
  }

  createPost = async (userId, title, content) => {

    return await this.postsModel.create({
      userId,
      title,
      content
    });
  }

  getLike = async (userId) => {
    console.log(userId)
    const likes = await this.postLikeModel.findAll({
      where: {
        userId
      }
    })

    return await Promise.all(likes.map(a => {
      return Post.findOne({
        where: {
          postId: a.dataValues.postId
        }
      })
    }))
  }

  getOneLike = async (postId, userId) => {
    return await this.postLikeModel.findOne({
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

  updateLike = async (postId, likes, stat, userId) => {
    console.log(likes)
    if (stat == -1) {
      await this.postsModel.update(
        {
          likes: likes -= 1
        },
        {
          where: {
            postId
          }
        }
      )
      await this.postLikeModel.destroy({
        where: {
          postId,
          userId
        }
      })
    }
    else {
      await this.postsModel.update(
        {
          likes: likes += 1
        },
        {
          where: {
            postId
          }
        }
      )
      await this.postLikeModel.create({
        userId,
        postId
      })
    }
  }
}

module.exports = PostRepository;