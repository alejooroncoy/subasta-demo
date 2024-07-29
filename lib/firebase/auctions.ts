import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from ".";

const db = getFirestore(app);

export const getAuctions = async () => {
  const auctionsCol = collection(db, "auctions");
  const auctions = await getDocs(auctionsCol);

  return auctions.docs;
}