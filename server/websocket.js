import WebSocket from 'ws'
import url from 'url'

const CLOSE_PROTOCOL_ERROR = 1002 // https://developer.mozilla.org/en/docs/Web/API/CloseEvent

const websocket = (wsServerOptions = {}) => {
  const defaultOptions = {
    clientTracking: false, // this middleware doesn't use the internal wss.clients object
    perMessageDeflate: false
  }
  const wss = new WebSocket.Server({
    ...defaultOptions,
    ...wsServerOptions
  })
  const clients = {}
  wss.broadcast = (topic, data) => {
    if (!clients[topic]) {
      return
    }
    if (typeof data === 'object') {
      data = JSON.stringify(data)
    }
    clients[topic].forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }
  return (req, res, next) => {
    wss.on('connection', ws => {
      // FIXME: this event is fired multiple times
      const query = url.parse(ws.upgradeReq.url, true).query
      const topic = query.topic
      if (!topic) {
        ws.close(CLOSE_PROTOCOL_ERROR, 'Missing query parameter: topic')
      }
      if (!clients[topic]) {
        clients[topic] = []
      }
      clients[topic].push(ws)
    })
    req.wss = wss
    next()
  }
}

export default websocket
