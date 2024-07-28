import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TableDocs = () => {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    // Fetch document data based on the id parameter
    axios
      .get(`http://localhost:5000/api/docsTitle`)
      .then((response) => {
        setDocument(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the document!", error);
      });
  }, []); // Re-run the effect if the id changes

  if (!document) {
    return <div>Loading...</div>;
  }

  console.log(document, "docsssss");
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            {/* <th></th> */}
          </tr>
        </thead>
        <tbody>
          {document.map((item) => (
            <tr key={item?._id}>
              <td style={{ border: "1px solid" }}>
                <Link to={`/subDoc/${item?._id}`}>{item?.title}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDocs;
