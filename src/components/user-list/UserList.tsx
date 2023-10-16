import ReactList from "react-list";
import React, {useState} from "react";


const UserList = () => {
    const [state, setState] = useState();

    function renderItem(index: number, key: number|string) {
        return (
            <h2 key={key}>{index}</h2>
        )
    }

    return(
        <div style={{overflow: 'auto', maxHeight: 100}}>
            <ReactList 
                length={100}
                itemRenderer={renderItem}
                type="variable"
            />
        </div>
    )
}

export default UserList;