import { FaStar } from 'react-icons/fa';
import { useState, ChangeEvent, FormEvent } from 'react';
import { API_ENDPOINTS } from '../apiConfig';

interface FormData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

function Feedback() {
  const [hover, setHover] = useState<number | null>(null);  // Adjusted hover state type
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    rating: 5,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      rating: rating,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Make a POST request with formData
    console.log(formData);
    fetch(API_ENDPOINTS.FEEDBACK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          message: '',
          rating: 5,
        });
        setHover(null);  // Reset hover state
  
        // Update success message
        setSuccessMessage('Feedback submitted successfully!');
  
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      })
      .catch((error) => {
        console.error('Error submitting feedback:', error);
  
        // Update error message if needed
        setSuccessMessage('Error submitting feedback. Please try again.');
      });
  };  

  return (
    <div className="container section">
      <div className="row">
        <div className="col-md-6">
          {/* Display success message */}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <p>Got any suggestions or feedback? Help us improve💡</p>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control feedback-form-control"
                id="name"
                placeholder="Brian Adams"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control feedback-form-control"
                id="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="message" className="form-label">
                Your message
              </label>
              <textarea
                className="form-control feedback-form-control"
                id="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                  <label key={currentRating}>
                    <input
                      type="radio"
                      id={`rating-${currentRating}`}
                      className="star-radio"
                      style={{ display: 'none' }}
                      name="rating"
                      value={`${currentRating}`}
                      onChange={() => handleRatingChange(currentRating)}
                    />
                    <FaStar
                      className="star feedback-form-control"
                      size={40}
                      color={currentRating <= (hover || formData.rating) ? '#ffc107' : '#e4e5e9'}
                      onMouseEnter={() => setHover(currentRating)}
                      onMouseLeave={() => setHover(formData.rating)}
                    />
                  </label>
                );
              })}
            </div>

            <button type="submit" className="btn btn-success">
              Send Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
