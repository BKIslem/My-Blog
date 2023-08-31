import Nav from "../../components/Navbar/Nav";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
    const [userme, setMe] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // let isMounted = true;
        // const controller = new AbortController();

        const getMe = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) {
                  throw new Error('No access token found');
                  navigate('/login');
              }
      
              const response = await fetch('http://localhost:8000/api/users-me', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
              });
      
              if (!response.ok) {
                  throw new Error('Failed to fetch me');
              }
      
              const responseData = await response.json(); 
              console.log(responseData);
              setMe(responseData);
              
          } catch (err) {
              console.error(err);
              navigate('/login');
              // navigate('/login', { state: { from: location }, replace: true });
          }
      }

        getMe();
        return () => {
          // isMounted = false;
        //   controller.abort();
      }
  }, [])
          return (
            <>
              <Nav />
              <section className="container mx-auto px-20">
    <article className=" text-white">
        <h2>Your Profile</h2>
        {userme
            ? (
                <ul>
                <li>User Name : {userme.name}</li>
                <li>Adresse Email : {userme.email}</li>
                {userme.roles.includes('ROLE_ADMIN') && userme.roles.includes('ROLE_USER') ? (
                    <li>Welcome Queen Islem</li>
                ) : (
                    <li>You are a loser user</li>
                )}
            </ul>
            ) 
            : <p>No users to display</p>
        }
        
    </article>
    </section>
            
            </>
            );
        };
export default Dashboard;