const prisma = require("../../config/prisma");

async function createPost(data) {
  return prisma.blogPost.create({
    data,
  });
}

async function getAllPosts() {
  return prisma.blogPost.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getAllPostsAdmin() {
  return prisma.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getPostBySlug(slug) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: "published",
    },
  });
}

async function updatePost(id, data) {
  return prisma.blogPost.update({
    where: { id: Number(id) },
    data,
  });
}

async function deletePost(id) {
  return prisma.blogPost.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  createPost,
  getAllPosts,
  getAllPostsAdmin,
  getPostBySlug,
  updatePost,
  deletePost,
};