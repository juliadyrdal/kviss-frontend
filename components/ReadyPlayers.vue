<script setup>
/**
 * ReadyPlayers
 * ------------
 * Lists all ready players and emits 'start' when player starts quiz.
 * 
 * Props:
 *  - readyPlayers - array of players having joined the quiz.
 * 
 * Emits:
 *  - 'start': emits when player clicks 'Start quiz' button.
 * 
 */
const { readyPlayers } = defineProps({ readyPlayers: { type: Array, required: true }})
const emit = defineEmits(['start'])

const onStart = () => emit('start')
</script>

<template>
    <div>
        <h3 class="font-semibold text-center text-sm">Wait until all players are ready</h3>
        <h4 class="mt-16 mb-6 font-semibold text-center text-sm">Players</h4>
        <div v-if="readyPlayers">
          <span v-for="player in readyPlayers" :key="player" class="block mb-4 text-center w-full border border-black bg-white px-3.5 py-2.5 text-black">
            {{ player }}
          </span>
        </div>
        <button @click="onStart" class="mt-2 w-full bg-black px-3.5 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start quiz</button>
    </div>
</template>