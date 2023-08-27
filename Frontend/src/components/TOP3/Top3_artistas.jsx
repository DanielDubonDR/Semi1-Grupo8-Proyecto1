import Perfil from "./Perfil2";
import React from "react";
import { profiles } from "../datos_test/artistas";
import "./style_top3.css";

export default function Top3_artistas() {
    return (
        <>
            <div className="TOP3_artistas">
                <Perfil profiles={sort(profiles)} />
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