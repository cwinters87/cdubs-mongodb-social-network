const router = require("express").Router()

const {
    addThought,
    removeThought,
    addReaction,
    removeReaction,
} = require("../../controllers/thought-controller");

router
    .route('/')
    .post(addThought);

router
    .route('/:id')
    .delete(removeThought);

router
    .route("/:thoughtId/reactions")
    .put(addReaction);

router
    .route("/:thoughtId/reactions/:reactionId")
    .delete(removeReaction);

module.exports = router;