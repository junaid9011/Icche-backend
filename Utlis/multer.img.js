
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// console.log(cloudinary)
const cloudinary = require('cloudinary').v2

// cloudinary.config({ 
//     cloud_name: 'junaidscloud', 
//     api_key:775371735753736 , 
//     api_secret:"S8V3jSmGuNfPOmGPPTKyjgzqczI",
   
//   });
const storage = new CloudinaryStorage({

    cloudinary: cloudinary,
    params: {
      folder: 'Icche',
    },
  });
  
  const upload = multer({ storage: storage });

  module.exports = upload;