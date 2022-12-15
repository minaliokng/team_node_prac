exports.validatePost = (title, content) => {
  if (!title) {
    throw new Error('내용 형식이 일치하지 않습니다.')
  }
  if (!content) {
    throw new Error('내용 형식이 일치하지 않습니다.')
  }

  return false;
}