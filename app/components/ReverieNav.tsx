import { User } from "~/data";
import { Link } from "@remix-run/react";

interface ReverieNavProps {
    user: User
}

export default function ReverieNav({ user }: ReverieNavProps){
    return(
        <header style={{backgroundColor: 'yellow', display:'flex',justifyContent:'space-between'}}>
            <h1>
              <Link to="/home">
                Navigation Bar
              </Link>
            </h1>
            <Link 
              to="/profile"
              style={{float:'right'}}
              >
              {user.username}
            </Link>
        </header>
    )
}