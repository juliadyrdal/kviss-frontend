<script setup>
import IconLogo from '~/assets/kviss-logo.svg'
import IconLogoLeft from '~/assets/logo-left.svg'
import IconLogoRight from '~/assets/logo-right.svg'
</script>

<template>
    <header class="container max-w-[40rem] mx-auto px-6 flex justify-center pt-8 pb-6 bg-surface-light">
        <IconLogoLeft class="mt-4 mr-1 w-10 text-black" :fontControlled="false" />
        <NuxtLink to="/">
            <IconLogo class="w-28 text-white" :fontControlled="false" />
        </NuxtLink>
        <IconLogoRight class="-mt-10 ml-1 w-10 text-black" :fontControlled="false" />
    </header>
</template>



