<!-- This is the modal component, a popup used by the delete button in Settings.vue-->
<template>
  <div class="modal_wrapper">
    <div class="modal">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Assombrit le fond */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background-color: var(--bg-card, #ffffff);
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
