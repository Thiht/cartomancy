import WebSocket from 'ws'

const websocket = (wsServerOptions = {}) => {
  const defaultOptions = {
    clientTracking: true,
    perMessageDeflate: false
  }
  const wss = new WebSocket.Server({
    ...defaultOptions,
    ...wsServerOptions
  })
  wss.broadcast = data => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }
  return (req, res, next) => {
    req.wss = wss
    next()
  }
}

export default websocket
