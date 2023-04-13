import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

function Items() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getDocs(collection(db, "posts"));
      setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const itemRef = await addDoc(collection(db, "posts"), {
        createdAt: new Date(),
        name,
        description,
      });
      if (image) {
        const storageRef = ref(storage, `images/${itemRef.id}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "posts", itemRef.id), { imageUrl: url });
      }
      if (video) {
        const storageRef = ref(storage, `videos/${itemRef.id}`);
        await uploadBytes(storageRef, video);
        const url = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "posts", itemRef.id), { videoUrl: url });
      }
      setName("");
      setDescription("");
      setImage(null);
      setVideo(null);
    } catch (error) {
      console.error("Error adding item: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const itemRef = doc(db, "posts", id);
      await updateDoc(itemRef, { name, description });
      if (image) {
        const storageRef = ref(storage, `images/${id}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        await updateDoc(itemRef, { imageUrl: url });
      }
      if (video) {
        const storageRef = ref(storage, `videos/${id}`);
        await uploadBytes(storageRef, video);
        const url = await getDownloadURL(storageRef);
        await updateDoc(itemRef, { videoUrl: url });
      }
      setName("");
      setDescription("");
      setImage(null);
      setVideo(null);
    } catch (error) {
      console.error("Error editing item: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Error deleting item: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };
  return (
    <div>
      {loading && <div style={{ fontSize: 100, color: "red" }}>Loading...</div>}
      <h1>Items</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {items
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .map((item) => (
            <li key={item.id}>
              <div style={{ width: 400 }}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: 400 }}
                  />
                )}
                {item.videoUrl && (
                  <video
                    src={item.videoUrl}
                    controls
                    style={{ width: 400 }}
                  ></video>
                )}
              </div>
              <div>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p>
                  Created at: {item.createdAt.toDate().toLocaleDateString()}
                </p>
                <button onClick={() => handleEdit(item.id)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Items;
