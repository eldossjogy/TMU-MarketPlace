import L from "leaflet";
import { useEffect, useRef } from "react";

const ControlClasses = {
    bottomleft: "leaflet-bottom leaflet-left",
    bottomright: "leaflet-bottom leaflet-right",
    topleft: "leaflet-top leaflet-left",
    topright: "leaflet-top leaflet-right"
};

export default function LeafletControl(props) {
    const divRef = useRef(null);

    useEffect(() => {
        if (divRef.current) {
            L.DomEvent.disableClickPropagation(divRef.current);
            L.DomEvent.disableScrollPropagation(divRef.current);
        }
    });

    return (
        <div
            ref={divRef}
            className={props.position && ControlClasses[props.position]}>
            <div className={"leaflet-control shadow-md"}>{props.children}</div>
        </div>
    );
}