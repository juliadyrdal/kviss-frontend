<script setup>
import { useClipboard } from '@vueuse/core';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'

const theme = ref('');
const difficulty = ref(5);
const numQuestions = ref(0);
const isLoading = ref(false);
const questions = ref([]);
const isGenerated = ref(false);
const quizId = ref(null);

const apiUrl = process.env.API_URL

// Clipboard functionality
const { copy, copied } = useClipboard();

const handleSubmit = async () => {
  isLoading.value = true;
  const url = `${apiUrl}/quiz/generate-quiz`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ theme: theme.value, numQuestions: numQuestions.value, difficulty: difficulty.value })
    });

    // Check if request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }

    // Process response
    const data = await response.json();
    console.log('Received data: ', data);
    quizId.value = data.quizId;
    questions.value = data.questions.quiz || []

  } catch (error) {
    console.error('Error during fetch: ', error);
  } finally {
    isLoading.value = false;
    isGenerated.value = true;
  }
}
</script>

<template>
    <section class="container px-6">
    <div v-if="isLoading">
      <p>Generating quiz...</p>
    </div>
  </section>
  <section class="container px-6">
    <div v-if="!isLoading && !isGenerated" class="">
      <div class="">
        <h3 class="pt-6 pb-8 text-xl font-semibold text-center">Create quiz</h3>
      </div>
      <div class="">
        <form @submit.prevent="handleSubmit" class="flex flex-col">
          <label class="block mb-2" for="theme">Choose a theme for your quiz</label>
          <input class="mb-6 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" id="theme" v-model="theme">
          <label for="difficulty" class="mb-2">How difficult should it be?</label>
          <input type="range" id="difficulty" name="difficulty" v-model="difficulty" min="1" max="10" class="mb-1" />
          <div class="flex justify-between mb-6"><p>Easy</p><p>Hard</p></div>
          <label class="block mb-2" for="numQuestions">How many questions do you want?</label>
          <input class="mb-4 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" id="numQuestions" v-model="numQuestions">
          <button class="mt-3 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">Generate quiz</button>
        </form>
      </div>
    </div>
  </section>
  <section class="container px-6" v-if="isGenerated">
    <p class="pt-16 pb-4 text-lg font-semibold">Copy the link below and share it to invite your friends</p>
    <button @click="copy(`http://localhost:3001/?quizId=${quizId}`)" class="block w-full mb-6 rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100">
      <!-- by default, `copied` will be reset in 1.5s -->
      <span class="flex gap-2 justify-center" v-if="!copied">Copy link <DocumentDuplicateIcon class="size-5 text-indigo-600" /></span>
      <span v-else>Copied!</span>
    </button>
    <p class="pt-10 pb-4 text-lg font-semibold">Enter the quiz and start playing</p>
    <button class="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Join quiz</button>
  </section>
</template>

