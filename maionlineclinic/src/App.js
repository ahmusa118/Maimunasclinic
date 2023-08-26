
import { useEffect, useState } from 'react';
import Home from './Home'
import Details from './Details'
import Signin from './Signin'
import Cart from './Cart'
import Admin from './Admin'
import { BrowserRouter ,Route,Routes} from 'react-router-dom';
const App=()=>{
return(
  <BrowserRouter>
  
<Routes>
<Route path='/' element={<Signin />}/>
<Route path='/Admin' element={<Admin />} />
  <Route path='/Home' element={<Home />}/>
  <Route path='/cart' element={<Cart/>}/>
<Route path='/details' element={<Details />}/>
</Routes>
</BrowserRouter>
)
}
export default App