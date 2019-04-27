const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async index (req, res) {
    const purchases = await Purchase.paginate(
      {},
      {
        page: req.query.page || 1,
        limit: 20,
        populate: ['ad', 'customer'],
        sort: '-createdAt'
      }
    )

    return res.json(purchases)
  }

  async show (req, res) {
    const purchase = await Purchase.findById(req.params.id)

    return res.json(purchase)
  }

  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    await Purchase.create({ content, customer: req.userId, ad })

    Queue.create(PurchaseMail.key, { ad: purchaseAd, user, content })

    console.log({ ad: purchaseAd, user, content })

    res.send()
  }

  async update (req, res) {
    const purchase = await Purchase.findById(req.params.id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!purchase.ad.author.id === req.userId) {
      return res.status(401).json({ error: "You're not the owner this ad" })
    }

    if (purchase.ad.purchasedBy) {
      return res.status(400).json({ error: 'This ad is not available' })
    }

    await Purchase.findByIdAndUpdate(purchase._id, { status: true })
    await Ad.findByIdAndUpdate(purchase.ad._id, {
      purchasedBy: purchase.ad._id
    })

    return res.json(purchase.ad)
  }
}

module.exports = new PurchaseController()
