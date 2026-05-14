import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles.css";

function Admin() {
    const navigate = useNavigate();
    const [showForgot, setShowForgot] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    universityEmail: email,
                    password: password
                })
            });

            // Backend now returns JSON, not plain text
            const data = await response.json();

            if (data.success === true) {
                // Save admin info so dashboard knows who is logged in
                localStorage.setItem("admin", JSON.stringify(data));
                navigate("/admin/dashboard");
            } else {
                alert(data.message);
            }

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
                    <button onClick={() => navigate("/student/login")}>Back</button>
                </div>
            </div>

            {/* LOGIN BOX */}
            <div className="containerLogin">
                <h1>QueuePert</h1>
                <p className="description">Administrator Login</p>

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <label className="input-label" htmlFor="adminEmail">
                        Admin Account
                    </label>
                    <input
                        id="adminEmail"
                        name="adminEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* PASSWORD */}
                    <label className="input-label" htmlFor="adminPassword">
                        Password
                    </label>
                    <input
                        id="adminPassword"
                        name="adminPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* FORGOT PASSWORD */}
                    <div className="forgot-container">
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowForgot(!showForgot);
                        }}>
                            Forgot password?
                        </a>
                    </div>

                    {showForgot && (
                        <div className="forgot-overlay">
                            <div className="forgot-content">
                                <p>Please contact the Technical Support Group (TSG) via Teams
                                    or proceed to their office (3rd Floor, NGE Building) to
                                    reset your password.</p>
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

export default Admin;