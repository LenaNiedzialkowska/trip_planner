import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    userId: string;
    token: string;
    username: string;
    email: string;
}

interface Props{
    setUserID: React.Dispatch<React.SetStateAction<string | null>>
}

const Login = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:5000/api/auth/login`,

                { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }

            );
            const jsonData: User = await response.json();

            console.log(jsonData);
            if (response.ok) {
                // localStorage.setItem('token', jsonData.token);
                localStorage.setItem('userID', jsonData.token);
                // setUserID(jsonData.userId.toString());
                navigate(`/${jsonData.userId.toString()}`);
            }else{
                console.error('Nieprawidłowy email lub hasło');
                alert('Nieprawidłowy email lub hasło');
            }

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Logowanie</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Nazwa użytkownika</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Twoja nazwa użytkownika"
                        />
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Twój email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hasło</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Twoje hasło"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                        Zaloguj się
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Nie masz jeszcze konta? <a href="/register" className="text-blue-500 hover:underline">Zarejestruj się</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
