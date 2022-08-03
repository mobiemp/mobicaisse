import { useEffect, useState,reject } from 'react';

const useStatusServer = ({ pollingInterval }) => {
    const [status, setStatus] = useState();
    useEffect(() => {
       const interval = setInterval(() => {
        fetch('http://caisse.serveravatartmp.com/caisse-backend/synchronisation?'+ new URLSearchParams({
          action: 'connexion',
          idcaisse: 1,
        }))
        .then((response) => response.json())
        .then((responseJson) => {
          setStatus(responseJson.response)
          if(responseJson.result === 'NO'){
            console.log(responseJson)
          }
          if (responseJson.response === 200) {
            clearInterval(interval);
          }
        })
          .catch(
            function(error) {
              console.error(error)
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }, pollingInterval);
      
      return () => {
         clearInterval(pollingInterval);
      };
    }, [pollingInterval]);
    return { status };
  };

  export default useStatusServer;