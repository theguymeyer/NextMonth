<script setup>
const props = defineProps({
  filteredStaged: Array,
  saveMsg: String
})

const emit = defineEmits(['saveTransactions'])
</script>

<template>
  <section class="card">
    <h2>Classify transactions ({{ filteredStaged.length }})</h2>

    <div
    v-for="t in filteredStaged"
    :key="t.id"
    :class="['transaction-card', t.amount > 0 ? 'transaction-card__income' : 'transaction-card__expense']"
    >
      <div class="row">
        <span class="data-point big-font">{{ t.description }}</span>
        <span class="data-point big-font">₪ {{ t.amount }}</span>
      </div>
      <div class="row">
        <span class="label">Date:</span>
        <span class="data-point">{{ t.date }}</span>
      </div>
      <div class="row" v-if="t.amount<0">
        <span class="label">Foreseeable?</span>
        <input class="pretty-checkbox" type="checkbox" v-model="t.foreseeable" />
      </div>
      <div class="row" v-if="t.amount>0">
        <span class="label">Income:</span>
        <input class="pretty-checkbox" type="checkbox" v-model="t.income" />
      </div>
    </div>

    <div class="actions">
      <button class="btn" @click="emit('saveTransactions')">Save</button>
      <span class="save-msg">{{ saveMsg }}</span>
    </div>
  </section>
</template>

<style scoped>
.transactions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-card {
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
}

.transaction-card__income {
    background-color: darkcyan;
}

.transaction-card__expense {
    background-color: lightcoral;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
 
.label {
  font-size: 0.9em;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  margin-right: 0.5rem;
}

.data-point {
  font-size: 0.9em;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  margin-right: 0.5rem;
}

.big-font {
  font-size: 1.9em;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.save-msg {
  flex-grow: 1;
}

.pretty-checkbox {
  width: 2em;
  height: 2em;
}

</style>
