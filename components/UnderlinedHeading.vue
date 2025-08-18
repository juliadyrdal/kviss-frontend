<script setup>
/**
 * UnderlinedHeading
 * -----------------
 * Display heading with underline.
 * 
 * Slots:
 *  - default: heading text
 */
import IconUnderline from '~/assets/icon-underline.svg'
</script>

<template>
  <div class="flex flex-col items-center">
    <h3 class="pt-3 pb-3 text-xl font-semibold text-center">
      <slot />
    </h3>
    <IconUnderline class="mb-4 w-60 text-black" :fontControlled="false" />
  </div>
</template>
