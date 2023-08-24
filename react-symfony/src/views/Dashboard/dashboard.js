import Nav from "../../components/Navbar/Nav";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
    const [users, setUsers] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) {
                  throw new Error('No access token found');
                  navigate('/login');
              }
      
              const response = await fetch('http://localhost:8000/api/users', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
              });
      
              if (!response.ok) {
                  throw new Error('Failed to fetch users');
              }
      
              const responseData = await response.json(); 
              console.log(responseData);
              setUsers(responseData["hydra:member"]);
              // console.log(responseData["hydra:member"]);
          } catch (err) {
              console.error(err);
              navigate('/login');
              // navigate('/login', { state: { from: location }, replace: true });
          }
      }

        getUsers();
        return () => {
          // isMounted = false;
          controller.abort();
      }
  }, [])
          return (
            <>
              <Nav />
              <div className="">
    <article className=" text-white">
        <h2>Users List</h2>
        {users?.length
            ? (
                <ul>
                    {users.map((user, i) => (
                      <li key={i}>User Name : {user?.name } Adresse Email : {user?.email}</li>
                      

                    ))}
                </ul>
            ) 
            : <p>No users to display</p>
        }
        
    </article>
</div>
            
            </>
            );
        };
export default Dashboard;