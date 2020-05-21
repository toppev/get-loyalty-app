import { useContext } from "react";
import AppContext from "../../../context/AppContext";

function usePlaceholderContext() {

    const appContext = useContext(AppContext);

    return { appContext }
}

export {
    usePlaceholderContext
}