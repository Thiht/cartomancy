import Joi from 'joi'

export default {
  createBoard: {
    body: {
      title: Joi.string().required()
    }
  },

  updateBoard: {
    body: {
      title: Joi.string().required()
    },
    params: {
      boardID: Joi.string().hex().required()
    }
  },

  createList: {
    body: {
      title: Joi.string().required()
    }
  },

  updateList: {
    body: {
      title: Joi.string().required()
    },
    params: {
      boardID: Joi.string().hex().required(),
      listID: Joi.string().hex().required()
    }
  },

  createCard: {
    body: {
      title: Joi.string().required()
    }
  },

  updateCard: {
    body: Joi.object().keys({
      title: Joi.string(),
      newListID: Joi.string().hex(),
      position: Joi.number().min(0)
    }).or('title', 'newListID', 'position'),
    params: {
      boardID: Joi.string().hex().required(),
      listID: Joi.string().hex().required(),
      cardID: Joi.string().hex().required()
    }
  },

  createUser: {
    body: Joi.object().keys({
      username: Joi.string().trim().required(),
      password: Joi.string().min(8).required(),
      email: Joi.string().trim().lowercase().email().required(),
      firstName: Joi.string().trim(),
      lastName: Joi.string().trim()
    })
  },

  createToken: {
    body: Joi.object().keys({
      username: Joi.string().trim().required(),
      password: Joi.string().required()
    })
  }
}
