import { nextTick } from 'vue';
import { initFlowbite } from 'flowbite';

export function useFlowbite() {
  async function refreshFlowbite() {
    await nextTick();
    initFlowbite();
  }

  return {
    refreshFlowbite,
  };
}
