const router = require('express').Router()
const { models: { User }} = require('../db')
const distance = require('google-distance-matrix')
module.exports = router

router.post('/', async (req, res, next) => {
  try {
    const { origins, destinations, travelMode: mode } = req.body;
    distance.matrix(origins, destinations, mode, function(err, distances){
      if (!err){
        res.json(distances.rows);
      }
    })
  } catch (err) {
    next(err)
  }
})
