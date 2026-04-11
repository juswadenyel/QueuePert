import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles.css";// make sure path is correct

function Admin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Email:", email);
        console.log("Password:", password);

        // redirect to dashboard
        //navigate("/dashboard");
    };

    return (
        <div className="login-page">

            {/* NAVBAR */}
            <div className="navbar">
                <div className="logo">Queuepert</div>

                <div className="nav-buttons">
                    <button onClick={() => navigate("/login")}>Back</button>
                </div>
            </div>

            {/* LOGIN BOX */}
            <div className="containerLogin">
                <h1>QueuePert</h1>
                <p className="description">
                    Administrator Login
                </p>

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <label className="input-label">Admin Account</label>
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
                        <a href="#">Forgot password?</a>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button type="submit" className="action-btn">
                        Login
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Admin;