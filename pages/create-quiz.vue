<script setup>
/**
 * Create Quiz page
 * ----------------
 * Calls backend to generate quiz, then shows share link.
 * 
 * Contract:
 *  - Requires runtime config: public.apiUrl, public.clientUrl
 *  - POST /quiz/generate-quiz with { theme, numQuestions, difficulty }
 *  - On success: sets quizId, computes shareLink.
 * 
 */
const isLoading = ref(false);
const isGenerated = ref(false);

const quizId = ref(null);
const questions = ref([]);

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const clientUrl = config.public.clientUrl;

const quizLink = computed(() => quizId.value ? `${clientUrl}/?quizId=${quizId.value}` : '')



const handleCreate = async ({ theme, difficulty, numQuestions }) => {
  isLoading.value = true;
  const url = `${apiUrl}/quiz/generate-quiz`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ theme, difficulty, numQuestions })
    });

    // Check if request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }

    // Process response
    const data = await response.json();
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
    <div v-if="!isLoading && !isGenerated">
      <UnderlinedHeading class="mb-2">Create quiz</UnderlinedHeading>
      
      <CreateQuizForm @submit="handleCreate" />
      
    </div>
  </section>

  <section class="container max-w-[40rem] mx-auto px-6" v-if="isGenerated">
    <ShareQuizLink :quiz-link="quizLink" />
  </section>
</template>

