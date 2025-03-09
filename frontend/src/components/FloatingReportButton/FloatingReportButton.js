// src/components/FloatingReportButton/FloatingReportButton.js
import React, { useState } from 'react';
import Button from '../Button/Button';
import './FloatingReportButton.css';

const FloatingReportButton = ({ onReportSubmit }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [reportDetails, setReportDetails] = useState({ title: '', description: '', category: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportDetails({ ...reportDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReportSubmit(reportDetails);
    setIsFormVisible(false);
  };

  return (
    <div className="floating-report-button">
      <Button onClick={() => setIsFormVisible(!isFormVisible)}>Reportar</Button>
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={reportDetails.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={reportDetails.description}
            onChange={handleInputChange}
          />
          <select
            name="category"
            value={reportDetails.category}
            onChange={handleInputChange}
          >
            <option value="">Selecciona una categoría</option>
            <option value="incidente">Incidente</option>
            <option value="sugerencia">Sugerencia</option>
          </select>
          <Button type="submit">Enviar</Button>
        </form>
      )}
    </div>
  );
};

export default FloatingReportButton;