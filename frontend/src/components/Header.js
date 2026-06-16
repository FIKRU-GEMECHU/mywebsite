import { Link } from "react-router-dom";
import profile from "./fikru.jpg";

const ROLES = [
  "SOFTWARE DEVELOPER",
  "NETWORK ADMINISTRATOR",
  "FULL-STACK DEVELOPER",
  "IT OFFICER",
  "ARTIFICIAL INTELLIGENCE",
];

function Header() {
  return (
    <header className="hero">
      <div className="hero-left">
        <p className="greeting">
          HELLO, HOW ARE YOU! I AM PROGRAMMER 
        </p>

        <h1>I'M..</h1>
       <h2 className="name-title">FIKRU GEMECHU</h2>


        {/* Roles List */}
        <ul className="role-list">
          {ROLES.map((role, index) => (
            <li key={index} className="role-item">
              {role}
            </li>
          ))}
        </ul>

        <p>
          Passionate about Networking, IT Support, Artificial Intelligence,
          and Software Development — building real solutions for real problems
          in Ethiopia and beyond.
        </p>

        <div className="hero-buttons">
          <Link to="/contact" className="btn btn-primary">
            Hire Me
          </Link>
          <Link to="/projects" className="btn btn-outline">
            My Work
          </Link>
        </div>
      </div>

      <div className="hero-right">
        <img src={profile} alt="Fikru Gemechu" />
      </div>
    </header>
  );
}

export default Header;