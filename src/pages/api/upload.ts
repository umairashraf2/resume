import multer, {Multer, MulterError} from 'multer';
const fs = require('fs');
import path from 'path';
import {promisify} from 'util';

const upload: Multer = multer({
  dest: 'uploads/',
  limits: {fileSize: 5 * 1024 * 1024}, // limit file size to 5MB
});

const writeFile = promisify(fs.writeFile);

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    const uploadMiddleware = upload.single('file');

    try {
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, (error: any) => (error ? reject(error) : resolve(req.file)));
      });

      if (req.file?.mimetype !== 'application/pdf') {
        res.status(400).json({error: 'Invalid file format. Only PDF allowed.'});
        return;
      }

      await writeFile(path.resolve('public/assets', 'Resume.pdf'), fs.readFileSync(req.file.path));

      fs.unlinkSync(req.file.path);

      res.status(200).json({message: 'File uploaded successfully.'});
    } catch (error: any) {
      if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({error: 'File too large. Maximum size is 5MB.'});
      } else {
        res.status(500).json({error: error.message});
      }
    }
  } else {
    res.status(405).json({error: 'Method not allowed. Please send a POST request.'});
  }
};

export default handler;
