<script setup>
/**
 * FinalScores
 * -----------
 * Display final score of each player when quiz has finished.
 * 
 * Props:
 *  - 'players' - array containing all players in quiz game.
 */
import UnderlinedHeading from './UnderlinedHeading.vue';
const { players } = defineProps({ players: { type: Array, required: true }})
</script>

<template>
    <div>
      <UnderlinedHeading>Finished</UnderlinedHeading>
      <h3 class="text-xl font-semibold">Final Scores:</h3>
      <ul>
        <li v-for="player in players" :key="player.playerName">
          {{ player.playerName }}: {{ player.score }}
        </li>
      </ul>
    </div>
</template>