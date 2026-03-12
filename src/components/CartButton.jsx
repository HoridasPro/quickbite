// import { handleCart } from "@/actions/server/cart";
// import { useSession } from "next-auth/react";
// import { usePathname, useRouter } from "next/navigation";
import React from "react";
// import Swal from "sweetalert2";
// import { Link } from "lucide-react";

const CartButton = ({ food }) => {
  // const session = useSession();
  // const path = usePathname();
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  // const isLogin = session?.status == "authenticated";

  const handleAdd2Card = async () => {
    //   setIsLoading(true);
    //   if (isLogin) {
    //     const result = await handleCart({ food, inc: true });
    //     if (result.success) {
    //       Swal.fire("Added to cart", food?.title, "Success");
    //     } else {
    //       Swal.fire("opps", "Something went wrong", "Error");
    //     }
    //     setIsLoading(false);
    //   } else {
    //     router.push(`/login?callbackUrl=${path}`);
    //     setIsLoading(false);
    //   }
  };

  return (
    <div className="p-4 flex items-center gap-4 w-full">
      <button
        onClick={handleAdd2Card}
        className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer disabled:bg-gray-400"
      >
        Add to cart
        {/* {price * quantity} */}
      </button>
    </div>
  );
};

export default CartButton;