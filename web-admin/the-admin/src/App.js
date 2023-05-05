import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Ads from "./Ads";

import Items from "./Items";

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
// const storage = getStorage(firebaseApp);

function App() {
  return (
    <Router>
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Items />} />
              <Route path="/ads" element={<Ads />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
