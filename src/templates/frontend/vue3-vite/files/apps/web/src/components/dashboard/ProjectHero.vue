<script setup lang="ts">
import { ElButton, ElTag } from 'element-plus';

const props = defineProps<{
  actions: ReadonlyArray<{ href: string; label: string }>;
  title: string;
}>();
</script>

<template>
  <section class="project-hero">
    <div class="project-hero__copy">
      <ElTag
        effect="dark"
        round
        type="success"
      >
        YM CLI / Vue 标准模板
      </ElTag>
      <h1 class="project-hero__title">
        {{ props.title }}
      </h1>
      <p class="project-hero__desc">
        当前模板已经预置 Vue Router、Pinia 和 Element Plus。推荐把路由页当成组合层，把复杂逻辑继续下沉到
        composables 和 feature 组件里。
      </p>
      <div class="project-hero__actions">
        <ElButton
          v-for="action in props.actions"
          :key="action.label"
          :href="action.href"
          :type="action.label.includes('后端') ? 'success' : 'default'"
          round
          size="large"
          tag="a"
          target="_blank"
        >
          {{ action.label }}
        </ElButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-hero {
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
  padding: 32px;
}

.project-hero__copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.project-hero__title {
  margin: 0;
  font-size: 42px;
  line-height: 1.1;
  color: #0f172a;
}

.project-hero__desc {
  margin: 0;
  color: #475569;
  font-size: 16px;
  line-height: 1.9;
}

.project-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
