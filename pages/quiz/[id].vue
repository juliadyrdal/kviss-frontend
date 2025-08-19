<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSocketStore } from '@/stores/socket';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const route = useRoute();
const socketStore = useSocketStore();
const selectedAnswer = ref(null); 
const waitingForOthers = ref(false);
const submittedPlayers = ref([]);
const showQuestion = ref(true);
const showScores = ref(false);
const correctAnswer = ref(null); 
const showResults = ref(false); 
const radioIsDisabled = ref(false);
const allPlayersReady = ref(false);

onMounted(async () => {
  socketStore.connect();
  socketStore.setQuizId(route.params.id);

  // Emit the 'joinQuiz' event with both quizId and playerName
  socketStore.socket.emit('joinQuiz', { quizId: route.params.id, playerName: socketStore.playerName });

  const url = `${apiUrl}/quiz/${route.params.id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }
    const data = await response.json();
    socketStore.setQuestions(data.questions || []);
    socketStore.socket.emit('setQuestionsCount', route.params.id, data.questions.length); // Set total questions
  } catch (error) {
    console.error('Error during fetch: ', error);
  }

  socketStore.socket.on('answerSubmitted', (data) => {
    console.log('Answer submitted by another user:', data);
    if (!submittedPlayers.value.includes(data.playerName)) {
      submittedPlayers.value.push(data.playerName);
    }
  });

  socketStore.socket.on('allPlayersFinished', ({ players: playerList, questionIndex }) => {
    console.log('All players finished question', questionIndex);
    socketStore.players = playerList;
    waitingForOthers.value = false;
    showScores.value = true;
    showQuestion.value = false; // Ensure question is hidden when showing scores

    // Check if the quiz has finished
    if (questionIndex + 1 === socketStore.questions.length) {
      console.log('Quiz finished');
      socketStore.quizFinished = true;
    } else {
      setTimeout(() => {
        socketStore.currentQuestionIndex += 1;
        showQuestion.value = true;
        showScores.value = false;
        submittedPlayers.value = []; // Reset the submitted players for the next question
      }, 2000);
    }
  });
});

const startQuiz = () => {
  allPlayersReady.value = true;
}

const nextQuestion = () => {
  correctAnswer.value = socketStore.currentQuestion.correctAnswer; 
  showResults.value = true; 
  radioIsDisabled.value = true;
  setTimeout(() => {
    socketStore.selectedAnswer = selectedAnswer.value; // Update store with selectedAnswer
    socketStore.submitAnswer();
    waitingForOthers.value = true;
    selectedAnswer.value = null; // Reset the local ref
    showQuestion.value = false;
    showResults.value = false;
    radioIsDisabled.value = false;
  }, 3000);
};

const currentQuestion = computed(() => socketStore.currentQuestion);

const isCorrect = (option) => {
  if (!showResults.value) return false;
  return option === correctAnswer.value;
};

const isIncorrect = (option) => {
  if (!showResults.value) return false;
  return option !== correctAnswer.value && option === selectedAnswer.value;
};
</script>

<template>
  <section class="container max-w-[40rem] mx-auto px-6">

    <!-- If quiz has finished -->
    <FinalScores v-if="socketStore.quizFinished" :players="socketStore.players" />

    <!-- If quiz has not finished -->
    <div v-else>
      <div v-if="showQuestion && currentQuestion && allPlayersReady">
        <div class="flex justify-between px-4 py-1 border-2 border-black bg-purple">
          <h2 class="font-semibold uppercase">Question</h2>
          <span class="font-semibold text-lg uppercase">{{ socketStore.currentQuestionIndex + 1 }}/{{ socketStore.questions.length }}</span>
        </div>
        <div class="px-4 py-6 border-2 border-black bg-white">
          <h3 class="font-semibold">{{ currentQuestion.question }}</h3>
        </div>
        <div>
          <h2 class="pt-8 -mb-2 font-semibold uppercase">Answer</h2>
        </div>
        <ul>
          <li v-for="(option, key) in currentQuestion.options" :key="key">
            <label :class="{ 'border-green': isCorrect(key), 'border-red-500': isIncorrect(key) }" class="block px-6 py-4 my-6 border-2 border-black bg-white">
              <input type="radio" :name="socketStore.currentQuestionIndex" :value="key" v-model="selectedAnswer" :disabled="radioIsDisabled" />
              {{ key }} : {{ option }}
            </label>
          </li>
        </ul>
        <button @click="nextQuestion" class="mt-3 w-full bg-black px-3.5 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
      </div>

      <!-- Display all players ready to start quiz -->
      <ReadyPlayers v-if="!allPlayersReady" @start="startQuiz" :ready-players="socketStore.readyPlayers" />

      <div v-if="waitingForOthers">
        <p>Waiting for other players...</p>
        <div v-if="submittedPlayers.length">
        <h3 class="text-xl font-semibold">Submitted Players:</h3>
        <ul>
          <li v-for="player in submittedPlayers" :key="player">
            {{ player }}
          </li>
        </ul>
      </div>
      </div>

      <div v-if="showScores && !showQuestion && socketStore.players.length">
        <h3 class="text-xl font-semibold">Scores:</h3>
        <ul>
          <li v-for="player in socketStore.players" :key="player.playerName">
            {{ player.playerName }}: {{ player.score }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>