
import './App.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.css';
import Search from './Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [dat, setData] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const location=useLocation()
  const navigate = useNavigate();
  const ftch = async () => {
    const data = await fetch(`http://localhost:4000/home`, { method: 'GET' }).then(res => res.json());
    setData(data);
  };
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  }
  const handleSubmit = async(event) => {
    event.preventDefault();

 const data=await fetch(`http://localhost:4000/search`, { method: 'POST',
 headers: {
   'Content-Type': 'application/json',
 },
 body: JSON.stringify({
   searchTerm
   }),

})
      .then(res=>res.json())
      .catch((error) => {
        console.log(error);
      });
      {data.length==0?alert('Nothing to see here'):navigate('/details',{ state: { detail: data } })}
  }
  const toggleExpanded = async (key) => {
  
    
    // Copy the current set of expanded items
    const newExpandedItems = new Set(expandedItems);

    // Add the key to the set if it's not there; otherwise, remove it
    if (newExpandedItems.has(key)) {
      newExpandedItems.delete(key);
    } else {
      newExpandedItems.add(key);
    }

    setExpandedItems(newExpandedItems);
    const data = await fetch(`http://localhost:4000/collapse/${key}`, {
        method: 'PUT',
      }).then(res => res.json());
  };

  const handleclick=async(key)=>{
    const data=await fetch(`http://localhost:4000/categ`,{ method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
       key
      }),

}).then(res=>res.json())
  
    navigate('/details',{ state: { detail: data,email:location.state.email,address:location.state.address,phoneNumber:location.state.phoneNumber } })
  }
  useEffect(() => {
    ftch();
  }, []);
const onClick=async(key)=>{
    const data= await fetch(`http://localhost:4000/result/${key}`,{method:'POST'}).then(res=>res.json())
    navigate('/details',{ state: { detail: [data] } })

}


  return (
    <div className="App2">
    <div className="user-email">{location.state.email}</div>

    <Search onClick={onClick} />

    {dat.map((i) => {
      const isExpanded = expandedItems.has(i._id);
      return (
        <div key={i._id}>
          <strong>{i.name}</strong>
          <button className="expand-button" onClick={() => toggleExpanded(i._id)} data-id={i._id}>
            {isExpanded ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
          </button>
          {isExpanded && (
            <div className="subcategory-container">
              {i.subCategory.map((j) => (
                <div key={j._id} className="subcategory" onClick={() => handleclick(j.name)}>
                  {j.name}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
  );
};

export default Home;
