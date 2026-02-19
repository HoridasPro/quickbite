import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"
import { FiInfo } from "react-icons/fi";
export default function ProfileSection() {
    return (
        <div className=" bg-white  pt-12 pb-20 ">

            <div className="max-w-[650px] mx-auto px-6">
                <div className="flex py-5 items-center gap-3">
                    <h1 className="text-[28px] font-semibold text-gray-900">
                        My profile
                    </h1>

                    <FiInfo className="text-gray-400 text-lg" />
                </div>
                <div className="space-y-6">

                    {/* First Name */}
                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                            First name
                        </label>
                        <input
                            type="text"
                            defaultValue="The"
                            className="w-full h-[56px] border border-gray-300 rounded-xl px-4 text-gray-900 focus:outline-none focus:border-pink-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                            Last name
                        </label>
                        <input
                            type="text"
                            defaultValue="Line"
                            className="w-full h-[56px] font-thin border border-gray-300 rounded-xl px-4 text-gray-900 focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    {/* Mobile */}
                    <div className="">
                        <label className="">

                            <input
                                type="text"
                                defaultValue="Mobile Number"
                                className="w-full h-[56px] border border-gray-300 rounded-xl px-4 text-gray-400 focus:outline-none focus:border-orange-500"
                            />
                        </label>
                    </div>

                    {/* Save Button */}
                    <button className="bg-gray-200 text-gray-400 px-6 py-2 rounded-md text-sm font-medium cursor-not-allowed">
                        Save
                    </button>

                </div>


                {/* Divider */}
                <div className="border-t my-12"></div>

                {/* Email */}
                <h2 className="text-[22px] font-semibold text-gray-900 mb-5">
                    Email
                </h2>

                <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                        Email
                    </label>
                    <input
                        type="text"
                        defaultValue="example@gmail.com"
                        className="w-full h-[56px] border  border-gray-300 rounded-xl px-4 text-gray-400 focus:outline-none focus:border-orange-500"
                    />
                </div>

                <div className="mt-3">
                    <span className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full font-medium">
                        Verified
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t my-12"></div>

                {/* Password */}
                <h2 className="text-[22px] font-semibold text-gray-900 mb-5">
                    Password
                </h2>

                <div className="space-y-5">
                    <input
                        type="password"
                        placeholder="Current password"
                        className="w-full h-[52px] border text-gray-500 border-gray-300 rounded-lg px-4"
                    />

                    <input
                        type="password"
                        placeholder="New password"
                        className="w-full h-[52px] border text-gray-500 border-gray-300 rounded-lg px-4"
                    />

                    <button className="bg-gray-200 text-gray-500 px-6 py-2 rounded-md text-sm font-medium">
                        Save
                    </button>
                </div>

                {/* Divider */}
                <div className="border-t my-12"></div>

                {/* Payments */}
                <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
                    My payments
                </h2>

                <p className="text-gray-500 text-[15px]">
                    You have no saved payment options yet.
                </p>

                {/* Divider */}
                <div className="border-t my-12"></div>

                {/* Connected Accounts */}
                <h2 className="text-[22px] font-semibold text-gray-900 mb-6">
                    Connected accounts
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">

                    {/* Facebook */}
                    <div className="bg-white rounded-xl p-5 flex justify-between items-center 
  shadow-[0px_6px_18px_rgba(0,0,0,0.08)]">

                        <div className="flex items-center gap-3">
                            <FaFacebookF className="text-blue-600 text-lg" />
                            <span className="font-medium text-gray-800">Facebook</span>
                        </div>

                        <button className="text-black font-semibold text-sm">
                            Connect
                        </button>

                    </div>

                    {/* Google */}
                    <div className="bg-white rounded-xl p-5 flex justify-between items-center 
  shadow-[0px_6px_18px_rgba(0,0,0,0.08)]">

                        <div className="flex items-center gap-3">
                            <FcGoogle className="text-lg" />
                            <span className="font-medium text-gray-800">Google</span>
                        </div>

                        <span className="text-gray-900 font-semibold text-sm">
                            Connected
                        </span>

                    </div>

                    {/* Apple */}
                    <div className="bg-white rounded-xl p-5 flex justify-between items-center 
  shadow-[0px_6px_18px_rgba(0,0,0,0.08)]">

                        <div className="flex items-center gap-3">
                            <FaApple className="text-black text-lg" />
                            <span className="font-medium text-gray-800">Apple</span>
                        </div>

                        <button className="text-black font-semibold text-sm">
                            Connect
                        </button>

                    </div>

                </div>


                {/* Divider */}
                <div className="border-t my-14"></div>


                {/* Account Management */}
                <div>
                    <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
                        Account Management
                    </h2>

                    <p className="text-gray-600 max-w-md mb-5">
                        You can delete your account and personal data associated with it
                    </p>

                    <button className="
    border border-gray-500 
    text-gray-800
    rounded-lg 
    p-2 
    text-sm 
    font-medium 
    bg-white
    hover:bg-gray-50
    transition
  ">
                        Delete my account
                    </button>
                </div>
            </div>


        </div>
    );
}
