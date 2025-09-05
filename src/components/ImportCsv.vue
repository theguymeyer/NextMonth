<script setup>
const props = defineProps({
  month: Object,
  rawRows: Array,
  monthOptions: Array
})

const emit = defineEmits(['onFile', 'confirmImport'])
</script>

<template>
  <section class="card">
    <h2>Import monthly statement (CSV)</h2>
    <input type="file" @change="emit('onFile', $event)" accept=".csv">
    <select v-model="month.value">
      <option disabled value="">Select month</option>
      <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
    </select>
    <button class="btn" :disabled="!rawRows.length" @click="emit('confirmImport')">Parse & stage</button>
    <p v-if="rawRows.length">Preview rows: {{ rawRows.length }}</p>
  </section>
</template>
