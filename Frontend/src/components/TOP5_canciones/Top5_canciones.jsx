import React from "react";
import { canciones } from "../datos_test/canciones";
import Puestos from "./puestos_canciones";

export default function Top5_Canciones() {
    return (
        <>
            <div className="TOP5_Canciones">
                <Puestos canciones={sort(canciones)} />
            </div>
        </>
    );
}

function sort(data){
    return data.sort((a, b) => {
        if (a.reps === b.reps) {
            return b.reps - a.reps;
        }
        else{
            return b.reps - a.reps;
        }
    });
}