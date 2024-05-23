<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSocketStore } from '@/stores/socket';

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const route = useRoute();
const socketStore = useSocketStore();
const selectedAnswer = ref(null); // Local ref for selectedAnswer
const waitingForOthers = ref(false);
const submittedPlayers = ref([]);
const showQuestion = ref(true);
const showScores = ref(false);
const playerName = ref('');

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
    console.log('Received data: ', data);
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
    console.log("These players have submitted: ", JSON.parse(JSON.stringify(submittedPlayers.value)));
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

const nextQuestion = () => {
  socketStore.selectedAnswer = selectedAnswer.value; // Update store with selectedAnswer
  socketStore.submitAnswer();
  waitingForOthers.value = true;
  selectedAnswer.value = null; // Reset the local ref
  showQuestion.value = false;
};

const currentQuestion = computed(() => socketStore.currentQuestion);
const quizFinished = computed(() => socketStore.quizFinished); // Add this computed property
</script>

<template>
  <section class="container px-6">
    <div v-if="socketStore.quizFinished">
      <h2 class="pt-8 pb-6 text-2xl font-semibold">Quiz Finished</h2>
      <h3 class="text-xl font-semibold">Final Scores:</h3>
      <ul>
        <li v-for="player in socketStore.players" :key="player.playerName">
          {{ player.playerName }}: {{ player.score }}
        </li>
      </ul>
    </div>
    <div v-else>
      <div v-if="showQuestion && currentQuestion">
        <h2 class="pt-6 pb-4 text-2xl font-semibold">{{ currentQuestion.question }}</h2>
        <ul>
          <li v-for="(option, key) in currentQuestion.options" :key="key">
            <label class="block px-6 py-8 my-6 border-2 border-[#333] rounded-lg">
              <input type="radio" :name="socketStore.currentQuestionIndex" :value="key" v-model="selectedAnswer" />
              {{ key }} : {{ option }}
            </label>
          </li>
        </ul>
        <button @click="nextQuestion" class="mt-3 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
      </div>

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
