import React, { useState, useEffect } from 'react';





export const FrameCalendarioEnderecosNocoDB: React.FC = () => {

  const[loading, setloading] = useState(true);

  const handleloading = () => {
    setloading(false)

  }

    return (
     <div style={{ position: 'relative', height: '1300px', overflow: 'hidden' }}>
  <div>
    <iframe
      src="https://nocodb.plataforma.app/dashboard/#/nc/calendar/a26a2df5-1e4b-4fd8-971e-34c01b9540dc"
      width="100%"
      height="1300px"
      onLoad={handleloading}
      loading="lazy"
      style={{
        position: 'absolute',
        top: '-45px', // Ajuste esse valor conforme necessário
        left: 0,
        border: 'none',
      }}
    ></iframe>

      {loading && (

        <p className='font-bold text-center'>Carregando Endereços...</p>


      )}
  </div>
</div>

    )
};


export default FrameCalendarioEnderecosNocoDB;