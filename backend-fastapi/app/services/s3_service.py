import boto3
from botocore.exceptions import ClientError
import hashlib
import time
from app.core.config import settings

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        self.bucket = settings.AWS_S3_BUCKET
    
    def upload_file(self, file_data: bytes, filename: str, content_type: str = "application/octet-stream"):
        """Upload file to S3"""
        try:
            # Generate unique key
            timestamp = int(time.time())
            hash_suffix = hashlib.md5(file_data).hexdigest()[:8]
            key = f"uploads/{timestamp}-{hash_suffix}-{filename}"
            
            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file_data,
                ContentType=content_type
            )
            
            # Generate URL
            url = f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
            
            return {
                "key": key,
                "url": url,
                "bucket": self.bucket,
                "size": len(file_data)
            }
        except ClientError as e:
            raise Exception(f"Failed to upload to S3: {str(e)}")
    
    def delete_file(self, key: str):
        """Delete file from S3"""
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket,
                Key=key
            )
        except ClientError as e:
            raise Exception(f"Failed to delete from S3: {str(e)}")
    
    def get_signed_url(self, key: str, expires_in: int = 3600):
        """Generate signed URL for private file access"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': key},
                ExpiresIn=expires_in
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")

s3_service = S3Service()
