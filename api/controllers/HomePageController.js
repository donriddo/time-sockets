/**
 * TerritoryController
 *
 * @description :: Server-side logic for managing territories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /**
  * @api {get} /?date=now Retrieve Server Time
  * @apiName Retrieve Server Time
  * @apiGroup HomePage
  * @apiVersion 0.0.1
  *
  * @apiParams date=now 
  */

  parseRequest(req, res) {
    if (!req.isSocket) return res.badRequest();

    let socketID = sails.sockets.getId(req);

    console.log('Before: ', req.session.store);

    if (
      !req.session.store || parseInt(
        Math.round(Date.now() - req.session.store.time) / 60000
      ) > 5
    ) {
      req.session.store = {
        time: Date.now(), count: 1
      };
    } else if (
      parseInt(
        Math.round(Date.now() - req.session.store.time) / 60000
      ) < 5 && req.session.store.count >= 10
    ) {
      return sails.sockets.broadcast(
        socketID,
        'error',
        {
          time: parseInt(
            Math.round(Date.now() - req.session.store.time) / 60000
          ),
          count: req.session.store.count
        }
      )

    } else {
      req.session.store.count = req.session.store.count + 1;
    }


    console.log('After: ', req.session.store);

    sails.sockets.broadcast(socketID, 'time', { time: Date.now() })

    return res.ok();
  }

};
