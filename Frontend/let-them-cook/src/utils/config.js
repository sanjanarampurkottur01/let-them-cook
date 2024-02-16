import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { imageStorage } from "../Firebase/config";

export const uploadImageToFirebase = async (image) => {
  const imageUUID = v4();
  const imageRef = ref(imageStorage, `files/${imageUUID}`);
  await uploadBytes(imageRef, image);
  // return getImageURLFromFirebase(imageUUID);
  const imageURL = await getDownloadURL(
    ref(imageStorage, `files/${imageUUID}`)
  );
  return imageURL;
};

export const getImageURLFromFirebase = async (imageUUID) => {
  const imageURL = await getDownloadURL(
    ref(imageStorage, `files/${imageUUID}`)
  );
  return imageURL;
};

export const calendarDays = (currentDate) =>
  Array.from({ length: 7 }, (_, index) => {
    const startDate = new Date(currentDate); // Clone the current date
    startDate.setDate(currentDate.getUTCDate() - currentDate.getUTCDay()); // Set to the start of the current week
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    return day;
  });
