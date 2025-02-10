import { createSignal } from "solid-js";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "@solidjs/router"; 
import SignOut from "./SignOut";

export default function Home(props) {
    const session = useAuth(); 
    const [showSignOut, setShowSignOut] = createSignal(false); 
    const navigate = useNavigate(); 

    const handleSignOutClick = () => {
        setShowSignOut(true);
    };

    const redirectToHome = () => {
        navigate("/Login"); 
    };

    return (
        <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
            <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-6">🍽️ Pronađi Svoj Savršeni Recept</h1>
                {session() ? (
                    <div>
                        <p class="text-lg text-gray-700 mb-6">Dobrodošli, <span class="font-bold">{session().user.email}</span>!</p>
                        <div class="grid grid-cols-2 gap-4">
                            <a href="/Pretrazivanje">
                                <button className="bg-blue-500 text-white py-3 rounded-lg w-full hover:bg-blue-600 transition duration-300">
                                    🔍 Pretraži Recepte
                                </button>
                            </a>
                            <a href="/Recepti">
                                <button className="bg-yellow-500 text-white py-3 rounded-lg w-full hover:bg-yellow-600 transition duration-300">
                                    🍲  Dodaj recept
                                </button>
                            </a>
                        </div>
                        <button
                            onClick={handleSignOutClick}
                            class="bg-red-500 text-white py-3 rounded-lg w-full hover:bg-red-600 transition duration-300 mt-6">
                            🚪 Odjavi se
                        </button>
                        {showSignOut() && <SignOut />}
                    </div>
                ) : (
                    <div>
                        <p class="text-gray-500 mb-4">Uspješno ste se odjavili!</p>
                        <button
                            onClick={redirectToHome}
                            class="bg-green-500 text-white py-3 rounded-lg w-full hover:bg-green-600 transition duration-300">
                            🔄 Povratak na Registraciju
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}