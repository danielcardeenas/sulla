import { storeObjects } from './store-objects';

export function getStore(modules) {
  let foundCount = 0;
  let neededObjects = storeObjects;
  for (let idx in modules) {
    if (typeof modules[idx] === 'object' && modules[idx] !== null) {
      let first = Object.values(modules[idx])[0];
      if (typeof first === 'object' && first.exports) {
        for (let idx2 in modules[idx]) {
          let module = modules(idx2);
          if (!module) {
            continue;
          }
          neededObjects.forEach((needObj) => {
            if (!needObj.conditions || needObj.foundedModule) return;
            let neededModule = needObj.conditions(module);
            if (neededModule !== null) {
              foundCount++;
              needObj.foundedModule = neededModule;
            }
          });
          if (foundCount == neededObjects.length) {
            break;
          }
        }

        let neededStore = neededObjects.find(
          (needObj) => needObj.id === 'Store'
        );
        window.Store = neededStore.foundedModule
          ? neededStore.foundedModule
          : {};
        neededObjects.splice(neededObjects.indexOf(neededStore), 1);
        neededObjects.forEach((needObj) => {
          if (needObj.foundedModule) {
            window.Store[needObj.id] = needObj.foundedModule;
          }
        });
        window.Store.sendMessage = function (e) {
          return window.Store.SendTextMsgToChat(this, ...arguments);
        };
        if (window.Store.MediaCollection)
          window.Store.MediaCollection.prototype.processFiles =
            window.Store.MediaCollection.prototype.processFiles ||
            window.Store.MediaCollection.prototype.processAttachments;
        return window.Store;
      }
    }
  }
}
