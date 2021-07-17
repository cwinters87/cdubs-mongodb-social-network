const { Thought, User } = require('../models')

const thoughtController = {

// get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  // get one thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  // add thought to user
  // expects:
  // {
  //   "thoughtText": "Here's a cool thought by chris...",
  //   "username": "chris",
  //   "userId": "60f33b80049c6059006c1fb3"
  // }

  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' })
          return
        }
        res.json(dbThoughtData)
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' })
          return
        }
        res.json(dbThoughtData)
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  // remove thought by id
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' })
        }
        res.json({ message: 'Thought removed!' })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  // add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' })
          return
        }
        res.json(dbThoughtData)
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },
  
  // remove reaction from thought
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' })
        }
        res.json({ message: 'Reaction removed!' })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  }}

  

module.exports = thoughtController