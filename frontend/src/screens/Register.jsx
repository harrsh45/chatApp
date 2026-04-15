import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Register = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()


    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/register', {
            email,
            password
        }).then((res) => {
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/login')
        }).catch((err) => {
            console.log("error in register", err.response.data)
        })
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#dff2ff] px-4">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(56,189,248,0.16),transparent_65%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_10%_10%,rgba(125,211,252,0.12),transparent_65%)]" />
            </div>

            <div className="relative w-full max-w-md rounded-3xl border border-sky-200/70 bg-white/70 backdrop-blur p-6 shadow-2xl shadow-slate-900/10">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
                    <p className="mt-1 text-sm text-slate-600">Join the workspace and start collaborating.</p>
                </div>
                <form
                    onSubmit={submitHandler}
                >
                    <div className="mb-4">
                        <label className="block text-slate-700 mb-2 text-sm font-medium" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full rounded-xl border border-sky-200/70 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-400/40"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-700 mb-2 text-sm font-medium" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full rounded-xl border border-sky-200/70 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-400/40"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-500 transition focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-sky-700 hover:text-sky-800 underline-offset-4 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register