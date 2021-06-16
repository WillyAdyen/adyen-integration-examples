import React, { useState } from 'react';

import PayByLinkAPIHelper from '../../utils/helpers/PayByLinkAPIHelper';

const PayByLink = () => {
  const [response, setResponse] = useState("");
  const [link, setLink] = useState("");

  const generateLink = () => {
    PayByLinkAPIHelper.generateLink().then(data => {
      setResponse(JSON.stringify(data, null, 4));
      setLink(data.url);
    });
  };

  return (
  <div>
    <h1>Pay By Link</h1>
    <button onClick={generateLink}>Generate Link</button>
    <a target="_blank" href={link}>Link</a>
    <br />
    <pre>
      <code>{response}</code>
    </pre>
  </div>
  );
}
export default PayByLink;