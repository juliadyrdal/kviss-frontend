<script setup>
/**
 * CreateQuizForm
 * --------------
 * Collects theme, difficulty level and number of questions for new quiz.
 * 
 * Emits:
 *  - 'submit' with theme, difficulty and numQuestions.
 */
const emit = defineEmits(['submit'])

const theme = ref('');
const difficulty = ref(5);
const numQuestions = ref(0);

const canSubmit = computed(() => theme.value.trim().length > 0 && numQuestions.value > 0)

const onSubmit = () => {
    // Only submit if input fields are non-empty
    if (!canSubmit.value) return
    emit('submit', {
        theme: theme.value.trim(),
        difficulty: difficulty.value,
        numQuestions: numQuestions.value,
    })    
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="flex flex-col">
        <!-- theme -->
        <label class="block mb-2" for="theme">Choose a theme for your quiz</label>
        <input type="text" id="theme" v-model.number="theme" class="mb-6 pl-2 block w-full border border-black py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        
        <!-- difficulty -->
        <label for="difficulty" class="mb-2">How difficult should it be?</label>
        <input type="range" id="difficulty" name="difficulty" v-model.number="difficulty" min="1" max="10" class="range-input bg-surface-light" />
        <div class="flex justify-between mb-6"><p>Easy</p><p>Hard</p></div>
        
        <!-- number of questions -->
        <label class="block mb-2" for="numQuestions">How many questions do you want?</label>
        <input type="number" id="numQuestions" v-model.number="numQuestions" class="mb-4 pl-2 block w-full border border-black py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        
        <button type="submit" :disabled="!canSubmit" class="mt-6 w-full rounded-md bg-black px-3.5 py-2.5 font-bold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Generate quiz</button>
    </form>
</template>