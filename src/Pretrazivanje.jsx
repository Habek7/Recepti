import { createSignal, Show, For } from "solid-js";
import { useAuth } from "./AuthProvider";
import { supabase } from "./supabase";

export default function Pretrazivanje() {
    const session = useAuth();
    const [query, setQuery] = createSignal("");
    const [results, setResults] = createSignal([]);
    const [loading, setLoading] = createSignal(false);

    // Funkcija za pretragu recepata
    async function searchRecipes(event) {
        event.preventDefault();
        setLoading(true);

        const { data, error } = await supabase
            .from("recepti")
            .select("*")
            .ilike("naziv", `%${query()}%`);  // Traži po nazivu recepta (koristi % za wildcard)

        if (error) {
            console.error("Error during search:", error);
            alert("Pretraga nije uspjela.");
        } else {
            setResults(data);
        }

        setLoading(false);
    }

    return (
        <>
            <div class="min-h-screen flex items-center justify-center bg-orange-100">
                <div class="p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
                    <h2 class="text-3xl font-semibold text-center text-orange-700 mb-6">Pretraži recepte</h2>

                    {/* Forma za pretragu recepata */}
                    <form onSubmit={searchRecipes}>
                        <div class="flex flex-col mb-4">
                            <label class="text-lg text-gray-700">Unesite naziv recepta:</label>
                            <input
                                type="text"
                                value={query()}
                                onInput={(e) => setQuery(e.target.value)}
                                class="border-2 border-gray-300 bg-gray-100 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Npr. Pita, Palačinke..."
                            />
                        </div>
                        <div class="flex justify-center mb-4">
                            <input
                                type="submit"
                                value="Pretraži"
                                class="bg-orange-500 text-white p-3 rounded-lg w-full hover:bg-orange-600 transition duration-300"
                            />
                        </div>
                    </form>

                    {/* Prikazivanje rezultata pretrage */}
                    <Show when={loading()}>
                        <div class="text-center text-gray-700 p-3">Pretraga u tijeku...</div>
                    </Show>

                    <Show when={!loading() && results().length > 0}>
                        <div class="space-y-4">
                            <For each={results()}>
                                {(recipe) => (
                                    <div class="bg-white p-4 rounded-lg shadow-md">
                                        <h3 class="text-xl font-semibold text-orange-700">{recipe.naziv}</h3>
                                        <p class="text-gray-600">{recipe.opis}</p>
                                        <p class="text-gray-500 text-sm mt-2">Autor: {recipe.author_id}</p>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>

                    <Show when={!loading() && results().length === 0}>
                        <div class="text-center text-gray-700 p-3">Nema rezultata za vašu pretragu.</div>
                    </Show>
                </div>
            </div>
        </>
    );
}
