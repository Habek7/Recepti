import { createSignal, Show, For } from "solid-js";
import { useAuth } from "./AuthProvider";
import { supabase } from "./supabase";

export default function Pretrazivanje() {
    const session = useAuth();
    const [query, setQuery] = createSignal("");
    const [searchBy, setSearchBy] = createSignal("naziv");
    const [results, setResults] = createSignal([]);
    const [loading, setLoading] = createSignal(false);

    async function searchRecipes(event) {
        event.preventDefault();
        setLoading(true);

        const column = searchBy();
        const { data, error } = await supabase
            .from("recepti")
            .select("*")
            .ilike(column, `%${query()}%`);

        if (error) {
            alert("Pretraga nije uspjela.");
            console.error("Greška pri pretrazi:", error);
        } else {
            setResults(data);
        }

        setLoading(false);
    }

    async function addToFavorites(recipe) {
        if (!session()) {
            alert("Morate biti prijavljeni da biste dodali u omiljene.");
            return;
        }

        const { error } = await supabase.from("omiljeni_recepti").insert({
            user_id: session().user.id, 
            recept_id: recipe.id,
            naziv_recepta: recipe.naziv, 
        });

        if (error) {
            console.error("Greška pri dodavanju u omiljene:", error);
            alert("Dodavanje u omiljene nije uspjelo.");
        } else {
            alert("Recept dodan u omiljene!");
        }
    }

    return (
        <div class="min-h-screen flex items-center justify-center bg-orange-100">
            <div class="p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
                <h2 class="text-3xl font-semibold text-center text-orange-700 mb-6">
                    Pretraži recepte
                </h2>

                <form onSubmit={searchRecipes}>
                    <div class="flex flex-col mb-4">
                        <label class="text-lg text-gray-700">Unesite pojam za pretragu:</label>
                        <input
                            type="text"
                            value={query()}
                            onInput={(e) => setQuery(e.target.value)}
                            class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Npr. Pita, Palačinke, Jaje..."
                        />
                    </div>
                    <div class="flex flex-col mb-4">
                        <label class="text-lg text-gray-700">Pretraži po:</label>
                        <select
                            value={searchBy()}
                            onInput={(e) => setSearchBy(e.target.value)}
                            class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="naziv">Naziv recepta</option>
                            <option value="sastojci">Sastojci</option>
                        </select>
                    </div>
                    <div class="flex justify-center mb-4">
                        <input
                            type="submit"
                            value="Pretraži"
                            class="bg-orange-500 text-white p-3 rounded-lg w-full 
                                   hover:bg-orange-600 transition duration-300"
                        />
                    </div>
                    <a href="/Home">
                        <button class="bg-red-600 text-white p-3 rounded-lg w-full 
                                       hover:bg-red-700 transition duration-300">
                            Vrati se na početnu
                        </button>
                    </a>
                </form>

                <Show when={loading()}>
                    <div class="text-center text-gray-700 p-3">Pretraga u tijeku...</div>
                </Show>

                <Show when={!loading() && results().length > 0}>
                    <div class="space-y-4">
                        <For each={results()}>
                            {(recipe) => (
                                <div class="bg-white p-4 mt-5 rounded-lg shadow-md">
                                    <h3 class="text-xl font-semibold text-orange-700">{recipe.naziv}</h3>
                                    <p class="text-gray-600">{recipe.opis}</p>
                                    <p class="text-gray-500 text-sm mt-2">
                                        Sastojci: {recipe.sastojci}
                                    </p>
                                    <p class="text-gray-500 text-sm mt-2">
                                        Autor: {recipe.ime_i_prezime}
                                    </p>
                                    <button
                                        class="mt-3 bg-blue-500 text-white p-2 rounded-lg 
                                               hover:bg-blue-600 transition duration-300"
                                        onClick={() => addToFavorites(recipe)}
                                    >
                                        Dodaj u omiljene
                                    </button>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>

                <Show when={!loading() && results().length === 0}>
                    <div class="text-center text-gray-700 p-3">
                        Nema rezultata za vašu pretragu.
                    </div>
                </Show>
            </div>
        </div>
    );
}
