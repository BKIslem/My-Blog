import Nav from "../../components/Navbar/Nav";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ListUsers = () => {
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
              
            //   navigate('/login');
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
             
        {users?.length
            ? (
                <section className="container mx-auto px-20">
                <article className=" text-white">
                    <h2>Users List</h2>
                <ul>
                    {users.map((user, i) => (
                      <p key={i}>User Name : {user?.name } Adresse Email : {user?.email}</p>
                      

                    ))}
                </ul>
                </article>
                </section>
            ) :<section className="container mx-auto px-20">
            <h1 className="text-center text-white text-2xl">You don't have permission to go thers </h1>
            </section>
        }
        
   
            
            </>
            );
        };
export default ListUsers;