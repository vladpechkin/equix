import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

export const DragNDropZone = () => {
  const handleDragEnd: OnDragEndResponder = ({ destination, source }) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    setOrders(
      // @ts-ignore
      orders.map((x) =>
        // @ts-ignore
        x.id === source.index ? { ...x, status: destination.droppableId } : x
      )
    );

    let targetOrder = orders.find(({ id }) => id === source.index);
    if (targetOrder) {
      // @ts-ignore
      targetOrder.state = destination.droppableId;
      // @ts-ignore
      submitEntity("Orders", targetOrder, targetOrder.id);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {states.map((state, index) => (
        <Droppable droppableId={state} key={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2 p-2 w-full min-h-full border border-border rounded-lg"
            >
              <h2 className="font-semibold p-2">
                {capitalize(state.toLowerCase()).replaceAll("_", " ")}
              </h2>
              {orders.map(
                (order, index) =>
                  // @ts-ignore
                  order.state === state && (
                    // <Draggable
                    <div
                      key={index}
                      // draggableId={order.id.toString()}
                      // index={order.id}
                    >
                      {/* {(provided) => ( */}
                      <Link
                        ref={provided.innerRef}
                        // {...provided.draggableProps}
                        // {...provided.dragHandleProps}
                        className="flex flex-col gap-2 text-accent rounded-lg border border-border p-2"
                        // @ts-ignore
                        href={`/orders/${order.id}`}
                      >
                        {/* @ts-ignore */}
                        <span>Order {order.number}</span>
                        <span>
                          {new Date(
                            // @ts-ignore
                            order.createdAt as string
                          ).toLocaleString("ru")}
                        </span>
                      </Link>
                      {/* )} */}
                      {/* </Draggable> */}
                    </div>
                  )
              )}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};
