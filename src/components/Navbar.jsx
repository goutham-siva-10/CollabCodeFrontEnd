import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/" className="font-bold text-lg">Collab Editor</Link>
      <div className="space-x-4">
        <Link to="/documents" className="hover:underline">Documents</Link>
      </div>
    </nav>
  );
}
