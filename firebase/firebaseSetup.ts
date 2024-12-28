import { firebaseApp } from '@/firebase/FirebaseConfig'
import { getStorage, ref, uploadBytes, getDownloadURL, getBlob } from "firebase/storage";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";


const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);


interface Template {
  id: string;
  name: string;
  data: any;
}

export const uploadFiletoFirebase = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw new Error("File upload failed");
  }
}

export const uploadExistingResumetoFirebase = async (file: File, userId: string) => {
  try {
    const filePath = `ExistingResume/${userId}/${file.name}`;
    console.log('Uploading file to path:', filePath);
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully. Snapshot:', snapshot);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw new Error("File upload failed");
  }
}

export const fetchResumeFromFirebase = async (filePath: string): Promise<Buffer> => {
  try {
    console.log('Fetching resume from Firebase:', filePath);
    const storageRef = ref(storage, filePath);
    
    // Use getBlob instead of getDownloadURL and fetch
    const blob = await getBlob(storageRef);
    console.log('Blob fetched successfully. Size:', blob.size, 'bytes');
    
    // Convert Blob to Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Buffer created. Size:', buffer.length, 'bytes');
    return buffer;
  } catch (error) {
    console.error("Error fetching file from Firebase:", error);
    throw error;
  }
};


export const saveTemplateToFirebase = async (userId: string,
  templateId: string,
  templateData: { name: string; data: any }) => {
  try {
    const userTemplatesRef = doc(db, `users/${userId}/templates`, templateId);
    await setDoc(userTemplatesRef, templateData);
  } catch (error) {
    console.error("Error saving template:", error);
    throw new Error("Failed to save template");
  }
}


export const fetchUserTemplatesBasedOnUserID = async (userId: string): Promise<Template[]> => {
  try {
    const templatesRef = collection(db, 'users', userId, 'templates');
    const querySnapshot = await getDocs(templatesRef);
    const templates: Template[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Untitled',
        data: data.data || {},
      };
    });
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Unable to fetch templates');
  }
};

export const fetchResumeBasedOnResumeId = async (resumeId: string, userId: string) => {
  try {
    const resumeRef = doc(db, 'users', userId, 'templates', resumeId);
    const resumeSnapshot = await getDoc(resumeRef);
    if (resumeSnapshot.exists()) {
      return { id: resumeSnapshot.id, ...resumeSnapshot.data() };
    } else {
      throw new Error('Resume not found');
    }
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw new Error('Unable to fetch resume');
  }
};

export const editResumeUsingFirebase = async (userId: string, resumeId: string, updatedData: any) => {
  try {
    const resumeRef = doc(db, 'users', userId, 'templates', resumeId);
    await setDoc(resumeRef, updatedData, { merge: true }); // Merge true to update specific fields
    console.log('Resume updated successfully');
  } catch (error) {
    console.error('Error updating resume:', error);
    throw new Error('Unable to update resume');
  }
};
