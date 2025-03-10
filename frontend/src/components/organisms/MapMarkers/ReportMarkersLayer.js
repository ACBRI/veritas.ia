import React from 'react';
import { useMap } from '../../../context/MapContext';
import { useReport } from '../../../context/ReportContext';
import ReportMarker from './ReportMarker';

const ReportMarkersLayer = () => {
  const { userLocation } = useMap();
  const { reports, getNearbyReports } = useReport();
  
  // Obtener solo los reportes cercanos
  const nearbyReports = getNearbyReports(userLocation);

  return (
    <>
      {nearbyReports.map(report => (
        <ReportMarker
          key={report.id}
          report={report}
          userLocation={userLocation}
        />
      ))}
    </>
  );
};

export default ReportMarkersLayer;
