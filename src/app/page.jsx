import FoodsPage from "./foods/page";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <FoodsPage></FoodsPage>
    </div>
  );
}
