import Link from "next/link";
import Navbar from "../components/Navbar"; // adjust path as per your folder structure

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex bg-white min-h-screen flex-col items-center justify-center py-2">
        <h1 className="text-5xl text-black font-bold">Landing Page</h1>
        <Link href={"/analysis"} className="mt-5 text-blue-500 underline">
          Go to Analysis Page
        </Link>
      </div>
    </>
  );
}
