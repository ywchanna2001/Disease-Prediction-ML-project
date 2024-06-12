interface Props {
    id: number;
    disease: string;
    probability: number;
}

const PredictionResult: React.FC<Props> = ({ id, disease, probability }) => {
    const percentage = +(probability * 100).toFixed(2);
  
    return (
      <>
        <p>{`${id}. ${disease}`}</p>
        <div className="progress">
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${percentage}%` }} // Correct way to interpolate the variable
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {`${percentage}%`}
        </div>
      </div>
      </>
    );
};
  
export default PredictionResult;