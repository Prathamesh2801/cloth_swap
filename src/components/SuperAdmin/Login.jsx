import { Eye, EyeClosed } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/SuperAdmin/Auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pwdhidden, sePwdHidden] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "Super_Admin") {
        navigate("/sa/dashboard", { replace: true });
      }
      
      else if (role === "Admin") {
        navigate("/client/dashboard", { replace: true });
      }
      else{
        navigate("/startup", { replace: true });
      }
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
    <div className="min-h-screen flex justify-center items-center bg-[#f6f1e2] text-[#2d1810] px-4">
      <div className="w-full max-w-sm sm:max-w-md px-6 py-6 roboto-regular tracking-wider bg-[#e8dabe] shadow-md rounded-lg overflow-y-auto max-h-[95vh]">
        <form onSubmit={handleSubmit}>
          {/* Logo / Heading */}
          <div className="mb-6 text-center">
            <h2 className="font-bold text-3xl bungee-regular">
              Cloth{" "}
              <span className="bg-[#f84525] text-white px-2 rounded-md">
                Swap
              </span>
            </h2>
          </div>

          {/* Login Title */}
          <div className="py-4 text-center">
            <span className="text-2xl  bebas-neue-regular tracking-wider " style={{ wordSpacing: 5, fontWeight: 600 }}> Admin Login</span>
          </div>

          {/* Username */}
          <div>
            <label
              className="block font-medium text-sm text-gray-700 mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              name="username"
              placeholder="Username"
              className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label
              className="block font-medium text-sm text-gray-700 mb-1"
              htmlFor="password"
            >
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
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => sePwdHidden((prev) => !prev)}
                  className="text-gray-500 focus:outline-none hover:text-gray-600"
                >
                  {pwdhidden ? <Eye /> : <EyeClosed />}
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center mt-6 gap-4">
            <button
              type="reset"
              className="px-4 py-2 bg-[#2d1810] rounded-md font-semibold text-xs text-white uppercase tracking-widest"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#f84525] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}
