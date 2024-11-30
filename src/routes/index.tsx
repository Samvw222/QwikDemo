import { component$, useSignal, useStore, useTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from "@builder.io/qwik-city";

// Instant Loading Component
const InstantLoading = component$(() => {
  const count = useSignal(0);

  return (
    <section class="border p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">1. Instant Loading</h2>
      <p class="mb-4 text-gray-500">
        Deze component demonstreert hoe snel Qwik laadt.
        Merk op hoe de pagina direct laadt zonder JavaScript hydration.
      </p>
      
      <div class="bg-gray-100 p-4 rounded">
        <p class="mb-2 text-gray-500">Interactieve teller die JavaScript alleen laadt wanneer nodig:</p>
        <button
          onClick$={() => count.value++}
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Aantal: {count.value}
        </button>
      </div>
      
      <div class="mt-4 text-sm text-gray-500">
        <p> Open je DevTools Network tab en let op:</p>
        <ul class="list-disc ml-6">
          <li>Initiële paginalading heeft minimale JavaScript</li>
          <li>JS voor deze teller laadt alleen bij eerste klik</li>
          <li>Volgende kliks hergebruiken de geladen code</li>
        </ul>
      </div>
    </section>
  );
});

// Code Splitting Component
const CodeSplitting = component$(() => {
  const showDetails = useSignal(false);
  const heavyData = useSignal<string[]>([]);

  useTask$(({ track }) => {
    track(() => showDetails.value);
    if (showDetails.value) {
      heavyData.value = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    }
  });

  return (
    <section class="border p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">2. Automatic Code-Splitting</h2>
      <p class="mb-4 text-gray-500">
        Qwik splitst je code automatisch in kleine stukjes en laadt deze op aanvraag.
        Klik op de knop hieronder om een "zware" component te laden:
      </p>

      <button
        onClick$={() => showDetails.value = !showDetails.value}
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {showDetails.value ? 'Verberg' : 'Toon'} Details
      </button>

      {showDetails.value && (
        <div class="mt-4 h-48 overflow-auto bg-gray-50 p-4 rounded">
          {heavyData.value.map((item) => (
            <div key={item} class="py-1 border-b text-gray-500">
              {item}
            </div>
          ))}
        </div>
      )}

      <div class="mt-4 text-sm text-gray-500">
        <p> Let op in DevTools:</p>
        <ul class="list-disc ml-6">
          <li>De component code laadt alleen na het klikken</li>
          <li>De bundle grootte is minimaal tot nodig</li>
          <li>State management code is gescheiden van UI code</li>
        </ul>
      </div>
    </section>
  );
});

// Resumability Component
const Resumability = component$(() => {
  const state = useStore({
    form: {
      name: '',
      email: '',
      message: '',
      preferences: {
        newsletter: false,
        notifications: false
      }
    },
    submitted: false,
    submissionTime: ''
  });

  const handleSubmit$ = $(() => {
    state.submitted = true;
    state.submissionTime = new Date().toLocaleTimeString();
  });

  return (
    <section class="border p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">3. Resumability</h2>
      <p class="mb-4 text-gray-500">
        Anders dan traditionele frameworks die de hele state moeten herbouwen,
        kan Qwik verdergaan waar het gebleven was. Probeer dit formulier:
      </p>

      <form
        preventdefault:submit
        onSubmit$={handleSubmit$}
        class="space-y-4"
      >
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-500">Naam:</label>
          <input
            type="text"
            value={state.form.name}
            onInput$={(ev: any) => state.form.name = ev.target.value}
            class="w-full p-2 border rounded text-gray-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-500">E-mail:</label>
          <input
            type="email"
            value={state.form.email}
            onInput$={(ev: any) => state.form.email = ev.target.value}
            class="w-full p-2 border rounded text-gray-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-500">Bericht:</label>
          <textarea
            value={state.form.message}
            onInput$={(ev: any) => state.form.message = ev.target.value}
            class="w-full p-2 border rounded text-gray-500"
            rows={3}
          />
        </div>

        <div class="space-y-2">
          <label class="flex items-center">
            <input
              type="checkbox"
              checked={state.form.preferences.newsletter}
              onChange$={(ev: any) => state.form.preferences.newsletter = ev.target.checked}
              class="mr-2"
            />
            <span class="text-sm text-gray-500">Aanmelden voor nieuwsbrief</span>
          </label>
          
          <label class="flex items-center">
            <input
              type="checkbox"
              checked={state.form.preferences.notifications}
              onChange$={(ev: any) => state.form.preferences.notifications = ev.target.checked}
              class="mr-2"
            />
            <span class="text-sm text-gray-500">Meldingen inschakelen</span>
          </label>
        </div>

        <button
          type="submit"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Versturen
        </button>
      </form>

      {state.submitted && (
        <div class="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <p>Formulier verstuurd om {state.submissionTime} met:</p>
          <ul class="list-disc ml-6 mt-2 text-gray-500">
            <li>Naam: {state.form.name}</li>
            <li>E-mail: {state.form.email}</li>
            <li>Bericht: {state.form.message}</li>
            <li>Nieuwsbrief: {state.form.preferences.newsletter ? 'Ja' : 'Nee'}</li>
            <li>Meldingen: {state.form.preferences.notifications ? 'Ja' : 'Nee'}</li>
          </ul>
        </div>
      )}

      <div class="mt-4 text-sm text-gray-500">
        <p> Om resumability in actie te zien:</p>
        <ol class="list-decimal ml-6">
          <li>Vul het formulier in (niet versturen)</li>
          <li>Open DevTools Network tab</li>
          <li>Ververs de pagina</li>
          <li>Merk op hoe de formuliergegevens behouden blijven zonder JavaScript!</li>
          <li>Verstuur het formulier om complexe state updates te zien</li>
        </ol>
      </div>
    </section>
  );
});

// Progressive Enhancement Component
const ProgressiveEnhancement = component$(() => {
  const time = useSignal('Laden...');
  const theme = useSignal('light');

  useTask$(() => {
    const updateTime = () => {
      time.value = new Date().toLocaleTimeString();
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });

  return (
    <section class="border p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">4. Progressive Enhancement</h2>
      <p class="mb-4 text-gray-500">
        Qwik componenten werken zonder JavaScript en verbeteren progressief wanneer JS laadt.
        Deze klok werkt met en zonder JavaScript:
      </p>

      <div class={`p-4 rounded ${theme.value === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
        <div class="text-2xl font-mono text-center">
          {time}
        </div>
        
        <button
          onClick$={() => theme.value = theme.value === 'light' ? 'dark' : 'light'}
          class="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full"
        >
          Thema Wisselen
        </button>
      </div>

      <div class="mt-4 text-sm text-gray-500">
        <p> Progressive Enhancement kenmerken:</p>
        <ul class="list-disc ml-6">
          <li>Werkt zonder JavaScript (SSR)</li>
          <li>Verbetert met JavaScript (klok updates)</li>
          <li>Behoudt interactiviteit (thema wissel)</li>
          <li>Geen flikkerende inhoud of layout verschuivingen</li>
        </ul>
      </div>
    </section>
  );
});

// Prefetching Component
const Prefetching = component$(() => {
  const imageLoaded = useSignal(false);
  const hovering = useSignal(false);

  useTask$(() => {
    const timer = setTimeout(() => {
      imageLoaded.value = true;
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <section class="border p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">5. Smart Prefetching</h2>
      <p class="mb-4 text-gray-500">
        Qwik laadt automatisch componenten en bronnen vooraf op basis van gebruikersinteractie
        en viewport zichtbaarheid. Hover over elementen om prefetching in actie te zien:
      </p>

      <div 
        class="relative p-4 bg-gray-50 rounded"
        onMouseEnter$={() => hovering.value = true}
        onMouseLeave$={() => hovering.value = false}
      >
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class={`h-4 w-32 rounded ${imageLoaded.value ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div class={`h-4 w-48 rounded ${imageLoaded.value ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
          </div>
          
          {hovering.value && (
            <div class="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
              Vooraf laden...
            </div>
          )}
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-500">
        <p> Voordelen van prefetching:</p>
        <ul class="list-disc ml-6">
          <li>Automatisch vooraf laden van bronnen</li>
          <li>Voorspellend laden op basis van viewport</li>
          <li>Slim bundelen van gerelateerde componenten</li>
          <li>Verbeterde waargenomen prestaties</li>
        </ul>
      </div>
    </section>
  );
});

// Main App Component
export default component$(() => {
  return (
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold mb-8">Qwik Demo - Key Features</h1>
      
      <div class="space-y-8">
        <InstantLoading />
        <CodeSplitting />
        <Resumability />
        <ProgressiveEnhancement />
        <Prefetching />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Demo - Key Features",
  meta: [
    {
      name: "description",
      content: "Interactieve demo van de belangrijkste Qwik framework features",
    },
  ],
};
