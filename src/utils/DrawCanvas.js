import Konva from "konva";

export const __konva = {
  stage: null,
  layer: null,
};

export const __dnd = {
  list: null,
  item: null,
};

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

export function addCardOnCanvas({ listId, newCard }) {
  this.$store.commit("addKanbanCard", { listId, newCard });
  this.drawFns().initCanvas();
}

export function addListOnCanvas(addingList) {
  this.$store.commit("addKanbanList", addingList);
  this.drawFns().initCanvas();
}

export function deleteListOnCanvas(deletingList) {
  this.$store.commit("deleteKanbanList", deletingList);
  this.drawFns().initList();
}

export function editListOnCanvas(editingList) {
  this.$store.commit("editKanbanList", editingList);
  this.drawFns().initList();
}

export function deleteCardOnCanvas(deletingCard) {
  this.$store.commit("deleteKanbanCard", deletingCard);
  this.drawFns().initList();
}

export function editCardOnCanvas(editingCard) {
  this.$store.commit("editKanbanCard", editingCard);
  this.drawFns().initList();
}

export function initCanvas() {
  const kanbanList = isLite
    ? this.$store.getters.kanbanList
    : this.$store.api?.board?.kanbanList;

  const width =
    (window.matchMedia("(min-width:1440px)").matches
      ? window.innerWidth
      : 1600) + 20;
  const height = window.innerHeight;

  const largestList = kanbanList?.length;
  const calculatedChildren =
    !!largestList && Math.max(...kanbanList.map((v) => v.children?.length));
  const largestChildren = calculatedChildren >= 2 ? calculatedChildren : 2;

  __konva.stage = new Konva.Stage({
    container: "kanbaneon-canvas",
    width: largestList > 4 ? width + (largestList - 4) * 295 : width,
    height:
      largestChildren > 3
        ? largestChildren * 12.25 + largestChildren * 180 + 60
        : largestChildren * 280,
    x: 0,
    y: 0,
  });

  __konva.layer = new Konva.Layer();
  __konva.stage.add(__konva.layer);
  __konva.stage.container().style.cursor = "move";

  this.drawFns().initList();
}
