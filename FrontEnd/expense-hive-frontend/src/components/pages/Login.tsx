import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../images/ExpenseHiveLogo.png';
function Login(){

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navagate = useNavigate();

    const submitLogin = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/authentification/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
          });
          const data = await response.json();
          if(data.success){
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', email);
            localStorage.setItem('account', data.account);
            navagate('/dashboard');
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Error', error);
        }
    }

    return (
        <>
          <div className="h-screen flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-bright-yellow">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                alt="Your Company"
                src={logo}
                className="mx-auto h-auto w-1/2"
              />
              <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-dark-brown">
                Sign in to your account
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-dark-brown block text-lg font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder='example@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="indent-2 block w-full rounded-md border-0 py-1.5 text-dark-brown shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-dark-brown block text-lg font-medium leading-6 text-gray-900 mt-2">
                      Password
                    </label>
                    <div className="text-sm mt-4">
                      <a href="" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2 mb-4">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="indent-2 block w-full rounded-md border-0 py-1.5 text-dark-brown shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    onClick={submitLogin}
                    className="text-bright-yellow bg-orange-brown flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
    
              <p className="text-dark-brown mt-10 text-center text-sm text-gray-500">
                Not a member?{' '}
                <a href="/Register" className="text-dark-brown font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Create an Account
                </a>
              </p>
            </div>
          </div>
        </>
    );
}

export default Login;