<template>
    <div>
        <slot name="operation" :text="text" :record="record"></slot>

    </div>
</template>

<script>
    export default {
        name: 'jn-filter-action'
    }
</script>

<style scoped>

</style>
