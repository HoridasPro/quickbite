import { FaTicketAlt } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
export default function VouchersPage() {
  const vouchers = [
    {
      title: "50% off for your first order",
      subtitle: "50%",
      code: "yumpanda",
      min: "Min. order Tk 199",
      expiry: "Use by Dec 31, 2026",
    },
    {
      title: "BANKASIA150 : Bank Asia Credit Card",
      subtitle: "25%",
      code: "bankasia150",
      min: "Min. order Tk 599",
      expiry: "Use by Mar 20, 2026",
    },
    {
      title: "UCB150 : Applicable for all UCB",
      subtitle: "20%",
      code: "ucb150",
      min: "Min. order Tk 499",
      expiry: "Expiring in 13 hours",
    },
    {
  title: "DBBL120 : Dutch Bangla Debit Card",
  subtitle: "15%",
  code: "dbbl120",
  min: "Min. order Tk 399",
  expiry: "Use by Apr 15, 2026",
},
{
  title: "BRAC200 : BRAC Bank Special Offer",
  subtitle: "30%",
  code: "brac200",
  min: "Min. order Tk 699",
  expiry: "Use by May 10, 2026",
},
{
  title: "CITY100 : City Bank Exclusive",
  subtitle: "18%",
  code: "city100",
  min: "Min. order Tk 499",
  expiry: "Expiring in 2 days",
}

  ];

  return (
    <div className="bg-[#ffffff] px-8 min-h-screen">
      {/* Header */}
<div className="max-w-6xl mx-auto pt-10 pb-6 px-4">

  {/* TOP ROW */}
  <div className="flex items-center justify-between mb-6">

    <h1 className="text-2xl font-extrabold text-gray-800">
      Vouchers & offers
    </h1>

    {/* ADD VOUCHER BUTTON */}
    <button className="
      flex items-center gap-2 border px-4 py-2 rounded text-gray-800 font-medium transition shadow-[0_1px_2px_rgba(0,0,0,0.05)]
    ">
      <FaTicketAlt className="text-gray-600 text-sm" />
      Add a Voucher
    </button>

  </div>

  {/* Tabs */}
  <div className="flex gap-8 border-b">
    <button className="pb-3 border-b-2 border-black text-black font-semibold">
      All
    </button>
    <button className="pb-3 text-gray-500">Restaurants</button>
    <button className="pb-3 text-gray-500">Shops</button>
  </div>

</div>

      {/* Main */}
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 px-4">

        {/* LEFT SIDE */}
        <div className="col-span-4 space-y-4">

          {/* Filter */}
          <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black bg-white">
            <option>Default</option>
            <option>Latest</option>
            <option>Expiring First</option>
            <option>Lowest minimum order value</option>
          </select>

         
          {/* Voucher List */}
          {vouchers.map((v, i) => (
            <div
              key={i}
              className="relative bg-white border border-gray-200 rounded-xl shadow-sm px-2 py-2 overflow-hidden"
            >

              {/* LEFT TICKET CUT */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-100 rounded-full border border-gray-200"></div>

              {/* RIGHT TICKET CUT */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-100 rounded-full border border-gray-200"></div>

              <div className="flex gap-2">

                {/* ICON */}
                <div className="h-[32px]">
                  <FaTicketAlt className="text-orange-500 text-lg" />
                </div>


                {/* CONTENT */}
                <div className="flex-1">

                  {/* TITLE */}
                  <h3 className="text-[15px] font-semibold text-gray-800 leading-5">
                    {v.title}
                  </h3>

                  {/* SUB */}
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className="font-semibold text-gray-800">
                      {v.subtitle}
                    </span>

                    <span className="text-gray-400 text-xs">ⓘ</span>

                    <span className="text-gray-500 text-sm">
                      {v.code}
                    </span>

                    {v.left && (
                      <span className="text-[11px] bg-blue-100 text-blue-600 px-2 py-[2px] rounded-md">
                        {v.left} left
                      </span>
                    )}
                  </div>

                  {/* DASH LINE */}
                  <div className="border-t border-dashed border-gray-200 my-3"></div>

                  {/* BOTTOM */}
                  <div className=" flex items-center justify-between">

                    <div className="text-[12px] bg-gray-100 border border-gray-200 rounded-full px-3 py-[4px] text-gray-500">
                      {v.min} •{" "}
                      <span className={v.expiring ? "text-red-500 font-medium" : ""}>
                        {v.expiry}
                      </span>
                    </div>

                    <button className="text-orange-500 font-medium text-sm hover:underline">
                      Use now
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))}


        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-8 space-y-10">

          {/* Restaurant Deals */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-5 text-lg">
              Discover more restaurant deals
            </h2>

            <div className="grid grid-cols-3 gap-5">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl h-[160px] bg-gray-100"
                >
                  <img
                    src="https://i.ibb.co.com/XZJRFdHc/Pizza.jpg"
                    alt="deal"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

            </div>

          </div>

          {/* Shopping Deals */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-5 text-lg">
              Discover more shopping deals
            </h2>

            <div className="overflow-hidden rounded-2xl w-[400px] h-[180px]">
              <img
                src="https://i.ibb.co.com/QjFQCcHt/Download-Delicious-Burger-Poster-Template-for-Restaurants-and-Promotions-for-free.jpg"
                alt="deal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
