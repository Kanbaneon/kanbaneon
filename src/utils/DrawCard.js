import Konva from "konva";
import { store } from "../store";

export default function getCard({ x }) {
  const card = new Konva.Rect({
    x: x + 10,
    fill: "#35495e",
    height: 180,
    width: 275,
    cornerRadius: 8,
    shadowBlur: 1,
    draggable: true,
  });

  card.on("click", (e) => {
    this.cardDialog = {
      ...this.cardDialog,
      visible: true,
      title: "Edit Card",
      editingCard: {
        ...e?.currentTarget?.attrs?.cardDetails,
        parentList: e?.currentTarget?.attrs?.parentList,
        isWatching: e?.currentTarget?.attrs?.cardDetails?.watchers?.includes(store.state.user.id)
      },
    };
  });

  return card;
}
