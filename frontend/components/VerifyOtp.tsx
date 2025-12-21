"use client";
import { ArrowRight, Loader2, LockIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const VerifyOtp = () => {
  const [loading, setLoadin] = useState(false);

  const searchParams = useSearchParams();

  const email: string = searchParams.get("email") || "";

  const handleSubmit = () => {};
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <div>
              <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <LockIcon size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Verify your email
              </h1>
              <p className="text-gray-300 text-lg">
                {" "}
                We have sent 6 digit code to
              </p>
              <p className="text-blue-400 font-medium"> </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  className=" w-full px-4 py-4 bg-gray-700 border-gray-600 rounded-lg text-white placeholder-gray-400"
                  type="email"
                  id="email"
                  //   value={email}
                  //   onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      {" "}
                      <span> Verifying...</span>
                      <Loader2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span> Verify</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
