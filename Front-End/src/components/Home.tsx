import SymptomGroup from "./SymptomGroup";
import SelectedSymptomGroup from "./SelectedSymptomGroup";
import PredictionResult from "./PredictionResult";
import { useState, useEffect, useRef } from "react";
import { ChangeEvent } from "react";
import { API_ENDPOINTS } from '../apiConfig';

interface PredictionResults {
  disease: string,
  probability: number
}

const Home = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<{ id: number; symptom: string }[]>([]);
  const [predictionResults, setPredictionResults] = useState<PredictionResults[]>([]);

  const handleSelectedItem = (id: number, symptom: string) => {
    // Check if the item already exists in selectedSymptoms
    const itemExists = selectedSymptoms.some(item => item.id === id && item.symptom === symptom);
  
    if (!itemExists) {
      // Create a new array with the updated selected symptoms
      setSelectedSymptoms(prevSelectedSymptoms => [...prevSelectedSymptoms, { id, symptom }]);
    }
  };  

  const removeDeletedItem = (id: number) => {
    setSelectedSymptoms(prevSelectedSymptoms =>
    prevSelectedSymptoms.filter(symptom => symptom.id !== id)
  );

  };

  const [text, setText] = useState('');
  const searchTextRef = useRef<string>('');

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  useEffect(() => {
    // Update the ref's current value whenever text changes
    searchTextRef.current = text;
  }, [text]);

  const getPredictions = () => {
    const idList = {
      ids: selectedSymptoms.map(item => item.id)
    };
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idList)
    };
    
    fetch(API_ENDPOINTS.PREDICT, requestOptions)
      .then(response => response.json())
      .then((predictionResults:PredictionResults[]) => {
        setPredictionResults(predictionResults);
      })
      .catch(error => console.error('Error:', error));
  }
  
  return (
    <div className="container section">
      <div className="row">
        <div className="col-md-6">
          <div className="col-md-12 unit form-control">
            <p className="card-heading">Select Symptoms</p>
            <input
              className="form-control me-2 mb-4"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange = {handleTextChange}>
            </input>
            <SymptomGroup searchKey={text} onSelectItem={handleSelectedItem}></SymptomGroup>
          </div>
        </div>
        <div className="col-md-6">
          <div className="col-md-12 unit form-control">
            <p className="card-heading">Selected Symptoms</p>
            { selectedSymptoms.length == 0 && <p>No symptoms selected.</p>}
            <SelectedSymptomGroup symptoms={selectedSymptoms} onDeletedItem={removeDeletedItem} ></SelectedSymptomGroup>
          </div>
          <div className="btn-inline">
            <button
              type="button"
              onClick={getPredictions}
              disabled={selectedSymptoms.length < 3 ? true : false}
              className="btn btn-success"
            >
              <span>&nbsp;</span>
              <span>&nbsp;</span>Predict<span>&nbsp;</span>
              <span>&nbsp;</span>
            </button>
            { selectedSymptoms.length > 0 && selectedSymptoms.length < 3 && <span><span style={{ paddingLeft: '10px' }}></span><span className="text-primary">* Select at least 3 symptoms for better results.</span></span>}
          </div>
          {predictionResults.length != 0 ?<div className="col-md-12 unit form-control mt-3">
            <p className="card-heading">Prediction Results</p>
            {predictionResults.map((p, index) => (
              <PredictionResult key={index + 1} id = {index + 1} disease={p.disease} probability={p.probability} />
            ))}
          </div> :null}
        </div>
      </div>
    </div>
  );
};

export default Home;
