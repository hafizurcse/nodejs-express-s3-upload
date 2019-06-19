const AWS = require('aws-sdk');
AWS.config.update({
    secretAccessKey: process.env.S3_SECRET_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY,
    region: process.env.S3_REGION
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
    bucket: process.env.S3_BUCKET,
    acl: 'authenticated-read',
    contentDisposition: 'attachment',
    serverSideEncryption: 'AES256',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        cb(null, file.originalname); // to use original filename
        // cb(null, Date.now().toString()); // to use an alternative filename
    }
  }),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) // we are allowing only 5 MB files
  }
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//use by upload form
app.post('/upload', upload.array('upl', 1), function (req, res, next) {
    res.send('Successfully uploaded ' + req.files.length + ' files!\nUpload size ' + req.files[0].size + ' bytes.');
});

app.listen(app.get('port'), function () {
    console.log(`Upload app listening on port ${PORT}! Open http://localhost:${PORT}.`);
});