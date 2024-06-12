import { useState, useEffect } from "react";
import logoImage from '../assets/diagnosage-logo.png';
import { API_ENDPOINTS } from '../apiConfig';

interface MedicalCenterData {
    address: string;
    name: string;
    icon: string;
    url: string;
}

interface UserLocation {
    latitude: number;
    longitude: number;
}
  
function MedicalCenter() {
    const [medicalCenter, setMedicalCenter] = useState<MedicalCenterData[]>([]);
    const [userLocation, setUserLocation] = useState<UserLocation>({latitude: 6.975553712782505, longitude: 79.91551871164292});
    const [locationAccessGranted, setLocationAccessGranted] = useState<boolean>(false);

    const promptGrantAccess = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                setMedicalCenter([]);
                setUserLocation({ latitude, longitude });
                setLocationAccessGranted(true);
            }, (error) => {
                alert("Error getting location: " + error.message);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }    
    
    useEffect(() => {
        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: userLocation.latitude, lng: userLocation.longitude })  // Send the user's location to the server
        };

        fetch(API_ENDPOINTS.MEDICAL_CENTERS, requestOptions)
        .then(res => res.json())
        .then((serverData: MedicalCenterData[]) => {
            setMedicalCenter(serverData); // Update state with medicalCenter received from the server
        })
        .catch(error => console.error('Error:', error));
    }, [userLocation, locationAccessGranted]);

    return (
        <>
        {medicalCenter.length == 0 && <div className="loading">Loading&#8230;</div>}
        <div className="container section fade-in-element">
            <div className="row">
                <div className="col-md-12">
                    {!locationAccessGranted &&
                        <div className="location-access-message mb-2">
                            <span>Location access is required to show nearby medical centers. Grant access?</span>
                            <span>&nbsp;&nbsp;</span>
                            <button type="button" onClick={promptGrantAccess} className="btn btn-success">
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>Grant Access<span>&nbsp;</span>
                                <span>&nbsp;</span>
                            </button>
                        </div>
                    }
                    <ul className="list-group list-group-light">
                        {medicalCenter.map(l => (
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={l.icon == "" ? logoImage : l.icon}
                                        alt=""
                                        style={{ width: '200px', height: '200px' }}
                                    />
                                    <div className="ms-3">
                                        <p className="fw-bold mb-1">{l.name}</p>
                                        <p className="text-muted mb-0">{l.address}</p>
                                        <button type="button" onClick={() => window.open(l.url, '_blank')} className="btn btn-success mt-3">
                                            <span>&nbsp;</span>
                                            <span>&nbsp;</span>See Location<span>&nbsp;</span>
                                            <span>&nbsp;</span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        </>
      );
}

export default MedicalCenter;