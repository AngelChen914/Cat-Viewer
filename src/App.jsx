import { useEffect, useState } from 'react'
import './App.css'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [cat, setCat] = useState([]);
  const [banList, setBanList] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likedCatList, setLikedCatList] = useState([]);

  const fetchData = async () => {
    let loopCat = false;
    try {
      while(!loopCat) {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?has_breeds=true&api_key=${ACCESS_KEY}`);
        const data = await response.json();
        if(!banList.includes(data[0].breeds[0].name) && !banList.includes(data[0].breeds[0].origin) && !banList.includes(data[0].breeds[0].life_span)) {
          setCat(data);
          loopCat = true;
        } 
      }
    } catch(error) {
      console.log("Error fetching images: ", error);
    }
    setLiked(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const banData = (banItem) => {
    if(!banList.includes(banItem)) {
      setBanList(prev => [...prev, banItem]);
    }
  }

  const removeBan = (unBanItem) => {
    setBanList(prev => prev.filter(item => item !== unBanItem));
  }

  const toggleLikes = () => {
    setLiked(true);
    likedList();
  }

  const likedList = () => {
    if(!likedCatList.includes(...cat)) {
      setLikedCatList(prev => [...prev, ...cat]);
    }
  }

  return (
    <div>
      <div className="catLayout">
        <div className="catInfo">
          <h1>Cat Gallery</h1>
          {cat.map((image) => (
           <div key={image.id}>
            <img
              src={image.url}
              alt="Cat"
            />
             <div>
               <button onClick={() => banData(image.breeds[0].name)}>Breed: {image.breeds[0].name}</button>
               <button onClick={() => banData(image.breeds[0].origin)}>Origin: {image.breeds[0].origin}</button>
               <button onClick={() => banData(image.breeds[0].life_span)}>Life Span: {image.breeds[0].life_span}</button>
               <br />
               <button className="likedIcon" onClick={toggleLikes}>{liked?'💖 Liked': '🤍 Like'}</button>
             </div>
           </div>
          ))}
         <br />
         <button onClick={fetchData} className="loadMore">
           Load Cats 🐾
         </button>
        </div>
        <div className="likedCats">
          <h2>Liked Cats</h2>
          {likedCatList.map((item) => (
            <div key={item.id}>
             <img 
               className="likedImage"
               src={item.url}
               alt="Cat"
             />
             <p>{item.breeds[0].name} from {item.breeds[0].origin}</p>
            </div>
          ))}
        </div>
        <div className="banList">
          <h2>Unpreferred Qualities</h2>
          {banList.map((item) => (
            <button key={item} onClick={() => removeBan(item)}>{item}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App;
