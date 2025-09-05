<script setup>
// Import Vue composition API utilities
import { reactive, ref, computed } from 'vue'
// Import utility functions and constants
import { store, uid, monthOptions, parseCsv } from './utils.js'

// Import child components
import ConnectAccount from './components/ConnectAccount.vue'
import ImportCsv from './components/ImportCsv.vue'
import TransactionsTable from './components/TransactionsTable.vue'
import Insights from './components/Insights.vue'
import SupabaseAuth from './components/SupabaseAuth.vue'

const settings = reactive(store.load())   // User settings loaded from storage
const month = reactive({ value: '' })   // Selected month for transactions
const year = reactive({ value: '' })   // Selected year for transactions
const rawRows = reactive([])      // Raw CSV rows imported
const staged = reactive([])   // Staged transactions after import
const username = reactive([])   // Staged transactions after import
const categories = reactive([
  'Rent',
  'Utilities',
  'Groceries',
  'Transport',
  'Health',
  'Subscriptions',
  'Taxes',
  'Business',
  'Leisure',
  'Other'
]) // Predefined categories
const filters = reactive({ showIncome:true, showExpenses:true, search:'', category:'' })
const saveMsg = ref('')       // Message for save status
const connectionMsg = ref('') // Message for connection status
const insights = ref(null)  // Computed insights from transactions

// Format a number as a money string
function money(n) {
  return (n<0?'-':'') + '$' + Math.abs(n).toFixed(2)
}

// Handle file input event, parse CSV, and populate rawRows
function onFile(ev) {
  rawRows.splice(0)
  const file = ev.target.files?.[0]
  if (!file) return
  parseCsv(file, (data) => data.forEach(r => rawRows.push(r)))
}

// Normalize a raw CSV row to a standard transaction object
function normalizeRow(r) {
  // Map CSV keys to lowercase for easier access
  const keys = Object.keys(r).reduce((acc,k)=>{ acc[k.toLowerCase().trim()] = k; return acc }, {})

  // Extract date, description, and amount fields
  const dateStr = r[keys['date']] || r[keys['transaction date']] || r[keys['posted']]
  const desc = r[keys['description']] || r[keys['memo']] || r[keys['details']] || ''
  let amountStr = r[keys['amount']] || r[keys['value']] || r[keys['debit']] || r[keys['credit']]

  // If both debit and credit exist, calculate net amount
  if (r[keys['debit']] && r[keys['credit']]) {
    const debit = parseFloat(String(r[keys['debit']]).replace(/[^0-9.-]/g,'')) || 0
    const credit = parseFloat(String(r[keys['credit']]).replace(/[^0-9.-]/g,'')) || 0
    amountStr = (credit - debit).toString()
  }

  // Parse amount as float
  const amount = parseFloat(String(amountStr).replace(/[^0-9.-]/g,'')) || 0

  // Format date as ISO string (YYYY-MM-DD)
  const dISO = new Date(dateStr).toISOString().slice(0,10)

  // Return normalized transaction object
  return { id: uid(), date: dISO, description: String(desc).slice(0,200), amount, foreseeable:false, category:'', is_income: amount>0 }
}

// Confirm import: normalize all rawRows and move to staged
function confirmImport() {
  staged.splice(0)
  rawRows.forEach(r => staged.push(normalizeRow(r)))
}

// Update username for all staged transactions
function updateUsername(newUsername) {
  console.log('Updating username to', newUsername)
  username.value = newUsername
}

// Computed filtered list of staged transactions based on filters
const filteredStaged = computed(() =>
  staged.filter(t=>{
    if (!filters.showIncome && t.amount>0) return false
    if (!filters.showExpenses && t.amount<0) return false
    if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.category && t.category !== filters.category) return false
    return true
  })
)

// Add a new category via prompt if it doesn't already exist
function addCategory() {
  const c = prompt('New category name')
  if (c && !categories.includes(c)) categories.push(c)
}

// Save staged transactions to localStorage and compute insights
function saveTransactions() {
  try {
    saveMsg.value = 'Saving...'
    const [y, m, _] = month.value.split('-');
    month.value = String(Number(m) + 1);
    year.value = y;
    const key = `nextmonth_${year.value || 'XXXX'}_${month.value || 'XX'}`
    localStorage.setItem(key, JSON.stringify(staged))
    saveMsg.value = 'Saved locally.'
  } catch(e) {
    console.error(e)
    saveMsg.value = 'Save failed. See console.'
  }
  computeInsights()
}

// Compute insights (totals, net, etc.) from staged transactions
function computeInsights() {
  if (!staged.length) { insights.value = null; return }
  const monthLabel = (month.value)
  console.log('Computing insights for', monthLabel)
  console.log('month:', month.value)
  console.log('Staged transactions 0:', staged[0])
  const yearLabel = (year.value)
  const incomeTotal = staged.filter(t=>t.amount>0).reduce((a,b)=>a+b.amount,0)
  const foreseeableTotal = staged.filter(t=>t.amount<0 && t.foreseeable).reduce((a,b)=>a+Math.abs(b.amount),0)
  const unforeseeableTotal = staged.filter(t=>t.amount<0 && !t.foreseeable).reduce((a,b)=>a+Math.abs(b.amount),0)
  const net = incomeTotal - (foreseeableTotal + unforeseeableTotal)
  insights.value = { monthLabel, yearLabel, incomeTotal, foreseeableTotal, unforeseeableTotal, net,
    bufferTarget: 0, reserveNow: 0, investableNow: Math.max(0, net) }
}

// Save user settings to storage
function saveSettings(){ store.save(settings); alert('Saved.') }

// Dummy test connection handler
async function testConnection(){ connectionMsg.value = 'Dummy: not connected' }
</script>

<template>
  <div>
      
    <!-- User authentication component -->
    <SupabaseAuth @updateUsername="updateUsername"/>

    <!-- Account connection settings component
    <ConnectAccount :settings="settings" :connectionMsg="connectionMsg"
                    @saveSettings="saveSettings" @testConnection="testConnection"/> -->

    <!-- CSV import component -->
    <ImportCsv v-if="username.value"
                :month="month" 
                :rawRows="rawRows" 
                :monthOptions="monthOptions"
                @onFile="onFile" 
                @confirmImport="confirmImport"/>

    <!-- Transactions table, shown if there are staged transactions -->
    <TransactionsTable v-if="staged.length"
                       :filteredStaged="filteredStaged" :categories="categories"
                       :saveMsg="saveMsg"
                       @addCategory="addCategory" @saveTransactions="saveTransactions"/>

    <!-- Insights summary, shown if insights are available -->
    <Insights v-if="insights" :insights="insights" :money="money"/>

  </div>
</template>
