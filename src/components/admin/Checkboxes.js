import React from 'react'

export const CheckBoxes = props => {
    return (
       <input key={props._id} onChange={e => {}} onClick={props.handleCheckChieldElement} type="checkbox" value={props._id} checked={props._isChecked} />      
    )
}

export default CheckBoxes