import aws from 'aws-sdk'
import config from './index'

const s3 = new aws.S3({
    accessKeyId:config.S3_ACCESS_KEY,
    secretAccessKey:config.S3_SECRET_ACCESS_KEY,
    region:config.S3_BUCKET_NAME
})


export default s3 