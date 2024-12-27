import { Edit, SyncLock } from '@mui/icons-material';
import { Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useAuthContext } from "../authcontext/AuthContext";
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  '@media (max-width:768px)': { width: '95%' },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 2,
};

const Account = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [Teamdata, setTeamData] = useState(null); // State to store fetched user data
  const [loading, setLoading] = useState(true); // Loading state
  const { authUser } = useAuthContext(); // Authenticated user data from context

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  useEffect(() => {
    if (authUser) {
      const fetchTeamData = async () => {
        try {
          const token = authUser.token || localStorage.getItem("token");

          if (!token) {
            console.error("No token found, authorization denied.");
            return;
          }

          const response = await fetch(`http://localhost:5000/api/userplan/user/${authUser._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          const data = await response.json();
          console.log("API Response:", data);  // Log the response for debugging

          if (response.ok) {
            setTeamData(data);  // Save the complete data in the state
            setLoading(false);  // Set loading to false once data is fetched
          } else {
            console.error(data.message);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching team data:", error);
          setLoading(false);
        }
      };

      fetchTeamData();
    }
  }, [authUser]);

  // If still loading or no authUser/userData, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an issue with authUser or userData
  if (!Teamdata) {
    return <div>Error loading user data.</div>;
  }

  const { user, totalBalance, totalReferralProfit, purchasedPlans } = Teamdata;

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <h2 id="child-modal-title" className=' text-xl font-[600] text-center my-4'>Update Profile</h2>
          <div className='space-y-4'>
            <input type='text' placeholder='Name' className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent" />
            <input type='text' placeholder='Email' className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent" />
            <input type='password' placeholder='Password' className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent" />
            <input type='password' placeholder='Confirm Password' className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent" />
            <input type="file" className="file:bg-gray-800 file:text-white w-full p-1.5 rounded-md file:outline-none file:border-none border file:p-1 file:font-[400] file:rounded-sm" />
          </div>
          <div className='text-center mt-6 space-x-2'>
            <Button onClick={handleClose} variant='contained' sx={{ marginTop: "10px" }}>Cancel</Button>
            <Button variant='contained' sx={{ marginTop: "10px" }}>Submit</Button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={open2}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <h2 id="child-modal-title" className=' text-xl font-[600] text-center my-4'>Reset Password</h2>
          <div className='space-y-4'>
            <input type='password' placeholder='Password' className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent" />
            <input type='password' placeholder='Confirm Password' className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent" />
          </div>
          <div className='text-center mt-6 space-x-2'>
            <Button onClick={handleClose2} variant='contained' sx={{ marginTop: "10px" }}>Cancel</Button>
            <Button variant='contained' sx={{ marginTop: "10px" }}>Submit</Button>
          </div>
        </Box>
      </Modal>

      <h2 className=" text-4xl font-[800] mt-20 mb-10 text-center">My Account</h2>
      <div className="wrapper">
        <div className="card flex max-md:flex-col max-md:gap-10 relative p-4 items-center w-[90%] m-auto border">
          <div className='absolute top-2 left-2'>
            <Tooltip title="Edit Profile" placement="top">
              <Button variant='contained' onClick={handleOpen}><Edit /></Button>
            </Tooltip>
          </div>
          <div className='absolute md:bottom-2 max-md:top-2 max-md:right-2 md:left-2'>
            <Tooltip title="Forgot Password" placement="top">
              <Button variant='contained' onClick={handleOpen2}><SyncLock /></Button>
            </Tooltip>
          </div>
          <div className="sec-1 md:w-[30%] lg:w-[20%]">
            <img src="/images/profile.png" className="w-40 h-40 m-auto" alt="" />
            <div className="text-center">
              <h2 className="text-xl font-[600]">{user.username}</h2>
              <p className="text-lg font-[400] font-sans">{user.email}</p>
            </div>
          </div>
          <div className="sec-2 md:w-[70%] lg:w-[80%]">
            <div className="cards text-black grid grid-cols-2 min-[650px]:grid-cols-4 gap-4">
            <Link to="/plan">
              <div className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
                
                <h2 className="text-base lg:text-xl font-[600]">Total Plans</h2>
                <p className="text-lg font-[400]">{purchasedPlans.length}</p>
              </div>
              </Link>
              <div className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
                <h2 className="text-base lg:text-xl font-[600]">Total Balance</h2>
                <p className="text-lg font-[400]">Rs. {totalBalance}</p>
              </div>
              <Link to="/withdrawl_history" className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
              
               
                <h2 className="text-base lg:text-xl font-[600]">Withdrawl History</h2>
                <p className="text-lg font-[400]"></p>
              
              </Link>
              <Link to="/recharge" className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
              
               
                <h2 className="text-base lg:text-xl font-[600]">Recharge History</h2>
                <p className="text-lg font-[400]"></p>
              
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
