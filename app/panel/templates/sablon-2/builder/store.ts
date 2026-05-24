import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { createBlock, createDesignFromPreset, defaultSettings } from './presets';
import { BlockType, PresetId, TemplateBlock, TemplateDesign, TemplateMeta, TemplateSettings } from './types';

const emptyMeta: TemplateMeta = {
  name: '',
  subject: '',
  description: '',
};

const initialDesign = createDesignFromPreset('blank');

function cloneBlock(block: TemplateBlock): TemplateBlock {
  const cloned = structuredClone(block) as TemplateBlock;
  cloned.id = `${cloned.type}-${nanoid(8)}`;
  if (cloned.type === 'columns') {
    cloned.content.left = cloned.content.left.map(cloneBlock);
    cloned.content.right = cloned.content.right.map(cloneBlock);
  }
  return cloned;
}

function replaceBlock(blocks: TemplateBlock[], id: string, updater: (block: TemplateBlock) => TemplateBlock): TemplateBlock[] {
  return blocks.map((block) => {
    if (block.id === id) return updater(block);
    if (block.type === 'columns') {
      return {
        ...block,
        content: {
          left: replaceBlock(block.content.left, id, updater),
          right: replaceBlock(block.content.right, id, updater),
        },
      };
    }
    return block;
  });
}

function findBlock(blocks: TemplateBlock[], id: string | null): TemplateBlock | null {
  if (!id) return null;
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.type === 'columns') {
      const nested = findBlock([...block.content.left, ...block.content.right], id);
      if (nested) return nested;
    }
  }
  return null;
}

type BuilderState = {
  meta: TemplateMeta;
  design: TemplateDesign;
  selectedId: string | null;
  past: TemplateDesign[];
  future: TemplateDesign[];
  setMeta: (meta: Partial<TemplateMeta>) => void;
  setSettings: (settings: Partial<TemplateSettings>) => void;
  loadDesign: (design: TemplateDesign, meta?: Partial<TemplateMeta>) => void;
  resetFromPreset: (preset: PresetId, settings?: TemplateSettings, meta?: Partial<TemplateMeta>) => void;
  addBlock: (type: BlockType, index?: number) => void;
  moveBlock: (activeId: string, overId: string) => void;
  moveBlockByOffset: (id: string, offset: -1 | 1) => void;
  updateBlock: (id: string, updater: (block: TemplateBlock) => TemplateBlock) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  selectedBlock: () => TemplateBlock | null;
};

export const useTemplate2Store = create<BuilderState>((set, get) => {
  const commit = (design: TemplateDesign, selectedId = get().selectedId) => {
    set((state) => ({
      design,
      selectedId,
      past: [...state.past, state.design].slice(-40),
      future: [],
    }));
  };

  return {
    meta: emptyMeta,
    design: initialDesign,
    selectedId: null,
    past: [],
    future: [],

    setMeta: (meta) => set((state) => ({ meta: { ...state.meta, ...meta } })),

    setSettings: (settings) => {
      const design = get().design;
      commit({ ...design, settings: { ...design.settings, ...settings } });
    },

    loadDesign: (design, meta) => {
      set({
        design,
        meta: { ...emptyMeta, ...meta },
        selectedId: null,
        past: [],
        future: [],
      });
    },

    resetFromPreset: (preset, settings = defaultSettings, meta) => {
      set({
        design: createDesignFromPreset(preset, settings),
        meta: { ...emptyMeta, ...meta },
        selectedId: null,
        past: [],
        future: [],
      });
    },

    addBlock: (type, index) => {
      const block = createBlock(type);
      const blocks = [...get().design.blocks];
      const insertAt = typeof index === 'number' ? Math.max(0, Math.min(index, blocks.length)) : blocks.length;
      blocks.splice(insertAt, 0, block);
      commit({ ...get().design, blocks }, block.id);
    },

    moveBlock: (activeId, overId) => {
      const blocks = [...get().design.blocks];
      const oldIndex = blocks.findIndex((block) => block.id === activeId);
      const newIndex = blocks.findIndex((block) => block.id === overId);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
      const [moved] = blocks.splice(oldIndex, 1);
      blocks.splice(newIndex, 0, moved);
      commit({ ...get().design, blocks }, activeId);
    },

    moveBlockByOffset: (id, offset) => {
      const blocks = [...get().design.blocks];
      const index = blocks.findIndex((block) => block.id === id);
      const nextIndex = index + offset;
      if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) return;
      const [moved] = blocks.splice(index, 1);
      blocks.splice(nextIndex, 0, moved);
      commit({ ...get().design, blocks }, id);
    },

    updateBlock: (id, updater) => {
      commit({ ...get().design, blocks: replaceBlock(get().design.blocks, id, updater) }, id);
    },

    removeBlock: (id) => {
      const blocks = get().design.blocks.filter((block) => block.id !== id);
      commit({ ...get().design, blocks }, null);
    },

    duplicateBlock: (id) => {
      const blocks = [...get().design.blocks];
      const index = blocks.findIndex((block) => block.id === id);
      if (index < 0) return;
      const cloned = cloneBlock(blocks[index]);
      blocks.splice(index + 1, 0, cloned);
      commit({ ...get().design, blocks }, cloned.id);
    },

    selectBlock: (id) => set({ selectedId: id }),

    undo: () => {
      const { past, design, future } = get();
      const previous = past[past.length - 1];
      if (!previous) return;
      set({
        design: previous,
        past: past.slice(0, -1),
        future: [design, ...future].slice(0, 40),
        selectedId: null,
      });
    },

    redo: () => {
      const { past, design, future } = get();
      const next = future[0];
      if (!next) return;
      set({
        design: next,
        past: [...past, design].slice(-40),
        future: future.slice(1),
        selectedId: null,
      });
    },

    selectedBlock: () => findBlock(get().design.blocks, get().selectedId),
  };
});
