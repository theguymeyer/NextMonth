<script setup>
const props = defineProps({
  filteredStaged: Array,
  categories: Array,
  saveMsg: String
})

const emit = defineEmits(['addCategory', 'saveTransactions'])
</script>

<template>
  <section class="card">
    <h2>Classify transactions ({{ filteredStaged.length }})</h2>

    <div class="transactions">
      <div
        v-for="t in filteredStaged"
        :key="t.id"
        class="transaction-card"
      >
        <div class="row">
          <span class="label">Date:</span>
          <span>{{ t.date }}</span>
        </div>
        <div class="row">
          <span class="label">Description:</span>
          <span>{{ t.description }}</span>
        </div>
        <div class="row">
          <span class="label">Amount:</span>
          <span>{{ t.amount }}</span>
        </div>
        <div class="row">
          <span class="label">Foreseeable?</span>
          <input type="checkbox" v-model="t.foreseeable" />
        </div>
        <div class="row">
          <span class="label">Category:</span>
          <select v-model="t.category">
            <option value="">Uncategorized</option>
            <option
              v-for="c in categories"
              :key="c"
              :value="c"
            >
              {{ c }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn ghost" @click="emit('addCategory')">+ Add Category</button>
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
  gap: 0.5rem;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
 
.label {
  font-weight: 600;
  margin-right: 0.5rem;
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
</style>
