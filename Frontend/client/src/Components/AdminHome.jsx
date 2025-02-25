import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styling/AdminHome.css'

const AdminHome = () => {

  const navigate = useNavigate()

  const ViewAllDrivers = () => {
    navigate("/drivers/all")
  }

  const ViewAllPassengers = () => {
    navigate("/drivers/all")
  }

  return (
    <div>
      <h1>Admin Home Page</h1>
      
      {/* System & Safety Monitoring */}
      <h1><strong>System & Safety Monitoring</strong></h1>

      <div className='Stat-Section'>
        <h1><strong>Pending Drivers</strong></h1>

        <div>
          <div className='Pending-Driver-Indiv-Box'>
            <p>Driver 1</p>
            <button className='accept-driver-button'>accept driver</button>
            <button className='decline-driver-button'>decline driver</button>
            <button className='view-driver-button'>view driver</button>
          </div>
        </div>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Fraudulent Activity Alerts (multiple reports on a user, etc.)</strong></h1>
        <div className='Two-Line-Rating-Indiv'>
          <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
          <p>Reports: 42</p>
        </div>
        <div className='Two-Line-Rating-Indiv'>
          <p><p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p></p>
          <p>Reports: 28</p>
        </div>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Customer Support Tickets (Complaints, ride issues, or technical support requests)</strong></h1>

        <div>
          <div className='Pending-Driver-Indiv-Box'>
            <p>Support Ticket #1</p>
            <button className='accept-driver-button'>mark as fixed</button>
            <button className='decline-driver-button'>delete ticket</button>
            <button className='view-driver-button'>view ticket</button>
          </div>
          <div className='Pending-Driver-Indiv-Box'>
            <p>Support Ticket #2</p>
            <button className='accept-driver-button'>mark as fixed</button>
            <button className='decline-driver-button'>delete ticket</button>
            <button className='view-driver-button'>view ticket</button>
          </div>
        </div>
      </div>

      {/* Basic Analytics */}
      <h1><strong>Basic Analytics</strong></h1>

      <div className='Stat-Section'>
        <h1><strong>Total Users</strong></h1>

        <div className='Driver-Passenger-Total-Section'>
          <p><strong>Drivers: </strong> put count here</p>
          <button className='ViewAllDriversButton' onClick={ViewAllDrivers}>View All Drivers</button>
        </div>
        <div className='Driver-Passenger-Total-Section'>
          <p><strong>Passengers: </strong> put count here</p>
          <button className='ViewAllDriversButton' onClick={ViewAllPassengers}>View All Passengers</button>
        </div>
        <p><strong>Total: </strong> put count here</p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Total Rides COMPLETED</strong></h1>
        <p><strong>Total: </strong> put count here</p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Total Rides ONGOING</strong></h1>
        <p><strong>Total: </strong> put count here</p>
      </div>

      {/* Driver Section */}
      <h1><strong>Drivers Analytics</strong></h1>

      <div className='Stat-Section'>
        <h1><strong>Active Drivers</strong></h1>
        <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
        <p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Inactive Drivers</strong></h1>
        <div className='Two-Line-Rating-Indiv'>
          <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
          <p>Days Inactive: 2</p>
        </div>
        <div className='Two-Line-Rating-Indiv'>
          <p><p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p></p>
          <p>Days Inactive: 28</p>
        </div>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Top Performing Drivers</strong></h1>
        <div className='Two-Line-Rating-Indiv'>
          <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
          <p>3. 4 ⭐ 104 users</p>
        </div>
        <div className='Two-Line-Rating-Indiv'>
          <p><p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p></p>
          <p>4.2 ⭐ 8 users</p>
        </div>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Flagged Drivers (reported by passenger)</strong></h1>
        <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
        <p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p>
      </div>

      {/* Passenger Section */}
      <h1><strong>Passenger Analytics</strong></h1>

      <div className='Stat-Section'>
        <h1><strong>Active Passengers</strong></h1>
        <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
        <p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>New Sign Ups (Last 7 days, 30 Days)</strong></h1>
        <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
        <p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Frequent Riders</strong></h1>
        <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
        <p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Flagged Passengers (reported by drivers)</strong></h1>
        <p>1. <strong><a href="View One Driver Line">Jane Doe</a></strong></p>
        <p>2. <strong><a href="View One Driver Line">John Doe</a></strong></p>
      </div>

      {/* Ride & Transaction Data */}
      <h1><strong>Ride & Transaction Data</strong></h1>

      <div className='Stat-Section'>
        <h1><strong>Total Rides Per Day/ Week/ Month (graph)</strong></h1>
        <p><strong>Total Rides - LAST 24 HOURS: </strong> put count here</p>
        <p><strong>Total Rides - LAST 7 DAYS: </strong> put count here</p>
        <p><strong>Total Rides - LAST 30 DAYS: </strong> put count here</p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Most Popular Routes (frequeny pickup and drop-off locations)</strong></h1>
        <p>1. <strong>Dallas, TX (pickup)</strong></p>
        <p>2. <strong>Los Angeles, CA (drop-off)</strong></p>
        <p>3. <strong>Fort Worth, TX (drop-off)</strong></p>
        <p>4. <strong>Miami, FL (pickup)</strong></p>
        <p>5. <strong>New York City, NY (drop-off)</strong></p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Peak Ride Times (graph)</strong></h1>
        <p><strong>Monday: </strong> 3:53 </p>
        <p><strong>Tuesday: </strong> 2:42 </p>
        <p><strong>Wednesday: </strong> 9:25 </p>
        <p><strong>Thursday: </strong> 23:49 </p>
        <p><strong>Friday: </strong> 20:53 </p>
      </div>
      
      <div className='Stat-Section'>
        <h1><strong>Cancellation Rate</strong></h1>
        <p>6%</p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Average Fair Ride</strong></h1>
        <p><strong>$ </strong> 53</p>
      </div>

      <div className='Stat-Section'>
        <h1><strong>Payment Methods Used (pie chart)</strong></h1>
        <p><strong>Card: </strong> 21%</p>
        <p><strong>Cash: </strong> 30%</p>
        <p><strong>Digital Wallets: </strong> 49%</p>
      </div>
      
    </div>
  )
}

export default AdminHome