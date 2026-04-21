import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfileMenu({ showHistory}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null); // 👈 reference to the menu
  const navigate = useNavigate();

  // 👇 Detect clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-menu" ref={menuRef}>
      <button onClick={() => setOpen(!open)}>
        Profile ▾
      </button>

      {open && (
  <div className="dropdown">

    {showHistory && (
      <button
        onClick={() => {
          navigate("/student/history");
          setOpen(false);
        }}
      >
        Transaction History
      </button>
    )}

    <button
      onClick={() => {
        navigate("/student/login");
        setOpen(false);
      }}
    >
      Logout
    </button>

  </div>
)}
    </div>
  );
}

export default ProfileMenu;