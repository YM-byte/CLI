<script setup lang="ts">
defineProps<{
  cards: ReadonlyArray<{
    description: string;
    label: string;
    value: string;
  }>;
}>();
</script>

<template>
  <section class="stack-highlights">
    <article
      v-for="card in cards"
      :key="card.label"
      class="stack-highlights__card"
    >
      <p class="stack-highlights__label">
        {{ card.label }}
      </p>
      <h2 class="stack-highlights__value">
        {{ card.value }}
      </h2>
      <p class="stack-highlights__desc">
        {{ card.description }}
      </p>
    </article>
  </section>
</template>

<style scoped>
.stack-highlights {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.stack-highlights__card {
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.06);
  padding: 24px;
}

.stack-highlights__label,
.stack-highlights__desc {
  margin: 0;
  color: #475569;
}

.stack-highlights__value {
  margin: 12px 0;
  color: #0f172a;
  font-size: 22px;
}
</style>
