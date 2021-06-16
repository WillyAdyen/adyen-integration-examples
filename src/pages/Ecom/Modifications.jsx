import React, { useState } from "react";
import ModificationsAPIHelper from '../../utils/helpers/ModificationsAPIHelper';

const Modifications = () => {
    const [pspReference, setPspReference] = useState("");
    const [amount, setAmount] = useState("");

    const handlePspReference = (event) => {
        setPspReference(event.target.value);
    };

    const handleAmount = (event) => {
        setAmount(event.target.value);
    };

    const capture = () => {
        ModificationsAPIHelper.capture(pspReference, amount)
        .then(data => {
            console.log("Capture Response", data);
        });
    };

    const refund = () => {
        ModificationsAPIHelper.refund(pspReference, amount)
        .then(data => {
            console.log("Refund Response", data);
        });
    };

    return (
        <div className="App">
            <h1>Modifications</h1>
            <div>
                <label htmlFor="pspReference">PspReference</label>
                <input type="text" id="pspReference" name="pspReference" value={pspReference} onChange={handlePspReference} />
            </div>
            <div>
                <label htmlFor="amount">Amount</label>
                <input type="text" id="amount" name="amount" value={amount} onChange={handleAmount} />
            </div>
            <br />
            <button onClick={capture}>Capture</button>
            <button onClick={refund}>Refund</button>
        </div>
    );
}
export default Modifications;