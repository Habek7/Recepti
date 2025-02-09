import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { supabase } from "./supabase";

export default function Register() {
    const navigate = useNavigate();
    const [result, setResult] = createSignal(null);
    const [darkMode, setDarkMode] = createSignal(false);

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const result = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (result.error?.code === "invalid_credentials") {
            setResult("Pogrešna e-mail adresa i/ili zaporka.");
        } else if (result.error) {
            setResult("Dogodila se greška prilikom registracije.");
        } else {
            setResult("Registracija je uspjela.");
            navigate("/Login", { replace: true });
        }
    }

    return (
        <div class={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode() ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div class={`max-w-lg w-full p-10 rounded-xl shadow-2xl transition-all ${darkMode() ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <button 
                    class="absolute top-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition" 
                    onClick={() => setDarkMode(!darkMode())}>
                    {darkMode() ? '☀️' : '🌙'}
                </button>
                <h2 class="text-4xl font-bold text-center mb-8">Registracija</h2>
                {result() && <p class="text-center text-red-500 mb-4">{result()}</p>}
                <form onSubmit={formSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        class={`w-full p-4 mb-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode() ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
                    />
                    <input
                        type="password"
                        placeholder="Lozinka"
                        name="password"
                        class={`w-full p-4 mb-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode() ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
                    />
                    <p class="text-md text-center mb-5">
                        Odmah prijeđite na prijavu. <A href="/Login" class="text-blue-600 hover:underline"><br/>Prijavite se.</A>
                    </p>
                    <button 
                        type="submit"
                        class="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition">
                        Registriraj se
                    </button>
                </form>
            </div>
        </div>
    );
}