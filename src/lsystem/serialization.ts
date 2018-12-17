import { useEffect } from "react";

const encodeInURL = (data: any) => {
  const serialized = btoa(JSON.stringify(data));

  history.pushState(null, '', '#' + serialized);
}


let justLoaded = true;


export const useInUrlState = <T>(current: T, update: (value: T) => any) => {
  useEffect(() => {
    if (justLoaded) {
      justLoaded = false;
      if (window.location.hash) {
        try {
          const state = JSON.parse(atob(window.location.hash.slice(1)));
          update(state);
          console.log('Loaded serialized state', state);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      encodeInURL(current);
    }
  }, [current]);
}
