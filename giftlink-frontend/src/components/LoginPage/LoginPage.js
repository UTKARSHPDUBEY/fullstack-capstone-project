import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {

                sessionStorage.setItem("auth-token", data.authtoken);
                sessionStorage.setItem("email", data.userEmail);
                sessionStorage.setItem("name", data.userName);

                setUserName(data.userName);
                setIsLoggedIn(true);

                navigate("/app");

            } else {

                setError(data.error);

            }

        } catch (e) {

            console.log(e);
            setError("Login failed.");

        }

    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">

                        <h2 className="text-center mb-4 font-weight-bold">
                            Login
                        </h2>

                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && (
                                <small className="text-danger">
                                    {error}
                                </small>
                            )}
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here?{" "}
                            <a href="/app/register" className="text-primary">
                                Register Here
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;