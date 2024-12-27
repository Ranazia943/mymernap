import { useEffect, useState } from "react";
import { useAuthContext } from "../authcontext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';

const Home = () => {
  const { setAuthUser } = useAuthContext();
  const [Teamdata, setTeamData] = useState(null); // State to store fetched user data
  const [plans, setPlans] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { authUser } = useAuthContext(); // Authenticated user data from context

  const navigate = useNavigate();

  const logout = () => {
    try {
      // Clear user and token from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Set authUser to null
      setAuthUser(null);

      // Show success toast notification
      toast.success("Logout successful! You have been logged out.", {
        duration: 1000, // 1 second
      });

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  };


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
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/plan/all'); // Replace with your backend URL
          setPlans(response.data.plans);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch plans');
          setLoading(false);
        }
      };
  
      fetchPlans();
    }, []);
  
    useEffect(() => {
      if (authUser) {
        const fetchWithdrawalHistory = async () => {
          try {
            const token = authUser.token || localStorage.getItem("token");
  
            if (!token) {
              console.error("No token found, authorization denied.");
              return;
            }
  
            const response = await axios.get(
              `http://localhost:5000/api/withdrawl/${authUser._id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            if (response.data) {
              console.log("Withdrawal History Data:", response.data); // Log data for debugging
              setWithdrawalHistory(response.data.data);
              setLoading(false);
            } else {
              setLoading(false);
              console.error("Error: No data found.");
            }
          } catch (error) {
            console.error("Error fetching withdrawal history:", error);
            setLoading(false);
          }
        };
  
        fetchWithdrawalHistory();
      }
    }, [authUser]);
    const totalWithdrawn = withdrawalHistory.reduce((total, withdrawal) => {
      return total + withdrawal.amount;
    }, 0);  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    // If there's an issue with authUser or userData
    if (!Teamdata) {
      return <div>Error loading user data.</div>;
    }
  
    const { totalBalance } = Teamdata;
  

  return (
    <div className="bg-[#f9f9f9] min-h-screen">
      <div className="wrapper">
        <div className="banner relative w-full">
          <img
            src="/images/background.jpg"
            className="h-[200px] md:h-[300px] object-cover w-full rounded-br-[120px] md:rounded-br-[200px] rounded-bl-[120px] md:rounded-bl-[200px]"
            alt="Banner"
          />
          <div className="tir shadow-sm rounded-lg md:p-4 p-2">
            <div className="pb-2 flex justify-between items-center">
              <div>
                <p className="text-lg text-gray-500">Your Balance</p>
                <span className="text-xl text-black font-[500]">Rs.{totalBalance}</span>
                </div>
              <div>
                <p className="text-base text-gray-500 text-end">Deposit Wallet</p>
                <h2>
                <span className="text-xl text-black font-[500]">🌕Rs. {totalWithdrawn.toFixed(2)}</span>

                </h2>
              </div>
            </div>
            <div className="flex items-center border-t p-4 justify-between">
              <Link to="/addamount">
                <div
                  data-aos="zoom-in"
                  data-aos-duration="1500"
                  className="text-center hover:-translate-y-1 duration-300"
                >
                  <img
                    src="/images/wallet.png"
                    className="w-8 h-8 md:w-10 md:h-10 m-auto"
                    alt="Recharge"
                  />
                  <p className="font-[400] md:text-base text-sm lg:text-lg">Recharge</p>
                </div>
              </Link>
              <Link to="/withdraw/request">
                <div
                  data-aos="zoom-in"
                  data-aos-duration="1500"
                  data-aos-delay="100"
                  className="text-center hover:-translate-y-1 duration-300"
                >
                  <img
                    src="/images/withdraw.png"
                    className="w-8 h-8 md:w-10 md:h-10 m-auto"
                    alt="/withdraw/request"
                  />
                  <p className="font-[400] md:text-base text-sm lg:text-lg">Withdraw</p>
                </div>
              </Link>
              <Link to="/team">
                <div
                  data-aos="zoom-in"
                  data-aos-duration="1500"
                  data-aos-delay="200"
                  className="text-center hover:-translate-y-1 duration-300"
                >
                  <img
                    src="/images/teams.png"
                    className="w-8 h-8 md:w-10 md:h-10 m-auto"
                    alt="Team"
                  />
                  <p className="font-[400] md:text-base text-sm lg:text-lg">Team</p>
                </div>

              </Link>
              
              
            </div>
            
          </div>
          
        </div>

      
     
         <div className=" max-sm:mx-2">
         <div className="services max-[400px]:w-full w-[350px] sm:w-[420px]  md:w-[600px] mx-auto mt-28 mb-20">
                <h2 className=' md:text-2xl font-[700] text-start ml-6 md:ml-4 my-4'>Our Services Plan</h2>
                <div className="wrapper grid grid-cols-4 gap-2 md:gap-4 mx-2 md:mx-4 mt-4">
                   <Link to="/account">
                   <div data-aos="zoom-in" data-aos-duration="1500" className=" text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/account.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">Account</p>
                    </div>
                   </Link>
                    <Link to="/invite">
                    <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="100" className=" text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/invitee.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">Invite</p>
                    </div>
                    </Link>
                   <Link to="/plan">
                   <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="200" className=" text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/plans.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">My Palns</p>
                    </div>
                   </Link>
                   <Link to="/addamount"> <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="300" className=" text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/checkin.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">Check-In</p>
                    </div></Link>
                  <Link to="/about">
                  <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="0" className=" text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/about.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">About</p>
                    </div>
                  </Link>
                    <Link to="/support">
                    <div data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1500" className=" text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/support.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">Support</p>
                    </div>
                    </Link>
                    <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="200" className=" text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/app.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">App</p>
                    </div>

                    <div
          data-aos="zoom-in"
          data-aos-duration="1500"
          data-aos-delay="300"
          className="text-center bg-white hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4"
          onClick={logout}
        >
          <img
            src="/images/logout.png"
            className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto"
            alt="Logout"
          />
          <p
            className="text-sm md:text-base font-[400] mt-1 cursor-pointer"
           
          >
            Logout
          </p>
        </div>
                   
            </div>
            </div>
         </div>
         <div className="investment mt-20 mx-4 md:mx-10 lg:mx-16 pb-28">
      <h2 className="text-center my-8 text-3xl font-[600] font-sans">Investment Plans</h2>
      <div className="wrapper grid grid-cols-1 min-[700px]:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            data-aos="zoom-in"
            data-aos-duration="1000"
            className="p-4 border max-[700px]:w-[400px] max-[700px]:mx-auto max-[500px]:w-full group rounded-lg hover:-translate-y-2 duration-300 overflow-hidden bg-white"
          >
            <h2 className="text-center font-[700] text-xl my-2 rounded-lg text-white">{plan.name}</h2>
            <div className="wrapp flex justify-between items-end">
              <div>
                <p>
                  <span className="text-lg text-black font-[500]">Price : </span>
                  <span className="text-black font-[350] text-base">Rs. {plan.price}</span>
                </p>
                <p>
                  <span className="text-lg text-black font-[500]">Duration : </span>
                  <span className="text-black font-[350] text-base">{plan.duration} Days</span>
                </p>
                <p>
                  <span className="text-lg text-black font-[500]">Daily Profit : </span>
                  <span className="text-black font-[350] text-base">Rs. {plan.dailyProfit}</span>
                </p>
                <p>
                  <span className="text-lg text-black font-[500]">Total Profit : </span>
                  <span className="text-black font-[350] text-base">Rs. {plan.totalProfit}</span>
                </p>
              </div>
              <div>
                <button className="px-4 py-2 text-lg font-[500] bg-green-500 rounded-md text-white group-hover:bg-green-600 duration-300">
                  Buy Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
        </div>
    </div>
  )
}

export default Home