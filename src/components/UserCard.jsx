"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const UserCard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center mt-4">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="text-center mt-4">
        <p className="text-red-500 font-semibold">Not Logged In</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-6 p-6 border rounded-xl shadow-md bg-white text-center space-y-4">
      <h2 className="text-xl font-bold">User Profile</h2>

      {session.user?.image && (
        <Image
          src={session.user.image}
          alt="User Image"
          width={80}
          height={80}
          className="rounded-full mx-auto"
        />
      )}

      <div>
        <p className="font-semibold">{session.user?.name}</p>
        <p className="text-gray-500 text-sm">{session.user?.email}</p>
      </div>

      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserCard;