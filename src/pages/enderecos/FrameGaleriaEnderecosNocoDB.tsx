import React, { useState, useEffect } from 'react';





export const FrameEnderecosNocoDB: React.FC = () => {

  const[loading, setloading] = useState(true);

  const handleloading = () => {
    setloading(false)

  }

    return (
     <div style={{ position: 'relative', height: '1300px', overflow: 'hidden' }}>
  <div>
    <iframe
      src="https://nocodb.plataforma.app/dashboard/#/nc/gallery/bd752954-69a1-42ee-8f58-cd45431d7a81"
      width="100%"
      height="1300px"
      onLoad={handleloading}
      loading="lazy"
      style={{
        position: 'absolute',
        top: '-75px', // Ajuste esse valor conforme necessário
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


export default FrameEnderecosNocoDB;