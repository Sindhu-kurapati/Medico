import React, { useEffect, useState } from 'react';
import {Card, Typography, duration} from '@mui/material';
import {Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot} from '@mui/lab';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const HsptlDetails = () => {

    const location = useLocation();
    const hospitalDetails = location.state.hospital;
    const { name, formatted,lat,lon, state, city, street,district,postcode } = hospitalDetails;
    const [userHospitals,setUserHospitals] = useState([]);
    const[userLatLng,setUserLatLng] = useState('');
    const [Directions,setDirections] = useState([]);

    if(!hospitalDetails){
        return <div>No hospital Details found</div>;
    }
    // userdetails
    useEffect(()=>{
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition((position)=>{
                setUserLatLng({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        };
    },[]);
    useEffect(()=>{
        if(Object.keys(userLatLng).length > 0){
            const USERFORMATTED_API = `https://api.geoapify.com/v1/geocode/reverse?lat=${userLatLng.lat}&lon=${userLatLng.lng}&format=json&apiKey=8125ff70fecf4ed984528cef74740532`;
            axios.get(USERFORMATTED_API).then((res)=>{
                const userData = res.data.results;
                if(userData && Array.isArray(userData)){
                    const userResults = userData.map((result) => ({
                        userlatitude: result.lat,
                        userlongitude: result.lon,
                        userformatted: result.formatted,
                    }));
                    setUserHospitals(userResults);
                };
                // console.log(userData);
            });

            const ROUTE_API = `https://api.geoapify.com/v1/routing?waypoints=${userLatLng.lat},${userLatLng.lng}|${lat},${lon}&mode=drive&apiKey=8125ff70fecf4ed984528cef74740532`;
            axios.get(ROUTE_API).then((res)=>{
                const routeData = res.data.features[0].properties.legs[0].steps;
                //  console.log(res)
                if(routeData && Array.isArray(routeData)){
                 const RouteResults = routeData.map((step) => ({
                     distance: (step.distance),
                     duration: step.time,
                     instruction: step.instruction.text,
                    //  hours : Math.floor(duration),
                    //  minutesDecimal:(duration - hours) * 100,
                    //  minutes : Math.floor(minutesDecimal)
                    // seconds : Math.round((minutesDecimal - minutes) * 100);
                 }));
                 setDirections(RouteResults);
             };
         });
        };
    },[userLatLng]);

  return (
    <div style={{display:'flex',width:'80%',margin:'2rem auto'}}>
        <Card sx={{background:'linear-gradient(to top, #ccebff, white)',minWidth: 275,padding:'1rem',marginRight:'5rem',height:'115vh',width:'50%',border:'1px solid black',borderRadius:'30px'}}>
            <Typography variant="h5" component="div" style={{color:'#000066',fontWeight:'600',borderBottom:'3px solid grey',width:'95%',padding:'1rem',margin:'1rem'}}>
                    {name}
            </Typography>
            {userHospitals.map((userHospital,index)=>{
                return(
                    <div key={index} style={{color:'crimson',fontWeight:'600'}}>               
                        <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                            User Latitude : {userHospital.userlatitude}
                        </Typography>
                        <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                            User Longitude : {userHospital.userlongitude}
                        </Typography>
                        <Typography variant="p" component="div" style={{borderBottom:'3px solid grey',fontSize:'1.2rem',margin:'1rem',paddingBottom:'20px'}}>
                            User Formatted Address : {userHospital.userformatted}
                        </Typography>
                    </div>
                )
            })}
            <div style={{color:'purple',fontWeight:'600'}}>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                    Hospital Latitude : {lat}
                </Typography>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                    Hospital Longitude : {lon}
                </Typography>
                <Typography variant="p" component="div" style={{borderBottom:'3px solid grey',fontSize:'1.2rem',margin:'1rem',paddingBottom:'20px'}}>
                Hospital Formatted Address : {formatted}
                </Typography>
            </div>
            <div style={{color:'#e65c00',fontWeight:'600'}}>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                    Hospital District : {district}
                </Typography>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                    Hospital Street : {street}
                </Typography>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                    City : {city}
                </Typography>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                    State : {state}
                </Typography>
                <Typography variant="p" component="div" style={{fontSize:'1.2rem',margin:'1rem'}}>
                    PostCode : {postcode}
                </Typography>
            </div>
           
        </Card>
        <Card
            sx={{background:'linear-gradient(to top, #ccebff, white)',minWidth: 275,padding:'1rem',marginLeft:'8rem',width:'50%',border:'1px solid black',borderRadius:'30px'}}> 
            <Typography variant="h4" component="div" style={{fontSize:'1.2rem',margin:'1rem',color:"crimson",fontWeight:'700'}}>
                Directions to Hospital :
            </Typography>
            {Directions.map((direction, index) => (
          <Timeline key={index}>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent style={{width:'200px'}}>{direction.instruction}</TimelineContent>
              {/* <TimelineContent>{direction.distance}meters</TimelineContent> */}
              {/* <TimelineContent>{direction.duration}</TimelineContent> */}
            </TimelineItem>
          </Timeline>
        ))}
        </Card>
    </div>
    )
}
export default HsptlDetails;




