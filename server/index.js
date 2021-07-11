const mongoose = require('mongoose')
const Document = require('./model/Document.js')

mongoose.connect('mongodb://localhost/GoogleDocsClone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const io = require('socket.io')(5000, {
  // cors for cross origin requests
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
})

const defaultValue = ''

io.on('connection', (socket) => {
  socket.on('get-document', async (documentId) => {
    const document = await findOrCreateDocument(documentId)

    // the documentId will be the room number, hence anyone can see whats happening in the room if there in the room
    socket.join(documentId)
    socket.emit('load-document', document.data)
    socket.on('send-changes', (delta) => {
      // broadcasting the changes to anyone viewing the doc
      socket.broadcast.to(documentId).emit('receive-changes', delta)
    })
    // saving the document
    socket.on('save-document', async (data) => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
  console.log('Successfully Connected!!')
})

const findOrCreateDocument = async (id) => {
  if (id == null) return
  const document = await Document.findById(id)
  if (document) return document //if document exist return the document else create a new document with new data and id
  return await Document.create({ _id: id, data: defaultValue })
}
