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
    <h2>3) Classify transactions ({{ filteredStaged.length }})</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Foreseeable?</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filteredStaged" :key="t.id">
            <td>{{ t.date }}</td>
            <td>{{ t.description }}</td>
            <td>{{ t.amount }}</td>
            <td><input type="checkbox" v-model="t.foreseeable"></td>
            <td>
              <select v-model="t.category">
                <option value="">Uncategorized</option>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row">
      <button class="btn ghost" @click="emit('addCategory')">+ Add Category</button>
      <button class="btn" @click="emit('saveTransactions')">Save</button>
      <span>{{ saveMsg }}</span>
    </div>
  </section>
</template>
