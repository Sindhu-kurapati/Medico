import React, { useEffect, useState } from 'react';
import {Card, Typography} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [hospitals,setHospitals] = useState([]);
    const [latLng, setLatLng] = useState({});
    const navigate = useNavigate();
    
   useEffect(() => {
       if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            setLatLng({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          });
       }
   }, []);

   useEffect(() => {
       if (Object.keys(latLng).length > 0) {
        const HOSPITAL_API =`https://api.geoapify.com/v2/places?categories=healthcare.hospital&conditions=access&filter=circle:78.48967218268092,17.393733664675864,5004&bias=proximity:78.48967218268092,17.393733664675864&lang=en&limit=20&apiKey=8125ff70fecf4ed984528cef74740532`;
            axios.get(HOSPITAL_API).then((res) => {
                const featuresData = res.data.features;
                const hospitalsResults = featuresData.map((feature) => ({
                    name: feature.properties.name,
                    formatted: feature.properties.formatted,
                    lat: feature.properties.lat,
                    lon: feature.properties.lon,
                    state: feature.properties.state,
                    city: feature.properties.city,
                    district: feature.properties.district,
                    street: feature.properties.street,
                    postcode: feature.properties.postcode,
                }));
                setHospitals(hospitalsResults);
                // console.log(res.data);
            });
        }
      }, [latLng]);

    // console.log(latLng);

      const cardClick = (hospital) =>{
        navigate(`/hospitaldetails/${hospital.lat}`,{state: {hospital: hospital}})
      }
  return (
    <div style={{margin:'1rem',display:'grid',gridTemplateColumns:'repeat(3, 1fr)',background:'#ffe6f2'}}>
        {hospitals.map((hospital,index)=>{
        return(
            <div key={index}>
            <Card onClick={()=>cardClick(hospital)}
                sx={{background:'linear-gradient(to top, #ccebff, white)',padding:'1rem',margin:'1rem',height:'30vh',width:'85%',border:'1px solid black',borderRadius:'15px'}}>
                <Typography variant="h5" component="div" style={{color:'#e65c00',fontWeight:'600',borderBottom:'3px solid grey',width:'85%',paddingBottom:'10px'}}>
                    {hospital.name}
                </Typography>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',color:'#000066',fontWeight:'600',margin:'1rem'}}>
                    {hospital.formatted}
                </Typography>
            </Card>
            </div>
        )
    })}
    </div>
  );
}

export default Home;
