const AWS = require('aws-sdk');
AWS.config.update({
    secretAccessKey: '',
    accessKeyId: '',
    region: 'ap-southeast-2'
});
const PORT = 3001;

const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const bodyParser = require('body-parser');
 
const app = express();

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3001));
app.use(express.static(__dirname));

var s3 = new AWS.S3();
 
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 's3-bucket-name',
    acl: 'authenticated-read',
    contentDisposition: 'attachment',
    serverSideEncryption: 'AES256',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        cb(null, file.originalname); // use original filename
        // cb(null, Date.now().toString()); // use an alternative filename
    }
  })
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//use by upload form
app.post('/upload', upload.array('upl', 1), function (req, res, next) {
    console.log('\n\n\nreq = ', req);
    // console.log('res = ', res);
    res.send('Successfully uploaded ' + req.files.length + ' files!\nUpload size ' + req.files[0].size + ' bytes.');
});

app.listen(app.get('port'), function () {
    console.log(`Upload app listening on port ${PORT}! Open http://localhost:${PORT}.`);
});