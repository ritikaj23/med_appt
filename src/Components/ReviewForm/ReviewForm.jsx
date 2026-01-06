import React, { useEffect } from 'react';
import GiveReviews from './GiveReviews.jsx';
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';

const ReviewForm = () => {
  const reportData = [
    {
      serialNumber: 1,
      doctorName: 'Dr. John Doe',
      doctorSpeciality: 'Cardiology',
    },
    {
      serialNumber: 2,
      doctorName: 'Dr. Jane Smith',
      doctorSpeciality: 'Dermatology',
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    // const authtoken = sessionStorage.getItem("auth-token");
    // if (!authtoken) {
    //   navigate("/login");
    // }
  }, [navigate]);

  return (
    <div style={{ marginTop: '10%' }} className="reviews-container">
      <h1>Reviews</h1>

      <table className="report-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Doctor Name</th>
            <th>Doctor Specialty</th>
            <th>Provide Review</th>
            <th>Review Feedback</th>
          </tr>
        </thead>

        <tbody>
          {reportData.map((report) => (
            <tr key={report.serialNumber}>
              <td>{report.serialNumber}</td>
              <td>{report.doctorName}</td>
              <td>{report.doctorSpeciality}</td>

              <td>
                <Popup
                  trigger={
                    <button className="give-review-button">
                      Feedback
                    </button>
                  }
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <GiveReviews />
                      <button
                        className="close-modal-button"
                        onClick={close}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </Popup>
              </td>

              <td>
                {/* Intentionally left blank – no post-submission behavior */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewForm;