import Konva from "konva";

export const __konva = {
  stage: null,
  layer: null,
};

export const __dnd = {
  list: null,
  item: null,
};

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

export function initCanvas(data) {
  const kanbanList = data?.board?.kanbanList ?? this.$store.getters.kanbanList;

  const width =
    (window.matchMedia("(min-width:1440px)").matches
      ? window.innerWidth
      : 1600) + 20;
  const height = window.innerHeight + 20;

  const largestList = kanbanList?.length;
  const largestChildren =
    !!largestList && Math.max(...kanbanList.map((v) => v.children?.length));

  __konva.stage = new Konva.Stage({
    container: "kanbaneon-canvas",
    width: largestList > 4 ? width + (largestList - 4) * 295 : width,
    height: largestChildren > 3 ? height + (largestChildren - 3) * 180 : height,
    x: 0,
    y: 0,
  });

  __konva.layer = new Konva.Layer();
  __konva.stage.add(__konva.layer);
  __konva.stage.container().style.cursor = "move";

  this.drawFns().initList();
}
