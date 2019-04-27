const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (!user.compareHash(password)) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    const token = User.generateToken(user)

    return res.json({ user, token })
  }
}

module.exports = new SessionController()
