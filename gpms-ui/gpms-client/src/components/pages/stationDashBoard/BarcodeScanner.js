import { useState } from "react";

export const BarcodeScanner =(props) => {

  const [barcodeInputValue, updateBarcodeInputValue] = useState('')

  function barcodeAutoFocus() {
    document.getElementById("SearchbyScanning").focus()
  }

  function onChangeBarcode(event) {
    updateBarcodeInputValue(event.target.value)
  }

  function onKeyPressBarcode(event) {
    if (event.keyCode === 13) {
      updateBarcodeInputValue(event.target.value)
        console.log(event.target.value);
    }
  }

  return (
    <div>
      <input
        autoFocus={true}
        placeholder='Start Scanning'
        value={barcodeInputValue}
        onChange={onChangeBarcode}
        id='SearchbyScanning'
        className='SearchInput'
        onKeyDown={onKeyPressBarcode}
        onBlur={barcodeAutoFocus}
        td="dsdsd"
      />
    </div>
  )
      
};
