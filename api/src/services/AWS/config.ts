const environment = () => ({
  AWS: {
    BUCKET: process.env.NODE_AWS_BUCKET,
    BUCKET_REGION: process.env.NODE_AWS_BUCKET_REGION,
    PUBLIC_ACCESS_KEY: process.env.NODE_AWS_PUBLIC_ACCESS_KEY,
    SECRET_KEY: process.env.NODE_AWS_SECRET_KEY,
    QR_PATH: 'projects/ARCHITECTS/assets/',
    TEMPLATE_PATH: 'projects/ARCHITECTS/mail-templates/',
  },
  CONFIG: {
    SECRET_HASH_KEY: process.env.SECRET_HASH_KEY,
    EXPIRES_IN: '1h',
  },
  EMAIL: {
    USERNAME: process.env.EMAIL_USERNAME,
    PASSWORD: process.env.EMAIL_PASSWORD,
    WEB_URL: `${process.env.WEB_URL}`,
  },
  MONGO: {
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DATABASE: process.env.DB_NAME,
  },
});

export default environment;

export function getAWSPATH(folder: string, name: string) {
  const {
    AWS: { BUCKET_REGION, BUCKET },
    AWS: { QR_PATH },
  } = environment();
  return `https://${BUCKET}.s3.${BUCKET_REGION}.amazonaws.com/${QR_PATH}${folder}/${name}.png`;
}
