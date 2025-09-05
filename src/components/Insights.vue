<script setup>
import { saveInsights } from '../api/insights'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  insights: Object,
  money: Function
})

async function handleSave() {
  try {
    await saveInsights(props.insights, 'September', '2025')
    alert('Insights saved successfully!')
  } catch (err) {
    alert('Error saving insights: ' + err.message)
  }
}

const chartData = {
  labels: ['Foreseeable', 'Unforeseeable'],
  datasets: [
    {
      label: 'Income Distribution',
      data: [props.insights.foreseeableTotal, props.insights.unforeseeableTotal],
      backgroundColor: ['#1976D2', '#D32F2F']
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: `Total Income: ${props.money(props.insights.incomeTotal)}`
    }
  }
}
</script>

<template>
  <section class="card">
    <h2>Insights</h2>
    <button @click="handleSave">💾 Save Insights</button>
    <div style="max-width: 60%; margin: 0 auto;">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <ul class="insights-list">
      <li><strong>Total income:</strong> <span>{{ money(insights.incomeTotal) }}</span></li>
      <li><strong>Foreseeable:</strong> <span>{{ money(insights.foreseeableTotal) }}</span></li>
      <li><strong>Unforeseeable:</strong> <span>{{ money(insights.unforeseeableTotal) }}</span></li>
      <li><strong>Net:</strong> <span>{{ money(insights.net) }}</span></li>
    </ul>
  </section>
</template>
