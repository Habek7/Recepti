import { createSignal, createEffect, Show, For } from "solid-js";
import { useAuth } from "./AuthProvider";
import { supabase } from "./supabase";

export default function OmiljeniRecepti() {
    const session = useAuth();
    const [favorites, setFavorites] = createSignal([]);
    const [loading, setLoading] = createSignal(true);

    async function fetchFavorites() {
        if (!session()) return;

        setLoading(true);
        
        const { data, error } = await supabase
            .from("omiljeni_recepti")
            .select("id, recepti (id, naziv, opis, sastojci, ime_i_prezime)")
            .eq("user_id", session().user.id);

        if (error) {
            console.error("Greška pri dohvaćanju omiljenih recepata:", error);
            alert("Neuspjelo učitavanje omiljenih recepata.");
        } else {
            setFavorites(data.map(item => ({
                omiljeniId: item.id, 
                ...item.recepti      
            })));
        }

        setLoading(false);
    }

    createEffect(fetchFavorites);

    async function removeFromFavorites(omiljeniId) {
        const { error } = await supabase
            .from("omiljeni_recepti")
            .delete()
            .eq("id", omiljeniId);

        if (error) {
            console.error("Greška pri brisanju omiljenog recepta:", error);
            alert("Neuspjelo brisanje recepta.");
        } else {
            setFavorites(favorites().filter(recipe => recipe.omiljeniId !== omiljeniId));
            alert("Recept uklonjen iz omiljenih.");
        }
    }

    return (
        <>
            <div class="min-h-screen flex items-center justify-center bg-orange-100">
                <div class="p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
                    <h2 class="text-3xl font-semibold text-center text-orange-700 mb-6">
                        Omiljeni recepti
                    </h2>

                    <Show when={loading()}>
                        <div class="text-center text-gray-700 p-3">Učitavanje...</div>
                    </Show>

                    <Show when={!loading() && favorites().length > 0}>
                        <div class="space-y-4">
                            <For each={favorites()}>
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
                                            class="mt-3 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 w-full"
                                            onClick={() => removeFromFavorites(recipe.omiljeniId)}
                                        >
                                            Ukloni iz omiljenih
                                        </button>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>

                    <Show when={!loading() && favorites().length === 0}>
                        <div class="text-center text-gray-700 p-3">
                            Nemate dodanih omiljenih recepata.
                        </div>
                    </Show>

                    <a href="/Home">
                        <button class="bg-red-600 text-white p-3 rounded-lg w-full hover:bg-red-700 transition duration-300 mt-4">
                            Vrati se na početnu
                        </button>
                    </a>
                </div>
            </div>
        </>
    );
}
