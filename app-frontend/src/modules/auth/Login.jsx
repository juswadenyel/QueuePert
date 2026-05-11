import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles.css";// make sure path is correct
import Admin from "./Admin";


function Login() {
    const navigate = useNavigate();
    const [showForgot, setShowForgot] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const response = await fetch(
    "http://localhost:8080/student/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            universityEmail: email,
            password: password
        })
    }
);

        const data = await response.json(); // ✅ correct

        if (!response.ok) {
            alert("Login failed");
            return;
        }

        localStorage.setItem(
            "student",
            JSON.stringify(data)
        );

        navigate("/student/dashboard");

        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

    return (
        <div className="login-page">

            {/* NAVBAR */}
            <div className="navbar">
        <div className="logo">Queuepert</div>

    <div className="nav-buttons">
        <button onClick={() => navigate("/admin/login")}>Admin</button>
    </div>

            </div>

            {/* LOGIN BOX */}
            <div className="containerLogin">
                <h1>QueuePert</h1>
                <p className="description">
                    Please login using your university account
                </p>

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <label className="input-label">University E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* PASSWORD */}
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* FORGOT PASSWORD */}
                    <div className="forgot-container">
                        <a href="#" onClick={(e) => {
                        e.preventDefault();           // prevents page reload
                        setShowForgot(!showForgot);   // toggle show/hide
                    }}>
                    Forgot password?
                    </a>
                    </div>

                    {showForgot && (
                        <div className="forgot-overlay">
                        <div className="forgot-content">
                        <p>Please contact the Technical Support Group (TSG) via Teams or proceed to their office
                             (3rd Floor, NGE Building) to reset your password.</p>
            
                    <button 
                        type="button" 
                            onClick={() => setShowForgot(false)}
                                className="action-btn"
                    >
                        Close
                    </button>
                    </div>
                    </div>
                )}

                    {/* LOGIN BUTTON */}
                    <button type="submit" className="action-btn">
                        Login
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Login;