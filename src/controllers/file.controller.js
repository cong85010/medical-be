const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
// const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

// const blobString = ""; // Blob Connection String

//Upload Files to Local Directory
const uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    let msg = "No file found !";
    return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
  }

  try {
    const file = req.files.file;

    const fileName = file.name;
    const filePath = `${uuidv4()}-${fileName}`;
    file.mv(`uploads/${filePath}`, (err) => {
      if (err) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          { err: err },
          "Could not upload"
        );
      }
      const photoURL = filePath;
      return response(
        res,
        StatusCodes.ACCEPTED,
        true,
        { fileURLs: [photoURL] },
        null
      );
    });
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const uploadFiles = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    let msg = "No files found!";
    return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
  }

  try {
    const files = req.files["files[]"]; // Assuming the file input field name is 'files'

    // Process each uploaded file
    const fileUploadPromises = files.map(async (file) => {
      const fileName = file.name;
      const filePath = `${uuidv4()}-${fileName}`;

      // Move the uploaded file to the 'uploads' folder
      await file.mv(`uploads/${filePath}`);

      return filePath;
    });

    // Wait for all file uploads to complete
    const uploadedFiles = await Promise.all(fileUploadPromises);

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { fileURLs: uploadedFiles },
      null
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Upload Files to Microsoft Azure Blob Storage
// const uploadFile = async (req, res) => {
//   if (req.files === undefined || !req.files.image) {
//     let msg = "No file found !";
//     return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
//   }
//   const file = req.files.image;

//   const blobServiceClient = BlobServiceClient.fromConnectionString(blobString);
//   const containerName = ""; //Blob Container Name
//   const containerClient = blobServiceClient.getContainerClient(containerName);

//   const blobName = `${uuidv4()}.` + file.name.split(".").pop();

//   try {
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.upload(file.data, file.data.length);

//     let data = { photoURL: blockBlobClient.url, fileName: blobName };
//     return response(res, StatusCodes.ACCEPTED, true, data, null);
//   } catch (err) {
//     return response(
//       res,
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       false,
//       err,
//       err.message
//     );
//   }
// };

module.exports = {
  uploadFile,
  uploadFiles,
};
