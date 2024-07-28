import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const SubDoc = () => {
  const { id } = useParams(); // Access the 'id' parameter from the URL
  const [document, setDocument] = useState(null);
  const [docId, setDocId] = useState(id);

  useEffect(() => {
    // Fetch document data based on the id parameter
    axios
      .get(`http://localhost:5000/api/docswithid/${docId}`)
      .then((response) => {
        setDocument(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the document!", error);
      });
  }, [docId]); // Re-run the effect if the id changes

  if (!document) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {document.map((item) => (
            <tr key={item._id}>
              <td
                style={{ border: "1px solid", cursor: "pointer" }}
                onClick={() => setDocId(item._id)}
              >
                {item.title}
              </td>
              <td style={{ border: "1px solid", cursor: "pointer" }}>
                <Link to={`/create?docId=${item._id}`}>edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubDoc;
