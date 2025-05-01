import React from 'react'

const DriverVarificationForm = () => {
    const [selfie, setSelfie] = useState(null);
    const [license, setLicense] = useState(null);
  
    const handleUpload = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('selfie', selfie);
      formData.append('license', license);
  
      try {
        await axios.post(`http://localhost:8080/driver/${driverId}/upload-docs`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Upload successful!");
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload documents.");
      }
    };
  
    return (
      <form onSubmit={handleUpload}>
        <div>
          <label>Upload Selfie:</label>
          <input type="file" accept="image/*" onChange={(e) => setSelfie(e.target.files[0])} />
        </div>
        <div>
          <label>Upload Driver’s License:</label>
          <input type="file" accept="image/*" onChange={(e) => setLicense(e.target.files[0])} />
        </div>
        <button type="submit">Submit</button>
      </form>
    );
}

export default DriverVarificationForm