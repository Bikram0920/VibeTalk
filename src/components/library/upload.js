import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression';


const upload = async (file) =>{

  const date = new Date();

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  // Compress the image
  const compressedImage = await imageCompression(file, options);

  const storageRef = ref(storage, `images/${date + compressedImage.name}`);

  const uploadTask = uploadBytesResumable(storageRef, compressedImage);

  return new Promise((resolve, reject) =>{
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, 
    (error) => {
      reject("Something went wrong" + error.code)
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve(downloadURL);
      });
    }
  );
  })
}

export default upload