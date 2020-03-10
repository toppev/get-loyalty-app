import GrapesJS from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import React, { useEffect } from "react";

export default function () {

    useEffect(() => {
        GrapesJS.init({
            container: `#page-editor`,
            fromElement: true,
        });
    });

    return (
        <>
            <div id="page-editor">
                <h2>Testiii</h2>
            </div>
        </>)
}