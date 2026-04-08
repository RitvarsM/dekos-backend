const service = require("./blog.service");

async function create(req, res) {
  try {
    const post = await service.createPost(req.body);
    res.json({ ok: true, post });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

async function getAll(req, res) {
  try {
    const posts = await service.getAllPosts();
    res.json({ ok: true, posts });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

async function getAllAdmin(req, res) {
  try {
    const posts = await service.getAllPostsAdmin();
    res.json({ ok: true, posts });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

async function getOne(req, res) {
  try {
    const post = await service.getPostBySlug(req.params.slug);

    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Raksts nav atrasts",
      });
    }

    res.json({ ok: true, post });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

async function update(req, res) {
  try {
    const post = await service.updatePost(req.params.id, req.body);
    res.json({ ok: true, post });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

async function remove(req, res) {
  try {
    await service.deletePost(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

module.exports = {
  create,
  getAll,
  getAllAdmin,
  getOne,
  update,
  remove,
};