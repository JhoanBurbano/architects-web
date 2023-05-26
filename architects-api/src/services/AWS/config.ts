const environment = () => ({
  AWS: {
    BUCKET: process.env.NODE_AWS_BUCKET,
    BUCKET_REGION: process.env.NODE_AWS_BUCKET_REGION,
    PUBLIC_ACCESS_KEY: process.env.NODE_AWS_PUBLIC_ACCESS_KEY,
    SECRET_KEY: process.env.NODE_AWS_SECRET_KEY,
    QR_PATH: 'projects/ARCHITECTS/assets/',
  },
});

export default environment;

export function getAWSPATH(folder: string, name: string) {
  const {
    AWS: { BUCKET_REGION, BUCKET },
    AWS: { QR_PATH },
  } = environment();
  return `https://${BUCKET}.s3.${BUCKET_REGION}.amazonaws.com/${QR_PATH}${folder}${name}.png`;
}
