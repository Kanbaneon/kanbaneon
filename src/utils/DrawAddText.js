import Konva from "konva";
import { __dnd, __konva } from "./DrawCanvas";
import { searchIntersection } from "./DrawListItem";
import { swapList } from "../helpers/ApiHelper";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

export default function getAddText() {
  const text = new Konva.Text({
    text: "",
    fontSize: 20,
    y: 24,
    width: 290,
    height: 200,
    draggable: true,
  });

  const kanbanList = isLite
    ? this.$store.getters.kanbanList
    : this.$store?.api?.board?.kanbanList;

  text.on("dragmove", (e) => {
    const list = e?.currentTarget?.attrs?.listDetails;
    const stage = e.currentTarget.getStage();
    const { x, y } = e.target.position();

    const titleRect = stage.findOne(`#LIST-${list?.id}-TITLE-RECT`);
    titleRect.x(x - 16);
    titleRect.y(y - 14);

    const addMoreButton = stage.findOne(`#LIST-${list?.id}-ADD-MORE-BTN`);
    addMoreButton.x(x + 244);
    addMoreButton.y(y + 9);

    const tileRect = stage
      .find(`#LIST-${list?.id}`)
      .find((v) => v instanceof Konva.Rect);
    tileRect.x(x - 16);
    tileRect.y(y - 14);

    tileRect.moveToTop();
    titleRect.moveToTop();
    e?.currentTarget.moveToTop();
    addMoreButton.moveToTop();

    const allCards = stage
      .find("Rect")
      .filter(
        (rect) =>
          !!rect.attrs.id && rect.attrs.id.includes(`LIST-${list?.id}-CARD`)
      );

    let yCount = 46;
    allCards.forEach((card) => {
      const relatedText = stage.findOne(
        `#LIST-${list?.id}-TEXT-${card.attrs.cardDetails.id}`
      );

      card.x(x - 5);
      card.y(y + yCount);

      relatedText.x(x + 5);
      relatedText.y(y + yCount + 10);

      card.moveToTop();
      relatedText.moveToTop();
      yCount = yCount + 190;
    });

    const { list: dndList } = searchIntersection(e.currentTarget);
    __dnd.list = dndList;
  });

  text.on("dragend", async (e) => {
    const list = e?.currentTarget?.attrs?.listDetails;
    const dragOverList = __dnd.list;
    if (!!dragOverList) {
      const currentList = kanbanList.find((data) => data?.id === list?.id);
      const currentListIndex = kanbanList.findIndex(
        (data) => data?.id === list?.id
      );
      const foundListIndex = kanbanList.findIndex(
        (item) =>
          item?.id.toString() === dragOverList?.attrs?.id.split("LIST-")[1]
      );

      if (currentListIndex > -1 && foundListIndex > -1) {
        const swappedResult = isLite
          ? this.$store.commit("swapKanbanList", {
              currentListIndex,
              foundListIndex,
              currentList,
            })
          : await swapList(
              this.$store.state.currentBoardID,
              currentListIndex,
              foundListIndex
            );

        if (swappedResult?.board) {
          this.$store.api = {
            board: swappedResult.board,
          };
        }
      } else if (
        currentListIndex > -1 &&
        dragOverList?.attrs?.id.includes("ADD-MORE")
      ) {
        const lastIndex = kanbanList.length;
        const swappedResult = isLite
          ? this.$store.commit("swapKanbanList", {
              currentListIndex,
              foundListIndex: lastIndex,
              currentList,
            })
          : await swapList(
              this.$store.state.currentBoardID,
              currentListIndex,
              lastIndex - 1
            );

        if (swappedResult?.board) {
          this.$store.api = {
            board: swappedResult.board,
          };
        }
      }
    }
    this.drawFns().initCanvas();

    __dnd.list = null;
    __dnd.item = null;
  });

  text.on("click", (e) => {
    if (!e?.currentTarget?.attrs?.listDetails) {
      return (this.listDialog = {
        ...this.listDialog,
        creating: true,
        visible: true,
        title: "Enter the name of new list",
        editingList: {},
      });
    }

    this.listDialog = {
      ...this.listDialog,
      visible: true,
      creating: false,
      title: "Edit List",
      editingList: {
        ...e?.currentTarget?.attrs?.listDetails,
      },
    };
  });

  return text;
}
