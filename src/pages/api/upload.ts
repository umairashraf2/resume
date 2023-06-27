import {Multer, MulterError} from 'multer';
import multer from 'multer';
import * as firebase from 'firebase/app';
import { getStorage, ref,  uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx4C2G_h2jXoFjKpBoveNbt1SEByX6aUc",
  authDomain: "daniel-we.firebaseapp.com",
  projectId: "daniel-we",
  storageBucket: "daniel-we.appspot.com",
  messagingSenderId: "771178122800",
  appId: "1:771178122800:web:3402520bb668280bf0e7f5",
  measurementId: "G-DECDJLFQ7X"
};

// Initialize Firebase
if (firebase.getApps().length===0) {
  firebase.initializeApp(firebaseConfig);
}

const upload: Multer = multer({
  storage: multer.memoryStorage(), // we will store the file in memory
  limits: {fileSize: 5 * 1024 * 1024}, // limit file size to 5MB
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: any, res:any) => {
  if (req.method === 'POST') {
    const uploadMiddleware = upload.single('file');

    try {
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, (error: any) => (error ? reject(error) : resolve(null)));
      });

      if (!req.file || req.file.mimetype !== 'application/pdf') {
        res.status(400).json({error: 'Invalid file format. Only PDF allowed.'});
        return;
      }

      // Get a reference to the storage service, which is used to create references in your storage bucket
      const storage = getStorage();

      // Create a storage reference from our storage service
      // const storageRef = ref(storage);
      const fileRef = ref(storage,'Resume.pdf');
      // 'file' comes from the Blob or File API
      uploadBytes(fileRef, req.file.buffer).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
      });

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
