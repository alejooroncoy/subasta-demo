import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import app from ".";

const db = getFirestore(app);

export const offersRef = collection(db, "offers");

export const createOffer = async (data: unknown) => {
  const offersCols = collection(db, "offers");
  const document = doc(offersCols);

  await setDoc(document, data);

  return document;
}