import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Landingpage from './Pages/landingpage.jsx'
import Approute from './Routes/route.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Approute/>
    </BrowserRouter>
    
  </StrictMode>
)
