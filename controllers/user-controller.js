const { User } = require('../models')

const UserController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  // get one User by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },
  // create user, expects:
  // {
  //   "username": "chris",
  //   "email": "chris@gmail.com"
  // }
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err))
  },

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' })
          return
        }
        res.json(dbUserData)
      })
      .catch(err => res.json(err))
  },

  // delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' })
        return
      }
      res.json({ message: 'User deleted!' })})
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })},
  
  // Add Friend
  addFriend({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' })
          return
        }
        res.json(dbUserData)})
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },
  
  // Remove Friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' })
          return
        }
        res.json({ message: 'Friend removed!' })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  }    
    
}


module.exports = UserController