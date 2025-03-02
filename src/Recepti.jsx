import { createSignal, Show } from "solid-js";
import { useAuth } from "./AuthProvider";
import { supabase } from "./supabase";

export default function Recepti() {
    const session = useAuth();
    console.log(session());

    const [success, setSuccess] = createSignal(false);

    async function formSubmit(event) {
        setSuccess(false);

        event.preventDefault();
        const formData = new FormData(event.target);

        const name = formData.get("naziv");
        const description = formData.get("opis");
        const author_id = session().user.id;
        const sastojci = formData.get("sastojci");
        const ime_i_prezime = formData.get("ime i prezime");
        const kategorija = formData.get("kategorija"); 

        const { error } = await supabase
            .from("recepti")
            .insert({
                naziv: name,
                opis: description,
                author_id: author_id,
                sastojci: sastojci,
                ime_i_prezime: ime_i_prezime,
                kategorija: kategorija, 
            });

        if (error) {
            console.error("Error during insert:", error);
            alert("Spremanje nije uspjelo.");
        } else {
            setSuccess(true);
            event.target.reset();
        }
    }

    return (
        <>
            <div class="min-h-screen flex items-center justify-center bg-orange-100">
                <div class="p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
                    <h2 class="text-3xl font-semibold text-center text-orange-700 mb-6">Dodaj novi recept</h2>
                    <form onSubmit={formSubmit}>
                        <div class="flex flex-col mb-4">
                            <label class="text-lg text-gray-700">Naziv recepta:</label>
                            <input
                                name="naziv"
                                type="text"
                                autocomplete="false"
                                required
                                class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div class="flex flex-col mb-6">
                            <label class="text-lg text-gray-700">Sastojci:</label>
                            <textarea
                                name="sastojci"
                                required
                                rows="3"
                                class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            ></textarea>
                        </div>
                        <div class="flex flex-col mb-6">
                            <label class="text-lg text-gray-700">Upute za pripremu:</label>
                            <textarea
                                name="opis"
                                required
                                rows="4"
                                class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            ></textarea>
                        </div>
                        <div class="flex flex-col mb-6">
                            <label class="text-lg text-gray-700">Ime i prezime:</label>
                            <input
                                name="ime i prezime"
                                required
                                class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div class="flex flex-col mb-6">
                            <label class="text-lg text-gray-700">Kategorija:</label>
                            <select
                                name="kategorija"
                                required
                                class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="Doručak">Doručak</option>
                                <option value="Ručak">Ručak</option>
                                <option value="Večera">Večera</option>
                            </select>
                        </div>

                        <div class="flex justify-center mb-4">
                            <input
                                type="submit"
                                value="Dodaj recept"
                                class="bg-orange-500 text-white p-3 rounded-lg w-full hover:bg-orange-600 transition duration-300"
                            />
                        </div>
                        <a href="/Home">
                            <button class="bg-red-600 text-white p-3 rounded-lg w-full hover:bg-red-700 transition duration-300">
                                Vrati se na početnu
                            </button>
                        </a>
                    </form>
                    <Show when={success()}>
                        <div class="bg-green-400 text-white p-2 rounded my-5">
                            Recept uspješno dodan!
                        </div>
                    </Show>
                </div>
            </div>
        </>
    );
}
