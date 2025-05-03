import { db } from "./firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteEntry(entryId: string, userId: string) {
  const entryRef = doc(db, "entries", entryId);
  await deleteDoc(entryRef);
}
