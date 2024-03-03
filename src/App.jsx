import {AppBar,Typography} from '@mui/material';
// import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Routes,Route } from 'react-router-dom';
import Home from './Home';
import HospitalDetails from './HsptlDetails';

import './App.css';
function App() {

  return (
    <div>
        <AppBar position="static" style={{backgroundColor:'#000066',display:'flex', flexDirection:'row',height:'12vh',padding:'1.5rem'}}>
          <LocalHospitalIcon sx={{ display: { xs: 'none', md: 'flex',height:'30px' }, mr: 1 }} />
          <Typography variant="h6" noWrap component="a" href="#app-bar-with-responsive-menu"
            sx={{mr: 2,display: { xs: 'none', md: 'flex' },fontFamily: 'monospace',fontWeight: 700,letterSpacing: '.3rem', color: 'inherit',textDecoration: 'none'}}>
              MEDI-CARE
          </Typography>
        </AppBar>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/hospitaldetails/:latitude' element={<HospitalDetails/>}/>
        </Routes>
    </div>
  );
}
export default App;
