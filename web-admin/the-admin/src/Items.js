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
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label
                  for="username"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                      Post title
                    </span>
                    <input
                      type="text"
                      //   placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                    {/* <input
                      type="text"
                      name="username"
                      id="username"
                      autocomplete="username"
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="janesmith"
                    /> */}
                  </div>
                </div>
                <br />
                <label
                  for="username"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                      Post Description
                    </span>

                    <input
                      type="text"
                      //   placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {/* 
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
              /> */}

              <div class="col-span-full">
                <label
                  for="cover-photo"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cover photo
                </label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div class="text-center">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        for="file-upload"
                        class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          class="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
              />
              <button type="submit">Add Item</button>
            </div>
          </div>
        </div>
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
