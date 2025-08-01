<script setup>
import { useClipboard } from '@vueuse/core';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import IconUnderline from '~/assets/icon-underline.svg'
import IconArrow from '~/assets/icon-arrow.svg'

const theme = ref('');
const difficulty = ref(5);
const numQuestions = ref(0);
const isLoading = ref(false);
const questions = ref([]);
const isGenerated = ref(false);
const quizId = ref(null);

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const clientUrl = config.public.clientUrl;

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
    <section class="container max-w-[40rem] mx-auto px-6">
    <div v-if="isLoading">
      <p>Generating quiz...</p>
    </div>
  </section>
  <section class="container max-w-[40rem] mx-auto px-6">
    <div v-if="!isLoading && !isGenerated" class="">
      <div class="flex flex-col items-center mb-6">
        <h3 class="pb-3 text-xl font-semibold text-center">Create quiz</h3>
        <IconUnderline class="w-60 text-black" :fontControlled="false" />
      </div>
      <div class="">
        <form @submit.prevent="handleSubmit" class="flex flex-col">
          <label class="block mb-2" for="theme">Choose a theme for your quiz</label>
          <input class="mb-6 pl-2 block w-full border border-black py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" id="theme" v-model="theme">
          <label for="difficulty" class="mb-2">How difficult should it be?</label>
          <input type="range" id="difficulty" name="difficulty" v-model="difficulty" min="1" max="10" class="range-input bg-surface-light" />
          <div class="flex justify-between mb-6"><p>Easy</p><p>Hard</p></div>
          <label class="block mb-2" for="numQuestions">How many questions do you want?</label>
          <input class="mb-4 pl-2 block w-full border border-black py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" id="numQuestions" v-model="numQuestions">
          <button class="mt-6 w-full rounded-md bg-black px-3.5 py-2.5 font-bold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">Generate quiz</button>
        </form>
      </div>
    </div>
  </section>
  <section class="container max-w-[40rem] mx-auto px-6" v-if="isGenerated">
    <p class="pt-16 pb-4 text-lg font-semibold">Copy the link below and share it to invite your friends</p>
    <button @click="copy(`${clientUrl}/?quizId=${quizId}`)" class="w-full bg-purple px-3.5 py-2.5 font-bold text-black border border-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      <!-- by default, `copied` will be reset in 1.5s -->
      <span class="flex gap-2 justify-center" v-if="!copied">Copy link <DocumentDuplicateIcon class="size-5 text-black" /></span>
      <span v-else>Copied!</span>
    </button>
    <div class="flex justify-center pt-8 pr-24">
      <IconArrow class="h-20 text-black" :fontControlled="false" />
    </div>
    <p class="pt-10 pb-4 text-lg font-semibold">Enter the quiz and start playing</p>
    <NuxtLink :to="`${clientUrl}/?quizId=${quizId}`"><button class="w-full bg-black px-3.5 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Join quiz</button></NuxtLink>
  </section>
</template>

