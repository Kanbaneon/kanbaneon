import Konva from "konva";
import { __dnd, __konva } from "./DrawCanvas";
import { searchIntersection } from "./DrawListItem";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

export default function getTile({ largestChildren, height }) {
  const tile = new Konva.Rect({
    y: 10,
    fill: "#FFFFFF",
    height: largestChildren > 3 ? height + (largestChildren - 3) * 180 : height,
    width: 295,
    cornerRadius: 8,
    shadowBlur: 1,
    draggable: true,
  });

  const kanbanList = isLite
  ? this.$store.getters.kanbanList
  : this.$store?.api?.board?.kanbanList;

  tile.on("dragmove", (e) => {
    const list = e?.currentTarget?.attrs?.listDetails;
    const stage = e.currentTarget.getStage();
    const { x, y } = e.target.position();

    const titleRect = stage.findOne(`#LIST-${list?.id}-TITLE-RECT`);
    titleRect.x(x);
    titleRect.y(y);

    const addMoreButton = stage.findOne(`#LIST-${list?.id}-ADD-MORE-BTN`);
    addMoreButton.x(x + 260);
    addMoreButton.y(y + 25);

    const titleText = stage
      .find(`#LIST-${list?.id}`)
      .find((v) => v instanceof Konva.Text);
    titleText.x(x + 16);
    titleText.y(y + 14);

    e?.currentTarget.moveToTop();
    titleRect.moveToTop();
    titleText.moveToTop();
    addMoreButton.moveToTop();

    const allCards = stage
      .find("Rect")
      .filter(
        (rect) =>
          !!rect.attrs.id && rect.attrs.id.includes(`LIST-${list?.id}-CARD`)
      );

    let yCount = 60;
    allCards.forEach((card) => {
      const relatedText = stage.findOne(
        `#LIST-${list?.id}-TEXT-${card.attrs.cardDetails.id}`
      );

      card.x(x + 10);
      card.y(y + yCount);

      relatedText.x(x + 20);
      relatedText.y(y + yCount + 10);

      card.moveToTop();
      relatedText.moveToTop();
      yCount = yCount + 190;
    });

    const { list: dndList } = searchIntersection(e.currentTarget);
    __dnd.list = dndList;
  });

  tile.on("dragend", (e) => {
    const list = e?.currentTarget?.attrs?.listDetails;
    const dragOverList = __dnd.list;
    if (!!dragOverList) {
      const currentList = kanbanList.find(
        (data) => data?.id === list?.id
      );
      const currentListIndex = kanbanList.findIndex(
        (data) => data?.id === list?.id
      );
      const foundListIndex = kanbanList.findIndex(
        (item) =>
          item?.id.toString() === dragOverList?.attrs?.id.split("LIST-")[1]
      );

      if (currentListIndex > -1 && foundListIndex > -1) {
        this.$store.commit("swapKanbanList", {
          currentListIndex,
          foundListIndex,
          currentList,
        });
      } else if (
        currentListIndex > -1 &&
        dragOverList?.attrs?.id.includes("ADD-MORE")
      ) {
        const lastIndex = kanbanList.length;
        this.$store.commit("swapKanbanList", {
          currentListIndex,
          foundListIndex: lastIndex,
          currentList,
        });
      }
    }
    this.drawFns().initCanvas();

    __dnd.list = null;
    __dnd.item = null;
  });

  tile.on("click", (e) => {
    this.listDialog = {
      ...this.listDialog,
      creating: false,
      visible: true,
      title: "Edit List",
      editingList: {
        ...e?.currentTarget?.attrs?.listDetails,
      },
    };
  });

  return tile;
}
