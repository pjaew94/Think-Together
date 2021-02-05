const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

// Register new user
router.post(
  "/",
  [
    body("name", "Please enter your name").not().isEmpty(),
    body("email", "Please enter a valid email").isEmail().not().isEmpty(),
    body("password", "Please enter up to at least 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, country, language, category } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists. " }] });
      }

      user = new User({
        name,
        email,
        password,
        country,
        language,
        category,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Save article for user
router.post("/saveArticle", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    const {
      sourceName,
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      content,
    } = req.body;

    const newArticle = {
      user: req.user.id,
      sourceName,
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      content,
    };

    user.savedArticles.unshift(newArticle);

    await user.save();

    res.json(user.savedArticles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete saved article only by user
router.delete("/deleteArticle/:article_id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const article = user.savedArticles.find(
      (article) => article.id === req.params.article_id
    );
    if (!article)
      return res.status(404).json({ msg: "Article does not exist" });
    if (article.user.toString() === req.user.id) {
      user.savedArticles = user.savedArticles.filter(
        ({ id }) => id !== req.params.article_id
      );
      await user.save();
      return res.json(user.savedArticles);
    } else {
      return res.status(401).json({ msg: "User not authorized" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Change user article preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const { language, country, category } = req.body;

    user.category = category;
    user.language = language;
    user.country = country;

    await user.save();
    return res.json(user)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

module.exports = router;
