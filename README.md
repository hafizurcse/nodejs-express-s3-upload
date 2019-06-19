# nodejs-express-s3-upload

## Usage
### Fill up the env vars in `deploy.sh`
```
export S3_ACCESS_KEY=""
export S3_SECRET_KEY=""
export S3_BUCKET=""
export S3_REGION=""
export MAX_FILE_SIZE=1024*1024*5 # will only allow 5MB, change according to your need
```

### Run the deployment
```
sh deploy.sh
```