<script setup>
/**
 * CreateQuizCta
 * -------------
 * Button linking to quiz creation.
 * 
 */
</script>

<template>
  <NuxtLink to="/create-quiz" class="w-full">
    <button class="w-full bg-purple px-3.5 py-2.5 font-bold text-black border border-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      <span class="mr-2">+</span>Create new quiz
    </button>
  </NuxtLink>
</template>
