import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styling/AdminHome.css'

const AdminHome = () => {

    const navigate = useNavigate()

    const ViewAllDrivers = () => {
        navigate("/drivers/all")
    }

  return (
    <div>
        <h1>Admin Home Page</h1>

        <div>
            <button className='ViewAllDriversButton' onClick={ViewAllDrivers}>View All Drivers</button>
        </div>
    </div>
  )
}

export default AdminHome