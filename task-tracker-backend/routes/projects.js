const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const { check, validationResult } = require('express-validator');

// Create Project
router.post(
  '/',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    try {
      const project = new Project({
        title,
        description,
        user: req.user.id,
      });
      await project.save();
      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ msg: err.message });
    }
  }
);

// Get User's Projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;