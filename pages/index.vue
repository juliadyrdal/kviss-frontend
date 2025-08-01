<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useSocketStore } from '@/stores/socket';
import { ref, onMounted } from 'vue';
import IconUnderline from '~/assets/icon-underline.svg'

const router = useRouter();
const route = useRoute();
const socketStore = useSocketStore();

const quizId = ref('');
const playerName = ref('');
const quizIdIsSet = ref(false);
const mounted = ref(false);

onMounted(() => {
  const queryQuizId = route.query.quizId;
  // Hide input field for quiz ID if it is included in the route
  if (queryQuizId) {
    quizId.value = queryQuizId;
    quizIdIsSet.value = true;
  }
  // Indicate component has been mounted
  mounted.value = true;  
});

const handleSubmit = () => {
  socketStore.setPlayerName(playerName.value);
  socketStore.setQuizId(quizId.value);
  router.push(`/quiz/${quizId.value}`);
}
</script>

<template>
    <section class="container max-w-[40rem] mx-auto px-6 pt-4 flex justify-center">
      <NuxtLink to="/create-quiz" class="w-full"><button class="w-full bg-purple px-3.5 py-2.5 font-bold text-black border border-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><span class="mr-2">+</span>Create new quiz</button></NuxtLink>
    </section>
    <section class="container max-w-[40rem] mx-auto px-6 pb-32 bg-surface-light">
      <div class="flex flex-col items-center mb-6">
        <h3 class="pt-16 pb-3 text-xl font-semibold text-center">Join quiz</h3>
        <IconUnderline class="mb-4 w-60 text-black" :fontControlled="false" />
      </div>
      <form v-if="mounted" @submit.prevent="handleSubmit">
        <label for="playerName" class="block mb-2">What do you want to call yourself?</label>
        <input type="text" v-model="playerName" class="mb-6 pl-2 block w-full border border-[#000] py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" id="playerName">
        <label v-if="!quizIdIsSet" for="quizId" class="block mb-2">Enter the quiz ID</label>
        <input v-if="!quizIdIsSet" type="text" v-model="quizId" class="mb-4 pl-2 block w-full border border-[#000] py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" id="quizId">
        <button type="submit" class="mt-6 w-full bg-black px-3.5 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Join quiz</button>
      </form>
    </section>
</template>
