const commandLineArgs = require('command-line-args')
const fs = require('fs')
const express = require('express')
const formidable = require('express-formidable')

const optionDefinitions = [
  { name: 'dir', type: String, multiple: false, defaultOption: true }
]

const options = commandLineArgs(optionDefinitions)
const folderName = options.dir

const app = express()
app.use(formidable())

app.use(express.static('public'))

app.get('/api/file', (req, res) => {
  res.send(fs.readdirSync(folderName)
  .filter(file => fs.lstatSync(folderName+'/'+file).isFile()))
})

app.get('/api/root', (req, res) => {
  res.send(folderName)
})

app.get('/api/file/:fileName', (req, res) => {
  var file = fs.readFileSync(folderName + '/' + req.params.fileName, 'binary');
    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');
    res.end();
})

app.delete('/api/file/:fileName', (req, res) => {
  fs.unlinkSync(folderName+'/'+req.params.fileName);
    res.end()
})

app.post('/api/file', (req, res) => {
  let file = req.files.file
  fs.renameSync(file.path, folderName + '/' + file.name)
  res.end()
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))