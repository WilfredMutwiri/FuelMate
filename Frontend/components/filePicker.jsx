import * as DocumentPicker from "expo-document-picker";

// images picker
export const imagePicker = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: "*/*",
    });

    if (result.canceled) {
      console.log("User canceled file picker");
      return;
    }

    const file = result.assets[0];
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
    ];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      console.log("File is not a valid image");
      return null;
    }

    console.log(file);
    return file;
  } catch (err) {
    console.log("Error Picking Document", err);
    return null;
  }
};

// docs picker
export const docPicker = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });

    if (result.canceled) {
      console.log("User canceled file picker");
      return;
    }

    const file = result.assets[0];
    console.log(file);
    return file;
  } catch (err) {
    console.log("Error Picking Document", err);
    return null;
  }
};
