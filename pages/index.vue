<script setup>
/**
 * Home/Landing page
 * -----------------
 * Join existing quiz or create a new one.
 * 
 * Contract:
 *  - Reads quizId from route and pre-fills form (if exists).
 *  - On submit: sets socket store (playerName, quizId) and navigates to /quiz/:quizId.
 * 
 */
import { useRouter, useRoute } from 'vue-router';
import { useSocketStore } from '@/stores/socket';
import UnderlinedHeading from '~/components/UnderlinedHeading.vue';

const router = useRouter();
const route = useRoute();
const socketStore = useSocketStore();

const initialQuizId = computed(() => route.query.quizId)

const handleJoin = ({ playerName, quizId }) => {
  socketStore.setPlayerName(playerName)
  socketStore.setQuizId(quizId)
  router.push(`/quiz/${quizId}`)
}
</script>

<template>
    <section class="container max-w-[40rem] mx-auto px-6 pt-4 flex justify-center">
      <CreateQuizCta />
    </section>

    <section class="container max-w-[40rem] mx-auto px-6 pb-32 bg-surface-light">
      <UnderlinedHeading class="mt-12 mb-5">Join quiz</UnderlinedHeading>
      <JoinQuizForm :initial-quiz-id="initialQuizId" @submit="handleJoin" />
    </section>
</template>
