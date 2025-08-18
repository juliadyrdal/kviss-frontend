<script setup>
/**
 * JoinQuizForm
 * ------------
 * Collects player name and (conditionally) quiz id.
 * 
 * Props:
 *  - initialQuizId - if present, pre-fills and hides the quiz id field.
 * 
 * Emits:
 *  - 'submit' with { playerName, quizId }
 * 
 */
const props = defineProps({ initialQuizId: { type: String, default: null } })
const emit = defineEmits(['submit'])

const playerName = ref('')
const localQuizId = ref('')

const resolvedQuizId = computed(() => props.initialQuizId || localQuizId.value)
const canSubmit = computed(() => playerName.value.trim().length > 0 && resolvedQuizId.value.trim().length > 0)

const onSubmit = () => {
    // Only submit if input fields are non-empty
    if (!canSubmit.value) return
    emit('submit', {
        playerName: playerName.value.trim(),
        quizId: resolvedQuizId.value.trim()
    })
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <!-- playerName -->
        <label for="playerName" class="block mb-2">What do you want to call yourself?</label>
        <input type="text" v-model="playerName" class="mb-6 pl-2 block w-full border border-[#000] py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" id="playerName">
        
        <!-- quizId - if quizId has not been set -->
        <label v-if="!props.initialQuizId" for="quizId" class="block mb-2">Enter the quiz ID</label>
        <input v-if="!props.initialQuizId" type="text" v-model="localQuizId" class="mb-4 pl-2 block w-full border border-[#000] py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" id="quizId">
        
        <button type="submit" :disabled="!canSubmit" class="mt-6 w-full bg-black px-3.5 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Join quiz</button>
    </form>
</template>