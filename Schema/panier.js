
import Realm from "realm";

class Panier extends Realm.Object{ }
Panier.schema = {
    name: "Panier",
    properties: {
        panierID: "string",
        id_produit: "string?",
        session: "string",
        ref: "string",
        qte: "string",
        credit: "string",
        pu_euro: "string",
        promo: "string",
        pu_deref: "string",
        famille: "string",
        titre: "string",
        taux_tva: "string",
        date: "string",
        remise: "string",
    },
    primaryKey: "panierID",
};

export default new Realm({schema: [Panier] });