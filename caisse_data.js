import React from "react";


const caisseData = () => {
    return fetch('http://localhost/caisse-backend/parametre.php?action=info_caisse')
        .then((response) => response.json())
        .then((responseJSON) => {
            return responseJSON
        })
        .catch((error) => {
            console.error(error);
            return;
        });
}

export default caisseData;