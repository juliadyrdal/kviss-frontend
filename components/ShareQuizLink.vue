<script setup>
/**
 * ShareQuizLink
 * -------------
 * Share quiz link and join generated quiz.
 * 
 * Props:
 *  - quizLink - full URL
 * 
 */
import { useClipboard } from '@vueuse/core';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import IconArrow from '~/assets/icon-arrow.svg'

const { quizLink } = defineProps({ quizLink: { type: String, required: true } })

// Clipboard functionality
const { copy, copied } = useClipboard();
</script>

<template>
    <!-- Copy link -->
    <p class="pt-16 pb-4 text-lg font-semibold">Copy the link below and share it to invite your friends</p>
    <button @click="copy(`${quizLink}`)" class="w-full bg-purple px-3.5 py-2.5 font-bold text-black border border-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      <!-- by default, `copied` will be reset in 1.5s -->
      <span class="flex gap-2 justify-center" v-if="!copied">Copy link <DocumentDuplicateIcon class="size-5 text-black" /></span>
      <span v-else>Copied!</span>
    </button>

    <!-- Enter quiz -->
    <div class="flex justify-center pt-8 pr-24">
      <IconArrow class="h-20 text-black" :fontControlled="false" />
    </div>
    <p class="pt-10 pb-4 text-lg font-semibold">Enter the quiz and start playing</p>
    <NuxtLink :to="`${quizLink}`"><button class="w-full bg-black px-3.5 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Join quiz</button></NuxtLink>
</template>