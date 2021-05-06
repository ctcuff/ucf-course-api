class Catalog {
  static getAll(req, res) {
    return res.send([
      {
        prefix: 'Test',
        title: 'some title'
      }
    ])
  }

  static getArea(req, res) {
    return res.send({
      response: 'ok',
      params: req.params
    })
  }
}

export default Catalog
