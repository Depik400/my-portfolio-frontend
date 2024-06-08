type AsyncFn = () => Promise<unknown>;

export function useTrain() {
  function runAsThenable(...vagon: AsyncFn[]) {
    const train = (items: AsyncFn[]) => ({
      then: (res: (e: unknown) => unknown) => {
        //Срабатывает thenable, проверяем, что массив не пустой
        const item = items.shift();
        if (item) {
            //Если массив не пустой, то возвращаем thenable объект в resolve, цепочка замыкается
          res(item().then(() => train(items)));
        } else {
          res(null);
        }
      },
    });
    //Сходу резлвлим thenable объект
    return Promise.resolve(train(vagon));
  }

  //Тоже самое, что сверху, только написано по человечески
  async function runNormal(...vagon: AsyncFn[]) {
    for (const promise of vagon) {
      await promise();
    }
  }
  return {
    runAsThenable,
    runNormal,
  };
}
