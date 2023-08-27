import React from "react";
import { albumes } from "../datos_test/albumes";
import PuestosA from "./puestos_albumes";

export default function Top5_Albumes() {
    return (
        <>
            <div className="TOP5_Canciones">
                <PuestosA albumes={sort(albumes)} />
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