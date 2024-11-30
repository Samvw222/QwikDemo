import { component$, useStore, useTask$, $ } from '@builder.io/qwik';

export default component$(() => {
  // Complex state object that would normally require hydration
  const state = useStore({
    userProfile: {
      name: '',
      email: '',
      preferences: {
        theme: 'light',
        notifications: true
      }
    },
    todos: [] as string[],
    completedCount: 0
  });

  // Simulate server-side data
  useTask$(() => {
    // In a real app, this would be server data
    state.todos = [
      'Learn about Qwik Resumability',
      'Understand the difference with Hydration',
      'Build awesome Qwik apps'
    ];
  });

  // Complex UI interaction handler
  const handleTodoToggle$ = $((index: number) => {
    const todo = state.todos[index];
    if (todo) {
      // Update multiple parts of the state
      state.completedCount++;
      state.userProfile.preferences.notifications = true;
      
      // In traditional frameworks, this would trigger re-hydration
      state.todos = [
        ...state.todos.slice(0, index),
        `✅ ${todo}`,
        ...state.todos.slice(index + 1)
      ];
    }
  });

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold mb-8">Understanding Qwik Resumability</h1>
      
      <div class="grid grid-cols-2 gap-8">
        {/* Left column: Explanation */}
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold">How it works:</h2>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-bold">Traditional Frameworks (Hydration)</h3>
            <ol class="list-decimal ml-4 space-y-2">
              <li>Server renders HTML</li>
              <li>Browser downloads all JavaScript</li>
              <li>Framework rebuilds entire component tree</li>
              <li>Reattaches all event listeners</li>
              <li>State management needs to be reconstructed</li>
            </ol>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-bold">Qwik (Resumability)</h3>
            <ol class="list-decimal ml-4 space-y-2">
              <li>Server renders HTML with state already embedded</li>
              <li>No JavaScript downloaded initially</li>
              <li>Components "resume" where they left off</li>
              <li>Event listeners load only when needed</li>
              <li>State preserved without reconstruction</li>
            </ol>
          </div>
        </div>

        {/* Right column: Interactive Demo */}
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-semibold mb-4">Interactive Demo</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  value={state.userProfile.name}
                  onInput$={(ev: any) => state.userProfile.name = ev.target.value}
                  class="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  value={state.userProfile.email}
                  onInput$={(ev: any) => state.userProfile.email = ev.target.value}
                  class="w-full p-2 border rounded"
                />
              </div>

              <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Todo List:</h4>
                <ul class="space-y-2">
                  {state.todos.map((todo, index) => (
                    <li key={index} class="flex items-center">
                      <button
                        onClick$={() => handleTodoToggle$(index)}
                        class="flex-1 text-left p-2 hover:bg-gray-50 rounded"
                      >
                        {todo}
                      </button>
                    </li>
                  ))}
                </ul>
                <p class="text-sm text-gray-600 mt-2">
                  Completed: {state.completedCount}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-bold mb-2">Try this:</h3>
            <ol class="list-decimal ml-4 space-y-2">
              <li>Fill in the form fields</li>
              <li>Complete some todos</li>
              <li>Open DevTools Network tab</li>
              <li>Refresh the page</li>
              <li>Notice: No JavaScript needed to restore state!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
});
