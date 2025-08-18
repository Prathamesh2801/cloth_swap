import { Eye, EyeClosed } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/SuperAdmin'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [pwdhidden, sePwdHidden] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/sa/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginPromise = login(username, password);

        toast.promise(
            loginPromise,
            {
                loading: 'Signing in...',
                success: (data) => {
                    if (data.Status === true) {
                        navigate('/sa/dashboard');
                        return "Login Successfully";
                    } else {
                        throw new Error(data.Message || "Invalid username or password");
                    }
                },
                error: (err) => {
                    return err.message || "Login failed. Please try again.";
                }
            }
        );
    };

    return (
        <div className="font-sans text-gray-900 antialiased">
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f6f1e2] text-[#2d1810]">
                <div>
                    <a href="/">
                        <h2 className="font-bold text-3xl bungee-regular ">Cloth <span className="bg-[#f84525] text-white px-2 rounded-md">Swap</span></h2>
                    </a>
                </div>

                <div className="w-full sm:max-w-md  mt-6 px-6 py-4 roboto-regular tracking-wider bg-[#e8dabe] shadow-md overflow-hidden sm:rounded-lg">
                    <form onSubmit={handleSubmit}>

                        <div className="py-8">
                            <center>
                                <span className="text-2xl font-semibold">Log In</span>
                            </center>
                        </div>

                        <div>
                            <label className="block font-medium text-sm text-gray-700 mb-1" htmlFor="username" value="Username" >Username </label>
                            <input onChange={(e) => setUsername(e.target.value)} type='text'
                                name='username'
                                placeholder='Username'
                                className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]" />
                        </div>


                        <div className="mt-4">
                            <label className="block font-medium text-sm text-gray-700 mb-1" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    type={pwdhidden ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                                />

                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <button
                                        type="button"
                                        onClick={() => sePwdHidden(prev => !prev)}
                                        id="togglePassword"
                                        className="text-gray-500 focus:outline-none focus:text-gray-600 hover:text-gray-600"
                                    >
                                        {pwdhidden ? <Eye /> : <EyeClosed />}
                                    </button>
                                </div>
                            </div>
                        </div>




                        <div className="flex items-center justify-center mt-4">
                            <button className='ms-4 inline-flex items-center px-4 py-2 bg-[#2d1810] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest  focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150' >
                                Clear
                            </button>
                            <button className='ms-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150' >
                                Sign In
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
