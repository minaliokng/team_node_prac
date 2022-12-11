const { Post, Like } = require("../models");

class PostRepository {
  findAllPost = async () => {
    return await Post.findAll();
  }

  createPost = async (userId, title, content) => {
    console.log(userId, title, content)
    return await Post.create({
      userId,
      title,
      content
    });
  }

  getLike = async (userId) => {
    console.log(userId)
    const likes = await Like.findAll({
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
    return await Like.findOne({
      where: {
        postId,
        userId
      }
    })
  }

  getOnePost = async (postId) => {
    return await Post.findOne({
      where: { postId }
    });
  }

  updatePost = async (postId, title, content) => {
    return await Post.update(
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
    return await Post.destroy(
      {
        where: { postId }
      }
    )
  }

  updateLike = async (postId, likes, stat, userId) => {
    console.log(likes)
    if(stat == -1) {
      await Post.update(
        {
          likes: likes -= 1
        },
        {
          where: {
            postId
          }
        }
      )
      await Like.destroy({
        where: {
          postId,
          userId
        }
      })
    }
    else {
      await Post.update(
        {
          likes: likes += 1
        },
        {
          where: {
            postId
          }
        }
      )
      await Like.create({
        userId,
        postId
      })
    }
  }
}

module.exports = PostRepository;