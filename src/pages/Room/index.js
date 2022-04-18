import {useParams} from "react-router";

export default function Room() {
    const {id: roomID} = useParams();

    console.log(roomID);

    return(
        <div>
            Room
        </div>
    );
}